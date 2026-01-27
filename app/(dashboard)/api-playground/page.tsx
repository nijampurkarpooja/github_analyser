"use client";

import { Toast, useToast } from "@/shared/components/ui/toast";
import { api } from "@/shared/lib/api-client";
import { FormEvent, useState } from "react";

interface Summary {
  summary: string;
  cool_facts: string[];
  stars: number;
  latest_version: string | null;
  is_active: boolean;
  maintenance_status: string;
  programming_languages: string[];
  open_issues: number;
  closed_issues: number;
  total_issues: number;
}

export default function ApiPlaygroundPage() {
  const [apiKey, setApiKey] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const { toasts, showToast, removeToast } = useToast();

  const handleKeyValidation = async (e: FormEvent) => {
    e.preventDefault();

    if (!apiKey.trim()) {
      showToast("Please enter an API key", "error");
      return;
    }

    setIsValidating(true);
    setIsKeyValid(false);

    try {
      const response = await api.post("/api/api-keys/validate", undefined, {
        headers: { "x-api-key": apiKey.trim() },
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setIsKeyValid(true);
        showToast("API key validated successfully", "success");
      } else {
        showToast(data.error || "Invalid API key", "error");
        setIsKeyValid(false);
      }
    } catch (error) {
      console.error("Failed to validate API key:", error);
      showToast("Failed to validate API key. Please try again.", "error");
      setIsKeyValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSummarizeRepository = async (e: FormEvent) => {
    e.preventDefault();

    setIsSummarizing(true);
    setSummary(null);

    if (!githubUrl.trim()) {
      showToast("Please enter a GitHub URL", "error");
      return;
    }

    if (!apiKey.trim()) {
      showToast("Please enter an API key", "error");
      return;
    }

    try {
      const response = await api.post(
        "/api/github-summarizer",
        { githubUrl: githubUrl },
        { headers: { "x-api-key": apiKey } }
      );

      const data = await response.json();
      if (response.ok) {
        showToast("Repository summarized successfully", "success");
        setSummary(data.result as Summary);
      } else {
        showToast(data.error || "Failed to summarize repository", "error");
        setSummary(null);
      }
    } catch (error) {
      console.error("Failed to summarize repository:", error);
      showToast("Failed to summarize repository. Please try again.", "error");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold leading-relaxed text-neutral-900 dark:text-neutral-50">
          API Playground
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          Enter your API key to access the API playground
        </p>
      </div>

      <div className="rounded-2xl border border-solid border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
        <form onSubmit={handleKeyValidation} className="flex flex-col gap-6">
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

      {isKeyValid && (
        <div className="mt-6 rounded-lg border border-solid border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <form
            onSubmit={handleSummarizeRepository}
            className="flex flex-col gap-6"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-50">
                GitHub URL
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="Enter your GitHub URL"
                className="w-full rounded-lg border border-solid border-neutral-300 bg-white px-5 py-3 text-neutral-900 placeholder-neutral-500 focus:border-neutral-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder-neutral-400 dark:focus:border-neutral-600"
                required
                aria-label="GitHub URL"
                disabled={isSummarizing}
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="submit"
                disabled={isSummarizing}
                className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-100"
              >
                {isSummarizing ? "Summarizing..." : "Summarize"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setGithubUrl("");
                  setIsSummarizing(false);
                }}
                disabled={isSummarizing}
                className="rounded-lg border border-solid border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-900 placeholder-neutral-500 focus:border-neutral-400 focus:outline-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder-neutral-400 dark:focus:border-neutral-600 dark:disabled:opacity-50"
              >
                Clear
              </button>
            </div>

            {isSummarizing && (
              <div className="mt-6">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Summarizing repository...
                </p>
              </div>
            )}

            {/* JSON View */}
            {summary !== null && (
              <div className="mt-6">
                <pre className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
                  {JSON.stringify(summary, null, 2)}
                </pre>
              </div>
            )}
          </form>
        </div>
      )}

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
