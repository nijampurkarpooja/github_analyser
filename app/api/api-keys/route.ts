import { NextRequest, NextResponse } from "next/server";
import { addApiKey, getApiKeys, type ApiKey } from "./store";

export async function GET() {
  const apiKeys = getApiKeys();
  return NextResponse.json(apiKeys);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, usageLimit } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
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
    };

    addApiKey(newKey);

    return NextResponse.json(newKey, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
