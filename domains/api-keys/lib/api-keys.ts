import { supabase } from "@/shared/lib/supabase";
import type { ApiKey } from "../types";

interface DbApiKey {
  id: string;
  name: string;
  key: string;
  usage_limit: number;
  created_at: string;
  last_used?: string | null;
}

function toApiKey(dbKey: DbApiKey): ApiKey {
  return {
    id: dbKey.id,
    name: dbKey.name,
    key: dbKey.key,
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

export async function getApiKeys(): Promise<ApiKey[]> {
  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch API keys: ${error.message}`);
  }

  return (data || []).map(toApiKey);
}

export async function addApiKey(key: ApiKey): Promise<ApiKey> {
  const dbKey = toDbApiKey(key);
  const { data, error } = await supabase
    .from("api_keys")
    .insert([dbKey])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create API key: ${error.message}`);
  }

  return toApiKey(data as DbApiKey);
}

export async function updateApiKey(
  id: string,
  updates: Partial<ApiKey>
): Promise<ApiKey | null> {
  const dbUpdates = toDbApiKey(updates);
  const { data, error } = await supabase
    .from("api_keys")
    .update(dbUpdates)
    .eq("id", id)
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

export async function deleteApiKey(id: string): Promise<boolean> {
  const { error } = await supabase.from("api_keys").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete API key: ${error.message}`);
  }

  return true;
}

export async function getApiKeyById(id: string): Promise<ApiKey | null> {
  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // No rows found
    }
    throw new Error(`Failed to fetch API key: ${error.message}`);
  }

  return toApiKey(data as DbApiKey);
}

export async function getApiKeyByKey(key: string): Promise<ApiKey | null> {
  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .eq("key", key)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // No rows found
    }
    throw new Error(`Failed to fetch API key: ${error.message}`);
  }

  return toApiKey(data as DbApiKey);
}
