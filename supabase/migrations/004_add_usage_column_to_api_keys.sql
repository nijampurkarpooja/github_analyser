-- Add usage column to api_keys table
ALTER TABLE api_keys 
ADD COLUMN IF NOT EXISTS usage INTEGER NOT NULL DEFAULT 0;

-- Add constraint to ensure usage is non-negative
ALTER TABLE api_keys
ADD CONSTRAINT usage_non_negative CHECK (usage >= 0);
