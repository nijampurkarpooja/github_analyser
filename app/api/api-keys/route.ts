import { addApiKey, getApiKeys } from "@/domains/api-keys/lib/api-keys";
import type { ApiKey } from "@/domains/api-keys/types";
import { getAuthSession } from "@/domains/auth/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const apiKeys = await getApiKeys(session.user.id);
    return NextResponse.json(apiKeys);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch API keys",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, usageLimit } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (
      usageLimit === undefined ||
      typeof usageLimit !== "number" ||
      usageLimit < 0
    ) {
      return NextResponse.json(
        { error: "Usage limit must be a non-negative number" },
        { status: 400 }
      );
    }

    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      name: name.trim(),
      key: `sk_${crypto.randomUUID().replace(/-/g, "")}`,
      usageLimit: usageLimit,
      createdAt: new Date().toISOString(),
      userId: session.user.id,
    };

    const createdKey = await addApiKey(session.user.id, newKey);

    if (!createdKey) {
      return NextResponse.json(
        { error: "Failed to create API key" },
        { status: 500 }
      );
    }

    return NextResponse.json(createdKey, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
