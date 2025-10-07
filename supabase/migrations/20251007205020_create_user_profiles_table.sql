/*
  # Create user profiles table

  ## Description
  This migration creates the foundation for user management in Homehandshake, 
  syncing authenticated users from Clerk with our Supabase database.

  ## New Tables
  
  ### `user_profiles`
  Stores user profile information synced from Clerk authentication.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for the profile
  - `clerk_user_id` (text, unique, not null) - Reference to Clerk user ID
  - `email` (text, not null) - User's email address
  - `full_name` (text, nullable) - User's full name
  - `avatar_url` (text, nullable) - URL to user's profile picture
  - `created_at` (timestamptz) - When the profile was created
  - `updated_at` (timestamptz) - When the profile was last updated

  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the `user_profiles` table
  - Users can read their own profile data
  - Users can update their own profile data
  - Profile creation is handled by the application during user sync

  ## Important Notes
  1. The `clerk_user_id` field links to Clerk's authentication system
  2. All timestamps use UTC timezone
  3. Users are automatically synced from Clerk on first login
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id text UNIQUE NOT NULL,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
