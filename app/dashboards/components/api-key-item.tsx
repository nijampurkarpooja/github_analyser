"use client";

import { ApiKey } from "@/app/api/api-keys/store";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { maskApiKey } from "../utils";

interface ApiKeyItemProps {
  apiKey: ApiKey;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (name: string, usageLimit: number) => Promise<{ success: boolean; error?: string }>;
  onDelete: () => Promise<{ success: boolean; error?: string }>;
  onCopy: (key: string) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
  isCopied: boolean;
  showToast: (message: string) => void;
}

export function ApiKeyItem({
  apiKey,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  onCopy,
  isVisible,
  onToggleVisibility,
  isCopied,
  showToast,
}: ApiKeyItemProps) {
  const [editName, setEditName] = useState(apiKey.name);
  const [editUsageLimit, setEditUsageLimit] = useState(apiKey.usageLimit);
  const [editUsageLimitError, setEditUsageLimitError] = useState("");

  const handleUpdate = async () => {
    if (!editName.trim()) return;

    setEditUsageLimitError("");
    const result = await onUpdate(editName, editUsageLimit);

    if (result.success) {
      onCancelEdit();
      showToast("API key updated successfully");
    } else {
      setEditUsageLimitError(result.error || "");
      showToast(result.error ? `Failed to update API key: ${result.error}` : "Failed to update API key");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this API key?")) return;
    const result = await onDelete();
    if (result.success) {
      showToast("API key deleted successfully");
    } else {
      showToast(result.error ? `Failed to delete API key: ${result.error}` : "Failed to delete API key");
    }
  };

  const handleCopy = () => {
    onCopy(apiKey.key);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-50">
              Key Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Enter API key name"
              className="w-full rounded-lg border border-solid border-neutral-300 bg-white px-5 py-3 text-neutral-900 placeholder-neutral-500 focus:border-neutral-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder-neutral-400 dark:focus:border-neutral-600"
              aria-label="Edit API key name"
            />
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-50">
              Limit monthly usage
            </label>
            <input
              type="number"
              value={editUsageLimit}
              onChange={(e) => {
                setEditUsageLimit(Number(e.target.value));
                setEditUsageLimitError("");
              }}
              min="1"
              placeholder="1000"
              className={`w-full rounded-lg border border-solid px-5 py-3 text-neutral-900 placeholder-neutral-500 focus:outline-none dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder-neutral-400 ${editUsageLimitError
                ? "border-red-300 focus:border-red-400 dark:border-red-700 dark:focus:border-red-600"
                : "border-neutral-300 focus:border-neutral-400 dark:border-neutral-700 dark:focus:border-neutral-600"
                } bg-white`}
              aria-label="Edit usage limit"
            />
            {editUsageLimitError && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {editUsageLimitError}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancelEdit}
            className="rounded-lg border border-solid border-neutral-300 bg-transparent px-5 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
            {apiKey.name}
          </h3>
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            Usage: {apiKey.usageLimit.toLocaleString()}/month
          </span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <code className="rounded-lg bg-neutral-100 px-3 py-1.5 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
            {isVisible ? apiKey.key : maskApiKey(apiKey.key)}
          </code>
          <button
            onClick={onToggleVisibility}
            className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
            aria-label={isVisible ? "Hide API key" : "Show API key"}
          >
            {isVisible ? (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
          <button
            onClick={handleCopy}
            className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
            aria-label="Copy API key"
          >
            {isCopied ? (
              <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            ) : (
              <ClipboardIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          Created: {new Date(apiKey.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onStartEdit}
          className="rounded-lg border border-solid border-neutral-300 bg-transparent px-5 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
          aria-label="Edit API key"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="rounded-lg border border-solid border-red-300 bg-transparent px-5 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
          aria-label="Delete API key"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
