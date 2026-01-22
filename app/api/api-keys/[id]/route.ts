import { NextRequest, NextResponse } from "next/server";
import {
  getApiKeyById,
  deleteApiKey as removeApiKey,
  updateApiKey,
} from "../store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const key = getApiKeyById(id);

  if (!key) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 });
  }

  return NextResponse.json(key);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, usageLimit } = body;

    const updates: { name?: string; usageLimit?: number } = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          { error: "Name must be a non-empty string" },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (usageLimit !== undefined) {
      if (typeof usageLimit !== "number" || usageLimit < 0) {
        return NextResponse.json(
          { error: "Usage limit must be a non-negative number" },
          { status: 400 }
        );
      }
      updates.usageLimit = usageLimit;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "At least one field (name or usageLimit) must be provided" },
        { status: 400 }
      );
    }

    const updatedKey = updateApiKey(id, updates);

    if (!updatedKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    return NextResponse.json(updatedKey);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = removeApiKey(id);

  if (!success) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
