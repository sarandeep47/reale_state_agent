import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './authContext';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { normaliseRole } from '../lib/roles';
import { getOwnProfile } from '../services/profileService';

const EMPTY_PROFILE_STATE = { userId: null, profile: null, error: null };

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [sessionLoaded, setSessionLoaded] = useState(!isSupabaseConfigured);
  const [profileState, setProfileState] = useState(EMPTY_PROFILE_STATE);
  const [reloadKey, setReloadKey] = useState(0);

  // Session: initial read + live updates (sign-in, sign-out, token refresh).
  useEffect(() => {
    if (!supabase) return undefined;
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setSessionLoaded(true);
    });

    // Keep this callback synchronous: no Supabase calls inside it.
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession ?? null);
      setSessionLoaded(true);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user?.id ?? null;

  // Profile: read-only lookup of the signed-in user's own row.
  useEffect(() => {
    if (!userId) return undefined;
    let active = true;
    getOwnProfile(userId).then(({ profile, error }) => {
      if (active) setProfileState({ userId, profile, error });
    });
    return () => {
      active = false;
    };
  }, [userId, reloadKey]);

  const reloadProfile = useCallback(() => {
    setProfileState(EMPTY_PROFILE_STATE);
    setReloadKey((k) => k + 1);
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setProfileState(EMPTY_PROFILE_STATE);
  }, []);

  const value = useMemo(() => {
    const profileLoaded = userId !== null && profileState.userId === userId;
    const profile = profileLoaded ? profileState.profile : null;
    const role = normaliseRole(profile?.role);

    let status;
    if (!isSupabaseConfigured) status = 'unconfigured';
    else if (!sessionLoaded) status = 'loading';
    else if (!userId) status = 'signed_out';
    else if (!profileLoaded) status = 'loading';
    else if (profileState.error) status = 'error';
    else if (!profile) status = 'no_profile';
    else if (!role) status = 'invalid_role';
    else status = 'ready';

    return {
      status,
      session,
      user: session?.user ?? null,
      profile,
      role: status === 'ready' ? role : null,
      error: profileLoaded ? profileState.error : null,
      reloadProfile,
      signOut,
    };
  }, [session, sessionLoaded, userId, profileState, reloadProfile, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
