"use client";

import { api } from "@/shared/lib/api-client";
import { useEffect, useState } from "react";
import type { ApiKey } from "../types";

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApiKeys = async () => {
    try {
      const response = await api.get("/api/api-keys");
      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      console.error("Failed to fetch API keys:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const createApiKey = async (
    name: string,
    usageLimit: number
  ): Promise<{ success: boolean; error?: string; data?: ApiKey }> => {
    if (usageLimit <= 0) {
      return { success: false, error: "Monthly usage must be greater than 0" };
    }

    try {
      const response = await api.post("/api/api-keys", { name, usageLimit });

      if (response.ok) {
        const newKey = await response.json();
        setApiKeys((prev) => [...prev, newKey]);
        return { success: true, data: newKey };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.error || "Failed to create API key",
        };
      }
    } catch (error) {
      console.error("Failed to create API key:", error);
      return { success: false, error: "Failed to create API key" };
    }
  };

  const updateApiKey = async (
    id: string,
    name: string,
    usageLimit: number
  ): Promise<{ success: boolean; error?: string }> => {
    if (usageLimit <= 0) {
      return { success: false, error: "Monthly usage must be greater than 0" };
    }

    try {
      const response = await api.put(`/api/api-keys/${id}`, {
        name,
        usageLimit,
      });

      if (response.ok) {
        const updatedKey = await response.json();
        setApiKeys((prev) =>
          prev.map((key) => (key.id === id ? updatedKey : key))
        );
        return { success: true };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.error || "Failed to update API key",
        };
      }
    } catch (error) {
      console.error("Failed to update API key:", error);
      return { success: false, error: "Failed to update API key" };
    }
  };

  const deleteApiKey = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await api.delete(`/api/api-keys/${id}`);

      if (response.ok) {
        setApiKeys((prev) => prev.filter((key) => key.id !== id));
        return { success: true };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.error || "Failed to delete API key",
        };
      }
    } catch (error) {
      console.error("Failed to delete API key:", error);
      return { success: false, error: "Failed to delete API key" };
    }
  };

  return {
    apiKeys,
    isLoading,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    refetch: fetchApiKeys,
  };
}
