export interface ApiKey {
  id: string;
  name: string;
  key: string;
  usageLimit: number;
  createdAt: string;
  lastUsed?: string;
}
