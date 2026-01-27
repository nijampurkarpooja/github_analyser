export interface ParsedGitHubUrl {
  owner: string;
  repo: string;
  baseApiUrl: string;
}

export function parseGitHubUrl(githubUrl: string): ParsedGitHubUrl {
  let url: URL;
  try {
    url = new URL(githubUrl);
  } catch {
    throw new Error("Invalid GitHub URL format");
  }

  const pathParts = url.pathname.split("/").filter(Boolean);

  if (pathParts.length < 2 || url.hostname !== "github.com") {
    throw new Error("Invalid GitHub URL format");
  }

  const owner = pathParts[0];
  const repo = pathParts[1];
  const baseApiUrl = `https://api.github.com/repos/${owner}/${repo}`;

  return { owner, repo, baseApiUrl };
}

export function handleGitHubApiError(
  response: Response,
  defaultMessage: string
): never {
  if (response.status === 404) {
    throw new Error("Repository not found");
  }

  if (response.status === 403 || response.status === 429) {
    const rateLimitReset = response.headers.get("X-RateLimit-Reset");
    let errorMessage = "GitHub API rate limit exceeded";

    if (rateLimitReset) {
      const resetDate = new Date(parseInt(rateLimitReset) * 1000);
      const minutesUntilReset = Math.ceil(
        (resetDate.getTime() - Date.now()) / 60000
      );
      errorMessage += `. Try again in ${minutesUntilReset} minute${minutesUntilReset !== 1 ? "s" : ""}`;
    }

    throw new Error(errorMessage);
  }

  throw new Error(
    `${defaultMessage}: ${response.statusText} (${response.status})`
  );
}

export function createTimeoutController(timeoutMs: number = 30000): {
  controller: AbortController;
  timeoutId: NodeJS.Timeout;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
}
