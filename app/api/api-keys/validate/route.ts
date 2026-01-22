import { NextRequest, NextResponse } from "next/server";
import { getApiKeyByKey } from "../store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key || typeof key !== "string" || key.trim().length === 0) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    const apiKey = await getApiKeyByKey(key.trim());

    if (!apiKey) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    return NextResponse.json({ valid: true, apiKey });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
