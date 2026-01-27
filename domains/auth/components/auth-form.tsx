"use client";

import { useToast } from "@/shared/components/ui/toast";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      const result = await signIn("google", {
        callbackUrl,
        redirect: true,
      });

      if (result?.error) {
        setError("Failed to sign in. Please try again.");
      }

      if (result?.ok) {
        showToast("Signed in successfully", "success");
        router.push(callbackUrl);
      } else {
        setError("Failed to sign in. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          Welcome to CodeSight AI
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Get started by signing in with your Google account.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-700"
      >
        {isLoading ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-600 dark:border-t-neutral-50" />
            <span>Signing in...</span>
          </>
        ) : (
          <>
            <FcGoogle className="h-5 w-5" />
            <span>Continue with Google</span>
          </>
        )}
      </button>

      <div className="mt-6 text-center text-sm">
        <p className="mt-2">
          <Link
            href="/"
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
          >
            ← Back to home
          </Link>
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
        By continuing, you agree to our{" "}
        <Link
          href="/terms"
          className="hover:text-neutral-700 dark:hover:text-neutral-300"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="hover:text-neutral-700 dark:hover:text-neutral-300"
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
