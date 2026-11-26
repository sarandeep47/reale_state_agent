import { createContext } from 'react';

/**
 * status:
 *  'unconfigured' - VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing
 *  'loading'      - session or profile still loading
 *  'signed_out'   - no session
 *  'ready'        - signed in with a profile and a supported role
 *  'no_profile'   - signed in, but no profile row is readable for this user
 *  'invalid_role' - profile exists but role is missing or unsupported
 *  'error'        - profile lookup failed
 */
export const AuthContext = createContext(null);
