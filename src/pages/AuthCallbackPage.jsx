import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RoleHomeRedirect } from '../components/auth/RoleHomeRedirect';
import { Notice } from '../components/ui/Notice';
import { FullPageSpinner } from '../components/ui/Spinner';

function readOAuthError() {
  // Supabase reports OAuth errors in the query string or the URL fragment.
  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const description = search.get('error_description') || hash.get('error_description');
  const code = search.get('error') || hash.get('error');
  return description || code || null;
}

/**
 * Google redirects here after sign-in. supabase-js exchanges the auth code for a
 * session automatically (PKCE, detectSessionInUrl); this page just waits for it.
 */
export function AuthCallbackPage() {
  const { status } = useAuth();
  const oauthError = readOAuthError();

  if (oauthError || status === 'signed_out' || status === 'unconfigured') {
    return (
      <div className="container auth-page">
        <div className="auth-card">
          <Notice tone="error" title="Sign-in could not be completed">
            {oauthError || 'No session was created. Please try again.'}
          </Notice>
          <Link to="/login" className="btn btn--primary">
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'loading') return <FullPageSpinner label="Signing you in..." />;
  return <RoleHomeRedirect />;
}
