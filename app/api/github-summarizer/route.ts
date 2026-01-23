import { getApiKeyByKey } from "@/domains/api-keys/lib/api-keys";
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
        { error: "Invalid GitHub URL format" },
        { status: 400 }
      );
    }

    const githubUrlPattern = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/;
    if (!githubUrlPattern.test(normalizedUrl)) {
      return NextResponse.json(
        { error: "Invalid GitHub URL format" },
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

    const readmeContent = await getReadmeContent(normalizedUrl);
    if (!readmeContent) {
      return NextResponse.json(
        { error: "Failed to fetch README content" },
        { status: 500 }
      );
    }

    const result = await summarizeRepository(readmeContent);

    return NextResponse.json({
      message: "GitHub summarization successful",
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

    return NextResponse.json(
      { error: "Failed to summarize GitHub repository", message: errorMessage },
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

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Repository not found or README does not exist");
      }
      throw new Error(`Failed to fetch README content: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    const originalMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (
      originalMessage.includes("Failed to fetch") ||
      originalMessage.includes("Invalid")
    ) {
      throw error;
    }
    throw new Error(`Failed to fetch README content: ${originalMessage}`);
  }
}
