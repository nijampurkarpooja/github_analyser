"use client";

import { Toast, useToast } from "@/shared/components/toast";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  usageLimit: number;
  createdAt: string;
  lastUsed?: string;
}

export default function DashboardsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newUsageLimit, setNewUsageLimit] = useState(1000);
  const [newUsageLimitError, setNewUsageLimitError] = useState("");
  const [editKeyName, setEditKeyName] = useState("");
  const [editUsageLimit, setEditUsageLimit] = useState(0);
  const [editUsageLimitError, setEditUsageLimitError] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const { toasts, showToast, removeToast } = useToast();

  const fetchApiKeys = async () => {
    try {
      const response = await fetch("/api/api-keys");
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data);
      }
    } catch (error) {
      console.error("Failed to fetch API keys:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newKeyName.trim()) {
      return;
    }

    if (newUsageLimit <= 0) {
      setNewUsageLimitError("Monthly usage must be greater than 0");
      return;
    }

    setNewUsageLimitError("");
    setIsCreating(true);
    try {
      const response = await fetch("/api/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newKeyName,
          usageLimit: newUsageLimit,
        }),
      });

      if (response.ok) {
        const newKey = await response.json();
        setApiKeys([...apiKeys, newKey]);
        setNewKeyName("");
        setNewUsageLimit(1000);
        setNewUsageLimitError("");
        setIsModalOpen(false);
        showToast("API key created successfully");
      } else {
        const error = await response.json();
        if (error.error) {
          setNewUsageLimitError(error.error);
          showToast(`Failed to create API key: ${error.error}`);
        } else {
          showToast("Failed to create API key");
        }
      }
    } catch (error) {
      console.error("Failed to create API key:", error);
      showToast("Failed to create API key");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editKeyName.trim()) {
      return;
    }

    if (editUsageLimit <= 0) {
      setEditUsageLimitError("Monthly usage must be greater than 0");
      return;
    }

    setEditUsageLimitError("");
    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editKeyName,
          usageLimit: editUsageLimit,
        }),
      });

      if (response.ok) {
        const updatedKey = await response.json();
        setApiKeys(
          apiKeys.map((key) => (key.id === id ? updatedKey : key))
        );
        setIsEditing(null);
        setEditKeyName("");
        setEditUsageLimit(0);
        setEditUsageLimitError("");
        showToast("API key updated successfully");
      } else {
        const error = await response.json();
        if (error.error) {
          setEditUsageLimitError(error.error);
          showToast(`Failed to update API key: ${error.error}`);
        } else {
          showToast("Failed to update API key");
        }
      }
    } catch (error) {
      console.error("Failed to update API key:", error);
      showToast("Failed to update API key");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) return;

    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setApiKeys(apiKeys.filter((key) => key.id !== id));
        showToast("API key deleted successfully");
      } else {
        const error = await response.json();
        showToast(error.error ? `Failed to delete API key: ${error.error}` : "Failed to delete API key");
      }
    } catch (error) {
      console.error("Failed to delete API key:", error);
      showToast("Failed to delete API key");
    }
  };

  const handleCopyKey = async (keyId: string, key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKeyId(keyId);
      showToast("API key copied to clipboard");
      setTimeout(() => {
        setCopiedKeyId(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      showToast("Failed to copy API key");
    }
  };

  const startEdit = (key: ApiKey) => {
    setIsEditing(key.id);
    setEditKeyName(key.name);
    setEditUsageLimit(key.usageLimit);
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditKeyName("");
    setEditUsageLimit(0);
    setEditUsageLimitError("");
  };

  const openModal = () => {
    setIsModalOpen(true);
    setNewKeyName("");
    setNewUsageLimit(1000);
    setNewUsageLimitError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewKeyName("");
    setNewUsageLimit(1000);
    setNewUsageLimitError("");
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return "•".repeat(key.length);
    return key.substring(0, 4) + "•".repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold leading-relaxed text-neutral-900 dark:text-neutral-50">
          API Keys Management
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
          Create and manage your API keys
        </p>
      </div>

      <div className="mb-12 flex justify-end">
        <button
          onClick={openModal}
          className="rounded-lg bg-neutral-900 px-6 py-3 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-100"
        >
          Create API Key
        </button>
      </div>

      <div className="rounded-2xl border border-solid border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-solid border-neutral-200 p-8 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
              Your API Keys
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-neutral-600 dark:text-neutral-400">
            Loading...
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="p-8 text-center text-neutral-600 dark:text-neutral-400">
            No API keys found. Create your first one using the button above.
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="p-8 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-950"
              >
                {isEditing === key.id ? (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="flex-1">
                        <label className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-50">
                          Key Name
                        </label>
                        <input
                          type="text"
                          value={editKeyName}
                          onChange={(e) => setEditKeyName(e.target.value)}
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
                        onClick={cancelEdit}
                        className="rounded-lg border border-solid border-neutral-300 bg-transparent px-5 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(key.id)}
                        className="rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-neutral-50 transition-colors hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-100"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                          {key.name}
                        </h3>
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">
                          Usage: {key.usageLimit.toLocaleString()}/month
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <code className="rounded-lg bg-neutral-100 px-3 py-1.5 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                          {visibleKeys.has(key.id) ? key.key : maskApiKey(key.key)}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(key.id)}
                          className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
                          aria-label={visibleKeys.has(key.id) ? "Hide API key" : "Show API key"}
                        >
                          {visibleKeys.has(key.id) ? (
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
                          onClick={() => handleCopyKey(key.id, key.key)}
                          className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
                          aria-label="Copy API key"
                        >
                          {copiedKeyId === key.id ? (
                            <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <ClipboardIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        Created:{" "}
                        {new Date(key.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => startEdit(key)}
                        className="rounded-lg border border-solid border-neutral-300 bg-transparent px-5 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
                        aria-label="Edit API key"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(key.id)}
                        className="rounded-lg border border-solid border-red-300 bg-transparent px-5 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                        aria-label="Delete API key"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>


      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
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

            <form onSubmit={handleCreate} className="flex flex-col gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-900 dark:text-neutral-50">
                  Key Name — A unique name to identify this key
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
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
                  value={newUsageLimit}
                  onChange={(e) => {
                    setNewUsageLimit(Number(e.target.value));
                    setNewUsageLimitError("");
                  }}
                  min="1"
                  placeholder="1000"
                  className={`w-full rounded-lg border border-solid px-5 py-3 text-neutral-900 placeholder-neutral-500 focus:outline-none dark:bg-neutral-950 dark:text-neutral-50 dark:placeholder-neutral-400 ${newUsageLimitError
                      ? "border-red-300 focus:border-red-400 dark:border-red-700 dark:focus:border-red-600"
                      : "border-neutral-300 focus:border-neutral-400 dark:border-neutral-700 dark:focus:border-neutral-600"
                    } bg-white`}
                  required
                  aria-label="Usage limit"
                />
                {newUsageLimitError && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {newUsageLimitError}
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
                  onClick={closeModal}
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
      )}

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
