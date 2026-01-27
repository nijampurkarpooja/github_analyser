export interface ApiKey {
  id: string;
  name: string;
  key: string;
  userId: string;
  usageLimit: number;
  usage: number;
  createdAt: string;
  lastUsed?: string;
}
