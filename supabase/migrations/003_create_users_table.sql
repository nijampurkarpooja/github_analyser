CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, -- NextAuth user ID: "google_{providerAccountId}"
  email TEXT NOT NULL,
  name TEXT,
  image TEXT,
  provider TEXT NOT NULL DEFAULT 'google',
  provider_account_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_provider_account_id ON users(provider_account_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own record
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (auth.jwt() ->> 'sub' = id);

-- Policy: Service role can manage all users (for server-side operations)
-- Note: This requires using service role key in server-side code
