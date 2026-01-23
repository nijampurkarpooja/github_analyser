-- Add user_id column to api_keys table
ALTER TABLE api_keys 
ADD COLUMN user_id TEXT NOT NULL DEFAULT '';

-- Remove the default after adding the column (for future inserts)
ALTER TABLE api_keys 
ALTER COLUMN user_id DROP DEFAULT;

-- Create index on user_id for faster lookups and joins
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- Create composite index for common query patterns (user_id + created_at)
CREATE INDEX IF NOT EXISTS idx_api_keys_user_created ON api_keys(user_id, created_at DESC);
