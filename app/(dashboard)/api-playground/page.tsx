"use client";

import { Toast, useToast } from "@/shared/components/ui/toast";
import { api } from "@/shared/lib/api-client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function ApiPlaygroundPage() {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const { toasts, showToast, removeToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      showToast("Please enter an API key", "error");
      return;
    }

    setIsValidating(true);

    try {
      const response = await api.post("/api/api-keys/validate", {
        key: apiKey.trim(),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        showToast("API key validated successfully", "success");
        router.push("/dashboard");
      } else {
        showToast(data.error || "Invalid API key", "error");
      }
    } catch (error) {
      console.error("Failed to validate API key:", error);
      showToast("Failed to validate API key. Please try again.", "error");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold leading-relaxed text-neutral-900 dark:text-neutral-50">
          API Playground
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          Enter your API key to access the protected dashboard
        </p>
      </div>

      <div className="rounded-2xl border border-solid border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-50">
              API Key
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="w-full rounded-lg border border-solid border-neutral-300 bg-white px-5 py-3 text-neutral-900 placeholder-neutral-500 focus:border-neutral-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder-neutral-400 dark:focus:border-neutral-600"
              required
              aria-label="API key"
              disabled={isValidating}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isValidating}
              className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
              {isValidating ? "Validating..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
          variant={toast.variant}
        />
      ))}
    </div>
  );
}
