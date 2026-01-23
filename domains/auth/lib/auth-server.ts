import { getServerSession } from "next-auth/next";
import { authOptions } from "./config";

export async function getAuthSession() {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  if (!userId || typeof userId !== "string") {
    if (process.env.NODE_ENV === "development") {
      console.error("User ID is missing or invalid", {
        hasSession: !!session,
        hasUser: !!session?.user,
        userIdType: typeof session?.user?.id,
      });
    }
    return null;
  }
  return session;
}

export async function getCurrentUser() {
  const session = await getAuthSession();
  return session?.user;
}
