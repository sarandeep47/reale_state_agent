import { createClient } from '@supabase/supabase-js';

// Only the PUBLIC project URL and anon (publishable) key belong in the browser.
// Never put a service-role key or any other secret in a VITE_ variable:
// everything prefixed with VITE_ is bundled into the public JavaScript.
const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
