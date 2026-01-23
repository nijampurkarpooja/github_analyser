import { Account, AuthOptions, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import { upsertUser } from "./user-service";

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Missing GOOGLE_CLIENT_ID");
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing GOOGLE_CLIENT_SECRET");
}
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Missing NEXTAUTH_SECRET");
}

export const authProviders = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
];

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: authProviders,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  callbacks: {
    async signIn() {
      // This runs during the sign-in flow
      // We could persist here, but jwt callback is better for error handling
      return true;
    },
    async jwt({
      token,
      account,
      user,
    }: {
      token: JWT;
      account: Account | null;
      user: User | null;
    }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.sub = account.provider + "_" + account.providerAccountId;

        try {
          const { isNewUser } = await upsertUser({
            id: token.sub as string,
            email: user.email!,
            name: user.name || null,
            image: user.image || null,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          });

          token.isNewUser = isNewUser;
        } catch (error) {
          console.error("Failed to persist user to Supabase:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub as string;
        // Optionally expose isNewUser flag
        if (token.isNewUser !== undefined) {
          session.user.isNewUser = token.isNewUser as boolean;
        }
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
};
