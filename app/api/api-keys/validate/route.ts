import { getApiKeyByKey } from "@/domains/api-keys/lib/api-keys";
import { getAuthSession } from "@/domains/auth/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = request.headers.get("x-api-key");
    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    const trimmedKey = apiKey.trim();
    const apiKeyRegex = /^sk_[a-zA-Z0-9]{32}$/;
    if (!apiKeyRegex.test(trimmedKey)) {
      return NextResponse.json(
        { error: "Invalid API key format" },
        { status: 400 }
      );
    }

    let apiKeyRecord;
    try {
      apiKeyRecord = await getApiKeyByKey(trimmedKey, session.user.id);
    } catch (dbError) {
      if (dbError instanceof Error) {
        const errorMessage = dbError.message.toLowerCase();

        if (
          errorMessage.includes("connection") ||
          errorMessage.includes("network")
        ) {
          return NextResponse.json(
            { error: "Service temporarily unavailable" },
            { status: 503 }
          );
        }

        console.error("Database error during API key validation:", {
          userId: session.user.id,
          error: dbError.message,
          timestamp: new Date().toISOString(),
        });
      }

      return NextResponse.json(
        { error: "Failed to validate API key" },
        { status: 500 }
      );
    }

    if (!apiKeyRecord) {
      console.warn("Invalid API key validation attempt", {
        userId: session.user.id,
        keyPrefix: trimmedKey.substring(0, 5) + "...",
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    return NextResponse.json({
      valid: true,
      usage: apiKeyRecord.usage,
      usageLimit: apiKeyRecord.usageLimit,
      remaining: Math.max(0, apiKeyRecord.usageLimit - apiKeyRecord.usage),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    console.error("Unexpected error in API key validation:", {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: "Failed to validate API key" },
      { status: 500 }
    );
  }
}
