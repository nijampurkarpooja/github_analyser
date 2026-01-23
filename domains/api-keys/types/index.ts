export interface ApiKey {
  id: string;
  name: string;
  key: string;
  userId: string;
  usageLimit: number;
  createdAt: string;
  lastUsed?: string;
}
