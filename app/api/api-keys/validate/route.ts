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

    const apiKeyRecord = await getApiKeyByKey(apiKey.trim(), session.user.id);

    if (!apiKeyRecord) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    return NextResponse.json({
      valid: true,
      usage: apiKeyRecord.usage,
      usageLimit: apiKeyRecord.usageLimit,
      remaining: Math.max(0, apiKeyRecord.usageLimit - apiKeyRecord.usage),
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to validate API key",
      },
      { status: 500 }
    );
  }
}
