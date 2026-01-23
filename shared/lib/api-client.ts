"use client";

import { getSession } from "next-auth/react";

type FetchOptions = RequestInit & {
  skipAuth?: boolean;
};

export async function apiClient(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { skipAuth, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);

  if (!headers.has("Content-Type") && fetchOptions.body) {
    headers.set("Content-Type", "application/json");
  }

  if (!skipAuth) {
    const session = await getSession();
    if (session?.accessToken) {
      headers.set("Authorization", `Bearer ${session.accessToken}`);
    }
  }

  return fetch(url, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });
}

export const api = {
  get: (url: string, options?: FetchOptions) =>
    apiClient(url, { ...options, method: "GET" }),

  post: (url: string, body?: unknown, options?: FetchOptions) =>
    apiClient(url, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: (url: string, body?: unknown, options?: FetchOptions) =>
    apiClient(url, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: (url: string, options?: FetchOptions) =>
    apiClient(url, { ...options, method: "DELETE" }),
};
