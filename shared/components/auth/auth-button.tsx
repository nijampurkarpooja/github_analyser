"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-9 w-20 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || ""}
              width={28}
              height={28}
              className="rounded-full"
            />
          )}
          {session.user?.name || session.user?.email}
        </span>
        <button
          onClick={() => signOut()}
          className="rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-700"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
    >
      <FcGoogle className="mr-2 h-4 w-4" />
      Sign in with Google
    </button>
  );
}
