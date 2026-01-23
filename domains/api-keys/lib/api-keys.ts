import { supabase } from "@/shared/lib/supabase";
import type { ApiKey } from "../types";

interface DbApiKey {
  id: string;
  name: string;
  key: string;
  user_id: string;
  usage_limit: number;
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
    createdAt: dbKey.created_at,
    lastUsed: dbKey.last_used || undefined,
  };
}

function toDbApiKey(key: Partial<ApiKey>): Partial<DbApiKey> {
  const dbKey: Partial<DbApiKey> = {};
  if (key.name !== undefined) dbKey.name = key.name;
  if (key.key !== undefined) dbKey.key = key.key;
  if (key.usageLimit !== undefined) dbKey.usage_limit = key.usageLimit;
  if (key.createdAt !== undefined) dbKey.created_at = key.createdAt;
  if (key.lastUsed !== undefined) dbKey.last_used = key.lastUsed || null;
  return dbKey;
}

export async function getApiKeys(userId: string): Promise<ApiKey[]> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data, error } = await supabase
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
  const { data, error } = await supabase
    .from("api_keys")
    .insert([{ ...dbKey, user_id: userId }])
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
  if (!userId) {
    throw new Error("User ID is required");
  }

  const dbUpdates = toDbApiKey(updates);
  const { data, error } = await supabase
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
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { error } = await supabase
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
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data, error } = await supabase
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
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { data, error } = await supabase
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
