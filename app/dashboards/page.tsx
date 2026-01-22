"use client";

import { ApiKey } from "@/app/api/api-keys/store";
import { Toast, useToast } from "@/shared/components/toast";
import { useState } from "react";
import { ApiKeyList } from "./components/api-key-list";
import { CreateApiKeyModal } from "./components/create-api-key-modal";
import { useApiKeys } from "./hooks/use-api-keys";

export default function DashboardsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const { toasts, showToast, removeToast } = useToast();

  const { apiKeys, isLoading, createApiKey, updateApiKey, deleteApiKey } = useApiKeys();

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
  };

  const cancelEdit = () => {
    setIsEditing(null);
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
          onClick={() => setIsModalOpen(true)}
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

        <ApiKeyList
          apiKeys={apiKeys}
          isLoading={isLoading}
          editingId={isEditing}
          visibleKeys={visibleKeys}
          copiedKeyId={copiedKeyId}
          onStartEdit={startEdit}
          onCancelEdit={cancelEdit}
          onUpdate={updateApiKey}
          onDelete={deleteApiKey}
          onCopy={handleCopyKey}
          onToggleVisibility={toggleKeyVisibility}
          showToast={showToast}
        />
      </div>

      <CreateApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={createApiKey}
        showToast={showToast}
      />

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
