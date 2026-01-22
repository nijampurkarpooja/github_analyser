import { NextRequest, NextResponse } from "next/server";
import { getApiKeyByKey } from "../../../shared/lib/api-keys";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { githubUrl } = body;

    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
      return NextResponse.json(
        { message: "API key is required" },
        { status: 400 }
      );
    }

    const apiKeyObject = await getApiKeyByKey(apiKey.trim());

    if (!apiKeyObject) {
      return NextResponse.json(
        { message: "Invalid API key" },
        { status: 401 }
      );
    }

    const readmeContent = await getReadmeContent(githubUrl);

    if (!readmeContent) {
      return NextResponse.json(
        { message: "Failed to fetch README content" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "GitHub summarization successful", readmeContent });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to summarize GitHub repository" },
      { status: 500 }
    );
  }
}

async function getReadmeContent(githubUrl: string) {
  const owner = githubUrl.split("/")[3];
  const repo = githubUrl.split("/")[4];
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;

  const response = await fetch(apiUrl, {
    headers: {
      "Accept": "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch README content: ${response.statusText}`);
  }

  return await response.text();
}
