-- Create helper function to get current user ID
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS TEXT AS $$
BEGIN
  -- Try to get from session variable first (set by application)
  RETURN COALESCE(
    current_setting('app.user_id', true),
    -- Fallback to JWT claim if available
    current_setting('request.jwt.claims', true)::json->>'user_id'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Allow all operations on api_keys" ON api_keys;

-- SELECT: Users can only view their own API keys
CREATE POLICY "Users can view own api_keys" ON api_keys
  FOR SELECT
  USING (user_id = get_current_user_id());

-- INSERT: Users can only create API keys for themselves
CREATE POLICY "Users can insert own api_keys" ON api_keys
  FOR INSERT
  WITH CHECK (user_id = get_current_user_id());

-- UPDATE: Users can only update their own API keys
CREATE POLICY "Users can update own api_keys" ON api_keys
  FOR UPDATE
  USING (user_id = get_current_user_id())
  WITH CHECK (user_id = get_current_user_id());

-- DELETE: Users can only delete their own API keys
CREATE POLICY "Users can delete own api_keys" ON api_keys
  FOR DELETE
  USING (user_id = get_current_user_id());

-- Keep existing SELECT policy, but ensure it's correct
-- Users can read their own record
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (id = get_current_user_id());

-- INSERT: Allow service role to insert users (for registration)
-- Regular users cannot insert (handled by application)
CREATE POLICY "Service role can insert users" ON users
  FOR INSERT
  WITH CHECK (true); -- Service role bypasses RLS, but this allows explicit inserts

-- UPDATE: Users can only update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (id = get_current_user_id())
  WITH CHECK (id = get_current_user_id());

-- DELETE: Users can delete their own account (optional - you may want to restrict this)
CREATE POLICY "Users can delete own profile" ON users
  FOR DELETE
  USING (id = get_current_user_id());
