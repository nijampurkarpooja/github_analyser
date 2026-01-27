import {
  createTimeoutController,
  handleGitHubApiError,
  parseGitHubUrl,
} from "./github-api-utils";
import { RepositoryMetadata } from "./types";

const GITHUB_API_HEADERS = {
  Accept: "application/vnd.github.v3+json",
};

export async function getRepositoryMetadata(
  githubUrl: string
): Promise<RepositoryMetadata> {
  try {
    const { baseApiUrl, owner, repo } = parseGitHubUrl(githubUrl);
    const { controller, timeoutId } = createTimeoutController(30000);

    try {
      // Make parallel API calls for better performance
      const [
        repoResponse,
        languagesResponse,
        releasesResponse,
        commitsResponse,
        closedIssuesResponse,
      ] = await Promise.allSettled([
        // Main repository data
        fetch(`${baseApiUrl}`, {
          headers: { ...GITHUB_API_HEADERS },
          signal: controller.signal,
        }),
        // All languages
        fetch(`${baseApiUrl}/languages`, {
          headers: { ...GITHUB_API_HEADERS },
          signal: controller.signal,
        }),
        // Latest release (may 404 if no releases exist)
        fetch(`${baseApiUrl}/releases/latest`, {
          headers: { ...GITHUB_API_HEADERS },
          signal: controller.signal,
        }),
        // Latest commit for activity check
        fetch(`${baseApiUrl}/commits?per_page=1`, {
          headers: { ...GITHUB_API_HEADERS },
          signal: controller.signal,
        }),
        // Closed issues count (using search API)
        fetch(
          `https://api.github.com/search/issues?q=repo:${owner}/${repo}+state:closed&per_page=1`,
          {
            headers: { ...GITHUB_API_HEADERS },
            signal: controller.signal,
          }
        ),
      ]);

      clearTimeout(timeoutId);

      // Handle main repository response
      if (repoResponse.status === "rejected") {
        throw repoResponse.reason;
      }

      if (!repoResponse.value.ok) {
        handleGitHubApiError(
          repoResponse.value,
          "Failed to fetch repository data"
        );
      }

      const repoData = await repoResponse.value.json();

      // Extract languages
      let languages: string[] = [];
      if (
        languagesResponse.status === "fulfilled" &&
        languagesResponse.value.ok
      ) {
        const languagesData = await languagesResponse.value.json();
        languages = Object.keys(languagesData).sort(
          (a, b) => languagesData[b] - languagesData[a]
        );
      } else if (repoData.language) {
        // Fallback to primary language if languages endpoint fails
        languages = [repoData.language];
      }

      // Extract latest version
      let latestVersion: string | null = null;
      if (
        releasesResponse.status === "fulfilled" &&
        releasesResponse.value.ok
      ) {
        const releaseData = await releasesResponse.value.json();
        latestVersion = releaseData.tag_name || releaseData.name || null;
      } else {
        // Fallback: try to get latest tag if no releases exist
        try {
          const tagsResponse = await fetch(`${baseApiUrl}/tags?per_page=1`, {
            headers: { ...GITHUB_API_HEADERS },
            signal: controller.signal,
          });
          if (tagsResponse.ok) {
            const tagsData = await tagsResponse.json();
            if (tagsData.length > 0) {
              latestVersion = tagsData[0].name;
            }
          }
        } catch {
          // If tags also fail, latestVersion remains null
        }
      }

      // Extract last commit date
      let lastCommitDate: string | null = null;
      if (commitsResponse.status === "fulfilled" && commitsResponse.value.ok) {
        const commitsData = await commitsResponse.value.json();
        if (commitsData.length > 0 && commitsData[0].commit?.committer?.date) {
          lastCommitDate = commitsData[0].commit.committer.date;
        }
      }

      // Extract closed issues count
      let closedIssues = 0;
      if (
        closedIssuesResponse.status === "fulfilled" &&
        closedIssuesResponse.value.ok
      ) {
        const closedIssuesData = await closedIssuesResponse.value.json();
        closedIssues = closedIssuesData.total_count || 0;
      }

      return {
        stars: repoData.stargazers_count || 0,
        latestVersion,
        lastUpdated:
          repoData.updated_at ||
          repoData.created_at ||
          new Date().toISOString(),
        lastCommitDate,
        languages,
        openIssues: repoData.open_issues_count || 0,
        closedIssues,
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        throw new Error(
          "Request timeout: GitHub API did not respond within 30 seconds"
        );
      }
      throw fetchError;
    }
  } catch (error) {
    const originalMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (
      originalMessage.includes("Failed to fetch") ||
      originalMessage.includes("Invalid") ||
      originalMessage.includes("timeout") ||
      originalMessage.includes("not found")
    ) {
      throw error;
    }
    throw new Error(`Failed to fetch repository metadata: ${originalMessage}`);
  }
}
