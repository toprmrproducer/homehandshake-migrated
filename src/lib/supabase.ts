import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          clerk_user_id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_user_id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_user_id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_clips: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          content_url: string;
          thumbnail_url: string | null;
          duration: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          content_url: string;
          thumbnail_url?: string | null;
          duration?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          content_url?: string;
          thumbnail_url?: string | null;
          duration?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      social_posts: {
        Row: {
          id: string;
          user_id: string;
          clip_id: string | null;
          platforms: string[];
          content: string;
          scheduled_at: string | null;
          posted_at: string | null;
          status: 'draft' | 'scheduled' | 'posted' | 'failed';
          ayrshare_post_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          clip_id?: string | null;
          platforms: string[];
          content: string;
          scheduled_at?: string | null;
          posted_at?: string | null;
          status?: 'draft' | 'scheduled' | 'posted' | 'failed';
          ayrshare_post_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          clip_id?: string | null;
          platforms?: string[];
          content?: string;
          scheduled_at?: string | null;
          posted_at?: string | null;
          status?: 'draft' | 'scheduled' | 'posted' | 'failed';
          ayrshare_post_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
