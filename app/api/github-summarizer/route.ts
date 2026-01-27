import {
  getApiKeyByKey,
  incrementApiKeyUsage,
} from "@/domains/api-keys/lib/api-keys";
import { getAuthSession } from "@/domains/auth/lib/auth-server";
import { summarizeRepository } from "@/domains/github/lib/summarizer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { githubUrl } = body;

    if (
      !githubUrl ||
      typeof githubUrl !== "string" ||
      githubUrl.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "githubUrl is required and cannot be empty" },
        { status: 400 }
      );
    }

    const normalizedUrl = githubUrl
      .split("?")[0]
      .split("#")[0]
      .replace(/\/$/, "");

    if (normalizedUrl.length === 0) {
      return NextResponse.json(
        { error: "Invalid GitHub URL format. URL cannot be empty." },
        { status: 400 }
      );
    }

    // Enhanced validation: supports https://github.com/owner/repo format
    // Does not support branch/tag URLs or subdirectories (only main repo README)
    const githubUrlPattern = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/;
    if (!githubUrlPattern.test(normalizedUrl)) {
      return NextResponse.json(
        {
          error:
            "Invalid GitHub URL format. Expected format: https://github.com/owner/repo",
        },
        { status: 400 }
      );
    }

    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    const apiKeyObject = await getApiKeyByKey(apiKey.trim(), session.user.id);
    if (!apiKeyObject) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    if (apiKeyObject.usage >= apiKeyObject.usageLimit) {
      return NextResponse.json(
        { error: "API key usage limit exceeded" },
        { status: 429 }
      );
    }

    const readmeContent = await getReadmeContent(normalizedUrl);
    if (!readmeContent) {
      return NextResponse.json(
        { error: "Failed to fetch README content from GitHub" },
        { status: 500 }
      );
    }

    // Add timeout for summarization (60 seconds)
    const summarizationPromise = summarizeRepository(readmeContent);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Summarization timeout: Process took longer than 60 seconds"
            )
          ),
        60000
      )
    );

    const result = await Promise.race([summarizationPromise, timeoutPromise]);

    try {
      await incrementApiKeyUsage(apiKey.trim(), session.user.id);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      if (errorMessage.includes("usage limit exceeded")) {
        return NextResponse.json(
          { error: "API key usage limit exceeded" },
          { status: 429 }
        );
      }
      throw error;
    }

    return NextResponse.json({
      result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    if (
      errorMessage.includes("Invalid GitHub URL format") ||
      errorMessage.includes("Invalid JSON in request body")
    ) {
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    if (errorMessage.includes("Unauthorized")) {
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    if (errorMessage.includes("usage limit exceeded")) {
      return NextResponse.json({ error: errorMessage }, { status: 429 });
    }

    if (
      errorMessage.includes("rate limit exceeded") ||
      errorMessage.includes("GitHub API rate limit")
    ) {
      return NextResponse.json({ error: errorMessage }, { status: 429 });
    }

    if (errorMessage.includes("timeout")) {
      return NextResponse.json({ error: errorMessage }, { status: 504 });
    }

    return NextResponse.json(
      { error: errorMessage || "Failed to summarize GitHub repository" },
      { status: 500 }
    );
  }
}

async function getReadmeContent(githubUrl: string) {
  try {
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
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;

    // Add timeout for GitHub API call (30 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(apiUrl, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Repository not found or README does not exist");
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
          `Failed to fetch README content: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.content || typeof data.content !== "string") {
        throw new Error("README content is missing or invalid");
      }

      const content = Buffer.from(data.content, "base64").toString("utf-8");
      return content;
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
      originalMessage.includes("timeout")
    ) {
      throw error;
    }
    throw new Error(`Failed to fetch README content: ${originalMessage}`);
  }
}
