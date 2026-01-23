export function maskApiKey(key: string): string {
  if (key.length <= 8) return "•".repeat(key.length);
  return (
    key.substring(0, 4) +
    "•".repeat(key.length - 8) +
    key.substring(key.length - 4)
  );
}
