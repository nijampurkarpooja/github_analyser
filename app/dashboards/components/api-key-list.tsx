"use client";

import { ApiKey } from "@/app/api/api-keys/store";
import { ApiKeyItem } from "./api-key-item";

interface ApiKeyListProps {
  apiKeys: ApiKey[];
  isLoading: boolean;
  editingId: string | null;
  visibleKeys: Set<string>;
  copiedKeyId: string | null;
  onStartEdit: (key: ApiKey) => void;
  onCancelEdit: () => void;
  onUpdate: (id: string, name: string, usageLimit: number) => Promise<{ success: boolean; error?: string }>;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  onCopy: (keyId: string, key: string) => void;
  onToggleVisibility: (keyId: string) => void;
  showToast: (message: string) => void;
}

export function ApiKeyList({
  apiKeys,
  isLoading,
  editingId,
  visibleKeys,
  copiedKeyId,
  onStartEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  onCopy,
  onToggleVisibility,
  showToast,
}: ApiKeyListProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-neutral-600 dark:text-neutral-400">
        Loading...
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="p-8 text-center text-neutral-600 dark:text-neutral-400">
        No API keys found. Create your first one using the button above.
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
      {apiKeys.map((key) => (
        <div
          key={key.id}
          className="p-8 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-950"
        >
          <ApiKeyItem
            apiKey={key}
            isEditing={editingId === key.id}
            onStartEdit={() => onStartEdit(key)}
            onCancelEdit={onCancelEdit}
            onUpdate={(name, usageLimit) => onUpdate(key.id, name, usageLimit)}
            onDelete={() => onDelete(key.id)}
            onCopy={(keyValue) => onCopy(key.id, keyValue)}
            isVisible={visibleKeys.has(key.id)}
            onToggleVisibility={() => onToggleVisibility(key.id)}
            isCopied={copiedKeyId === key.id}
            showToast={showToast}
          />
        </div>
      ))}
    </div>
  );
}
