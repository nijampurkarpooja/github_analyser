import {
  getApiKeyByKey,
  incrementApiKeyUsage,
} from "@/domains/api-keys/lib/api-keys";
import { getAuthSession } from "@/domains/auth/lib/auth-server";
import { getReadmeContent } from "@/domains/github/lib/readme";
import { getRepositoryMetadata } from "@/domains/github/lib/repository-metadata";
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

    // Fetch repository metadata and README content in parallel for better performance
    const [repositoryMetadata, readmeContent] = await Promise.all([
      getRepositoryMetadata(normalizedUrl),
      getReadmeContent(normalizedUrl),
    ]);

    // Add timeout for summarization (60 seconds)
    const summarizationPromise = summarizeRepository(
      readmeContent,
      repositoryMetadata
    );

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

    if (errorMessage.includes("not found")) {
      return NextResponse.json({ error: errorMessage }, { status: 404 });
    }

    return NextResponse.json(
      { error: errorMessage || "Failed to summarize GitHub repository" },
      { status: 500 }
    );
  }
}
