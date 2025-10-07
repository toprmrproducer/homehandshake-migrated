import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  clerk_user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export function useUserProfile() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function syncAndFetchProfile() {
      if (!isLoaded) return;

      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: existingProfile, error: fetchError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('clerk_user_id', user.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingProfile) {
          const { data: updatedProfile, error: updateError } = await supabase
            .from('user_profiles')
            .update({
              email: user.primaryEmailAddress?.emailAddress || '',
              full_name: user.fullName,
              avatar_url: user.imageUrl,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingProfile.id)
            .select()
            .single();

          if (updateError) throw updateError;
          setProfile(updatedProfile);
        } else {
          const { data: newProfile, error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              clerk_user_id: user.id,
              email: user.primaryEmailAddress?.emailAddress || '',
              full_name: user.fullName,
              avatar_url: user.imageUrl,
            })
            .select()
            .single();

          if (insertError) throw insertError;
          setProfile(newProfile);
        }
      } catch (err) {
        console.error('Error syncing user profile:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    syncAndFetchProfile();
  }, [user, isLoaded]);

  return { profile, loading, error };
}
