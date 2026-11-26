import { supabase } from '../lib/supabaseClient';

const PROFILE_COLUMNS = 'id, full_name, email, role, created_at';

/**
 * Reads the signed-in user's own profile row (read-only).
 * Relies on an RLS policy that lets a user SELECT the row where id = auth.uid().
 * There is intentionally no insert/update function: roles are managed outside the app.
 *
 * @returns {Promise<{ profile: object|null, error: Error|null }>}
 */
export async function getOwnProfile(userId) {
  if (!supabase) return { profile: null, error: new Error('Supabase is not configured.') };
  if (!userId) return { profile: null, error: new Error('No signed-in user.') };

  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', userId)
    .maybeSingle();

  if (error) return { profile: null, error };
  // Defence in depth: only accept the row that belongs to this user.
  if (data && data.id !== userId) {
    return { profile: null, error: new Error('Profile does not match the signed-in user.') };
  }
  return { profile: data ?? null, error: null };
}
