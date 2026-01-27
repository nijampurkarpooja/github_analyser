-- Add index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- Create function for atomic usage increment with limit check
CREATE OR REPLACE FUNCTION increment_api_key_usage(
  p_key TEXT,
  p_user_id TEXT
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  key TEXT,
  user_id TEXT,
  usage_limit INTEGER,
  usage INTEGER,
  created_at TIMESTAMPTZ,
  last_used TIMESTAMPTZ
) AS $$
DECLARE
  updated_row RECORD;
BEGIN
  -- Atomically increment usage only if usage < usage_limit
  UPDATE api_keys
  SET 
    usage = usage + 1,
    last_used = NOW()
  WHERE 
    api_keys.key = p_key
    AND api_keys.user_id = p_user_id
    AND api_keys.usage < api_keys.usage_limit
  RETURNING * INTO updated_row;
  
  -- If no row was updated, either key doesn't exist or limit was reached
  IF updated_row IS NULL THEN
    -- Check if key exists to provide better error message
    IF NOT EXISTS (SELECT 1 FROM api_keys WHERE key = p_key AND user_id = p_user_id) THEN
      RETURN; -- Key doesn't exist, return empty
    ELSE
      -- Key exists but limit reached, raise error
      RAISE EXCEPTION 'API key usage limit exceeded';
    END IF;
  END IF;
  
  RETURN QUERY SELECT 
    updated_row.id,
    updated_row.name,
    updated_row.key,
    updated_row.user_id,
    updated_row.usage_limit,
    updated_row.usage,
    updated_row.created_at,
    updated_row.last_used;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
