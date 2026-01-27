import { supabaseServer } from "@/shared/lib/supabase-server";
import type { ApiKey } from "../types";

interface DbApiKey {
  id: string;
  name: string;
  key: string;
  user_id: string;
  usage_limit: number;
  usage: number;
  created_at: string;
  last_used?: string | null;
}

function toApiKey(dbKey: DbApiKey): ApiKey {
  return {
    id: dbKey.id,
    name: dbKey.name,
    key: dbKey.key,
    userId: dbKey.user_id,
    usageLimit: dbKey.usage_limit,
    usage: dbKey.usage,
    createdAt: dbKey.created_at,
    lastUsed: dbKey.last_used || undefined,
  };
}

function toDbApiKey(key: Partial<ApiKey>): Partial<DbApiKey> {
  const dbKey: Partial<DbApiKey> = {};
  if (key.id !== undefined) dbKey.id = key.id;
  if (key.name !== undefined) dbKey.name = key.name;
  if (key.key !== undefined) dbKey.key = key.key;
  if (key.usageLimit !== undefined) dbKey.usage_limit = key.usageLimit;
  if (key.usage !== undefined) dbKey.usage = key.usage;
  if (key.createdAt !== undefined) dbKey.created_at = key.createdAt;
  if (key.lastUsed !== undefined) dbKey.last_used = key.lastUsed || null;
  return dbKey;
}

export async function getApiKeys(userId: string): Promise<ApiKey[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const { data, error } = await supabaseServer
    .from("api_keys")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch API keys: ${error.message}`);
  }

  return (data || []).map(toApiKey);
}

export async function addApiKey(userId: string, key: ApiKey): Promise<ApiKey> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const dbKey = toDbApiKey(key);
  const insertData = {
    ...dbKey,
    user_id: userId,
    name: dbKey.name || key.name,
    key: dbKey.key || key.key,
    usage_limit: dbKey.usage_limit ?? key.usageLimit ?? 0,
    usage: dbKey.usage ?? key.usage ?? 0,
  };

  const { data, error } = await supabaseServer
    .from("api_keys")
    .insert([insertData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create API key: ${error.message}`);
  }

  return toApiKey(data as DbApiKey);
}

export async function updateApiKey(
  id: string,
  updates: Partial<ApiKey>,
  userId: string
): Promise<ApiKey | null> {
  if (!id) {
    throw new Error("Key ID is required");
  }
  if (!userId) {
    throw new Error("User ID is required");
  }

  const dbUpdates = toDbApiKey(updates);
  const { data, error } = await supabaseServer
    .from("api_keys")
    .update(dbUpdates)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // No rows returned
    }
    throw new Error(`Failed to update API key: ${error.message}`);
  }

  return toApiKey(data as DbApiKey);
}

export async function deleteApiKey(
  id: string,
  userId: string
): Promise<boolean> {
  if (!id) {
    throw new Error("Key ID is required");
  }
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { error } = await supabaseServer
    .from("api_keys")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to delete API key: ${error.message}`);
  }

  return true;
}

export async function getApiKeyById(
  id: string,
  userId: string
): Promise<ApiKey | null> {
  if (!id) {
    throw new Error("Key ID is required");
  }
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data, error } = await supabaseServer
    .from("api_keys")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // No rows found
    }
    throw new Error(`Failed to fetch API key: ${error.message}`);
  }

  return toApiKey(data as DbApiKey);
}

export async function getApiKeyByKey(
  key: string,
  userId: string
): Promise<ApiKey | null> {
  if (!key) {
    throw new Error("Key is required");
  }
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data, error } = await supabaseServer
    .from("api_keys")
    .select("*")
    .eq("key", key)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // No rows found
    }
    throw new Error(`Failed to fetch API key: ${error.message}`);
  }

  return toApiKey(data as DbApiKey);
}

export async function getApiKeyUsage(
  key: string,
  userId: string
): Promise<{ usage: number; usageLimit: number }> {
  if (!key) {
    throw new Error("Key is required");
  }
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data, error } = await supabaseServer
    .from("api_keys")
    .select("usage,usage_limit")
    .eq("key", key)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch API key usage: ${error.message}`);
  }

  if (!data) {
    throw new Error("API key not found");
  }

  return { usage: data.usage ?? 0, usageLimit: data.usage_limit ?? 0 };
}

export async function hasApiKeyReachedUsageLimit(
  key: string,
  userId: string
): Promise<boolean> {
  if (!key) {
    throw new Error("API key is required");
  }
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { usage, usageLimit } = await getApiKeyUsage(key, userId);
  return usage >= usageLimit;
}

export async function incrementApiKeyUsage(
  key: string,
  userId: string
): Promise<ApiKey | null> {
  if (!key) {
    throw new Error("Key is required");
  }
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Use atomic database function to increment usage and check limit
  const { data, error } = await supabaseServer.rpc("increment_api_key_usage", {
    p_key: key,
    p_user_id: userId,
  });

  if (error) {
    if (error.message.includes("usage limit exceeded")) {
      throw new Error("API key usage limit exceeded");
    }
    throw new Error(`Failed to increment API key usage: ${error.message}`);
  }

  if (!data || data.length === 0) {
    // Key doesn't exist or limit was reached
    return null;
  }

  return toApiKey(data[0] as DbApiKey);
}
