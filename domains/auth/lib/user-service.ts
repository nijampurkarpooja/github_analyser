import { supabaseServer } from "@/shared/lib/supabase-server";

interface UserRecord {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  provider: string;
  provider_account_id: string;
  created_at: string;
  updated_at: string;
  last_login_at: string;
}

interface CreateUserInput {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  provider: string;
  providerAccountId: string;
}

export async function userExists(userId: string): Promise<boolean> {
  const { data, error } = await supabaseServer
    .from("users")
    .select("id")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows returned (expected for new users)
    console.error("Error checking user existence:", error);
    throw error;
  }

  return !!data;
}

export async function upsertUser(
  input: CreateUserInput
): Promise<{ isNewUser: boolean; user: UserRecord }> {
  try {
    const now = new Date().toISOString();

    const exists = await userExists(input.id);

    if (exists) {
      const { data, error } = await supabaseServer
        .from("users")
        .update({
          email: input.email,
          name: input.name,
          image: input.image,
          updated_at: now,
          last_login_at: now,
        })
        .eq("id", input.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating user:", error);
        throw error;
      }

      return { isNewUser: false, user: data };
    } else {
      const { data, error } = await supabaseServer
        .from("users")
        .insert({
          id: input.id,
          email: input.email,
          name: input.name,
          image: input.image,
          provider: input.provider,
          provider_account_id: input.providerAccountId,
          created_at: now,
          updated_at: now,
          last_login_at: now,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating user:", error);
        throw error;
      }

      return { isNewUser: true, user: data };
    }
  } catch (error) {
    // Handle specific Supabase errors
    if (error instanceof Error && "code" in error && error.code === "23505") {
      // Unique constraint violation (race condition)
      throw new Error("User already exists");
    }
    throw error;
  }
}

export async function getUserById(userId: string): Promise<UserRecord | null> {
  const { data, error } = await supabaseServer
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Error fetching user:", error);
    throw error;
  }

  return data;
}
