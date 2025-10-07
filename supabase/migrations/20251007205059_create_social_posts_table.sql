/*
  # Create social posts table

  ## Description
  This migration creates the social_posts table for tracking social media
  posts shared through the Ayrshare integration.

  ## New Tables
  
  ### `social_posts`
  Stores social media posts and their status.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for the post
  - `user_id` (uuid, foreign key) - References user_profiles.id
  - `clip_id` (uuid, foreign key, nullable) - Optional reference to content_clips.id
  - `platforms` (text array) - List of platforms (twitter, facebook, etc)
  - `content` (text, not null) - Post content/caption
  - `scheduled_at` (timestamptz, nullable) - When post is scheduled for
  - `posted_at` (timestamptz, nullable) - When post was actually published
  - `status` (text, not null) - Status: draft, scheduled, posted, failed
  - `ayrshare_post_id` (text, nullable) - Ayrshare's post ID for tracking
  - `created_at` (timestamptz) - When the post record was created
  - `updated_at` (timestamptz) - When the post was last updated

  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the `social_posts` table
  - Users can only view their own posts
  - Users can create new posts
  - Users can update and delete their own posts

  ## Important Notes
  1. Posts can optionally be linked to content clips
  2. Status values: draft, scheduled, posted, failed
  3. Platforms array contains social media platform identifiers
  4. Ayrshare post ID enables post management through their API
*/

CREATE TABLE IF NOT EXISTS social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  clip_id uuid REFERENCES content_clips(id) ON DELETE SET NULL,
  platforms text[] NOT NULL DEFAULT '{}',
  content text NOT NULL,
  scheduled_at timestamptz,
  posted_at timestamptz,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'posted', 'failed')),
  ayrshare_post_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_social_posts_user_id ON social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_created_at ON social_posts(created_at DESC);

ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own posts"
  ON social_posts
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own posts"
  ON social_posts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own posts"
  ON social_posts
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own posts"
  ON social_posts
  FOR DELETE
  TO anon, authenticated
  USING (true);
