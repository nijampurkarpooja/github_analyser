# Supabase Setup Instructions

## 1. Install Dependencies

First, install the Supabase client library:

```bash
npm install @supabase/supabase-js
```

## 2. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Fill in your project details (name, database password, region)
4. Wait for the project to be provisioned

## 3. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## 4. Configure Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with the values from step 3.

## 5. Create the Database Table

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `supabase/migrations/001_create_api_keys_table.sql`
4. Click "Run" to execute the migration
5. Verify the table was created by going to **Table Editor** and checking for the `api_keys` table

## 6. Verify the Setup

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```
2. Test the API endpoints:
   - `GET /api/api-keys` - Should return an empty array initially
   - `POST /api/api-keys` - Should create a new API key
   - `GET /api/api-keys/[id]` - Should retrieve a specific API key
   - `PUT /api/api-keys/[id]` - Should update an API key
   - `DELETE /api/api-keys/[id]` - Should delete an API key

## Security Notes

⚠️ **Important**: The current Row Level Security (RLS) policy allows all operations. In production, you should:

1. Implement proper authentication (e.g., using Supabase Auth)
2. Update the RLS policies to restrict access based on user roles
3. Consider using service role key for server-side operations (store it securely in environment variables, not in `NEXT_PUBLIC_*`)

Example secure policy:

```sql
-- Only allow users to see their own API keys
CREATE POLICY "Users can view own api_keys" ON api_keys
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only allow users to create their own API keys
CREATE POLICY "Users can insert own api_keys" ON api_keys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```
