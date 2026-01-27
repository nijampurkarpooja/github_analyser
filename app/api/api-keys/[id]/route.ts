import {
  getApiKeyById,
  deleteApiKey as removeApiKey,
  updateApiKey,
} from "@/domains/api-keys/lib/api-keys";
import { getAuthSession } from "@/domains/auth/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const key = await getApiKeyById(id, session.user.id);

    if (!key) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    return NextResponse.json(key);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch API key",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      if (typeof usageLimit !== "number" || usageLimit < 1) {
        return NextResponse.json(
          { error: "Usage limit must be at least 1" },
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

    const updatedKey = await updateApiKey(id, updates, session.user.id);

    if (!updatedKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    return NextResponse.json(updatedKey);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Failed to update API key";

    const statusCode = errorMessage.includes("Unauthorized")
      ? 401
      : errorMessage.includes("required") || errorMessage.includes("Invalid")
        ? 400
        : 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const key = await getApiKeyById(id, session.user.id);
    if (!key) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    await removeApiKey(id, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete API key",
      },
      { status: 500 }
    );
  }
}
