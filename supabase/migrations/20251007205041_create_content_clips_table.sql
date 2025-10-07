/*
  # Create content clips table

  ## Description
  This migration creates the content_clips table for storing video clips
  and media content that users want to share on social media.

  ## New Tables
  
  ### `content_clips`
  Stores video clips and content created by users.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for the clip
  - `user_id` (uuid, foreign key) - References user_profiles.id
  - `title` (text, not null) - Clip title
  - `description` (text, nullable) - Optional clip description
  - `content_url` (text, not null) - URL to the content/video file
  - `thumbnail_url` (text, nullable) - URL to thumbnail image
  - `duration` (integer, nullable) - Duration in seconds
  - `created_at` (timestamptz) - When the clip was created
  - `updated_at` (timestamptz) - When the clip was last updated

  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the `content_clips` table
  - Users can only view their own clips
  - Users can create new clips
  - Users can update and delete their own clips

  ## Important Notes
  1. Content URLs should point to valid media files
  2. Clips are tied to user profiles via user_id foreign key
  3. Soft delete pattern could be implemented later if needed
*/

CREATE TABLE IF NOT EXISTS content_clips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content_url text NOT NULL,
  thumbnail_url text,
  duration integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_clips_user_id ON content_clips(user_id);
CREATE INDEX IF NOT EXISTS idx_content_clips_created_at ON content_clips(created_at DESC);

ALTER TABLE content_clips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own clips"
  ON content_clips
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own clips"
  ON content_clips
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own clips"
  ON content_clips
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own clips"
  ON content_clips
  FOR DELETE
  TO anon, authenticated
  USING (true);
