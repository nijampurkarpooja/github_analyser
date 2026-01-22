interface ApiKey {
  id: string;
  name: string;
  key: string;
  usageLimit: number;
  createdAt: string;
  lastUsed?: string;
}

// In-memory storage (replace with database in production)
let apiKeys: ApiKey[] = [];

export function getApiKeys(): ApiKey[] {
  return apiKeys;
}

export function setApiKeys(keys: ApiKey[]): void {
  apiKeys = keys;
}

export function addApiKey(key: ApiKey): void {
  apiKeys.push(key);
}

export function updateApiKey(id: string, updates: Partial<ApiKey>): ApiKey | null {
  const index = apiKeys.findIndex((k) => k.id === id);
  if (index === -1) return null;
  
  apiKeys[index] = { ...apiKeys[index], ...updates };
  return apiKeys[index];
}

export function deleteApiKey(id: string): boolean {
  const index = apiKeys.findIndex((k) => k.id === id);
  if (index === -1) return false;
  
  apiKeys.splice(index, 1);
  return true;
}

export function getApiKeyById(id: string): ApiKey | undefined {
  return apiKeys.find((k) => k.id === id);
}

export type { ApiKey };
