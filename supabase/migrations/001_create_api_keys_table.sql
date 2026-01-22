-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  usage_limit INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used TIMESTAMPTZ,
  CONSTRAINT usage_limit_non_negative CHECK (usage_limit >= 0)
);

-- Create index on key for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_api_keys_created_at ON api_keys(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
-- Adjust this policy based on your authentication requirements
-- For now, we'll allow all operations (you should secure this in production)
CREATE POLICY "Allow all operations on api_keys" ON api_keys
  FOR ALL
  USING (true)
  WITH CHECK (true);
