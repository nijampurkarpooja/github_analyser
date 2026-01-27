import {
  createTimeoutController,
  handleGitHubApiError,
  parseGitHubUrl,
} from "./github-api-utils";

export async function getReadmeContent(githubUrl: string): Promise<string> {
  try {
    const { baseApiUrl } = parseGitHubUrl(githubUrl);
    const apiUrl = `${baseApiUrl}/readme`;

    const { controller, timeoutId } = createTimeoutController(30000);

    try {
      const response = await fetch(apiUrl, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        handleGitHubApiError(response, "Failed to fetch README content");
      }

      const data = await response.json();

      if (!data.content || typeof data.content !== "string") {
        throw new Error("README content is missing or invalid");
      }

      return Buffer.from(data.content, "base64").toString("utf-8");
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
    throw new Error(`Failed to fetch README content: ${originalMessage}`);
  }
}
