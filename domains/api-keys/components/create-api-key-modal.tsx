"use client";

import { FormEvent, useState } from "react";

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (
    name: string,
    usageLimit: number
  ) => Promise<{ success: boolean; error?: string }>;
  showToast: (
    message: string,
    variant?: "success" | "error" | "info" | "warning"
  ) => void;
}

export function CreateApiKeyModal({
  isOpen,
  onClose,
  onCreate,
  showToast,
}: CreateApiKeyModalProps) {
  const [name, setName] = useState("");
  const [usageLimit, setUsageLimit] = useState(1000);
  const [usageLimitError, setUsageLimitError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setUsageLimitError("");
    setIsCreating(true);
    const result = await onCreate(name, usageLimit);
    setIsCreating(false);

    if (result.success) {
      setName("");
      setUsageLimit(1000);
      setUsageLimitError("");
      onClose();
      showToast("API key created successfully", "success");
    } else {
      setUsageLimitError(result.error || "");
      showToast(
        result.error
          ? `Failed to create API key: ${result.error}`
          : "Failed to create API key",
        "error"
      );
    }
  };

  const handleClose = () => {
    setName("");
    setUsageLimit(1000);
    setUsageLimitError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-solid border-neutral-200 bg-white p-8 shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          Create a new API key
        </h2>
        <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">
          Enter a name and limit for the new API key.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-50">
              Key Name — A unique name to identify this key
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Key Name"
              className="w-full rounded-lg border border-solid border-neutral-300 bg-white px-5 py-3 text-neutral-900 placeholder-neutral-500 focus:border-neutral-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder-neutral-400 dark:focus:border-neutral-600"
              required
              aria-label="API key name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-50">
              Limit monthly usage*
            </label>
            <input
              type="number"
              value={usageLimit}
              onChange={(e) => {
                setUsageLimit(Number(e.target.value));
                setUsageLimitError("");
              }}
              min="1"
              placeholder="1000"
              className={`w-full rounded-lg border border-solid px-5 py-3 text-neutral-900 placeholder-neutral-500 focus:outline-none dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder-neutral-400 ${
                usageLimitError
                  ? "border-red-300 focus:border-red-400 dark:border-red-700 dark:focus:border-red-600"
                  : "border-neutral-300 focus:border-neutral-400 dark:border-neutral-700 dark:focus:border-neutral-600"
              } bg-white`}
              required
              aria-label="Usage limit"
            />
            {usageLimitError && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {usageLimitError}
              </p>
            )}
            <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
              * If the combined usage of all your keys exceeds your plan limit,
              all requests will be rejected.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-solid border-neutral-300 bg-transparent px-5 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-100"
            >
              {isCreating ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
