import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { homeForRole } from '../../lib/roles';
import { FullPageSpinner } from '../ui/Spinner';

/**
 * Route guard for authenticated, role-specific pages.
 * UX only: real data protection must come from Supabase RLS.
 *
 * - not configured / signed out -> /login
 * - profile missing, unsupported role or lookup error -> /account-pending
 * - signed in with a different role -> that role's own home page
 */
export function RequireRole({ role }) {
  const { status, role: userRole } = useAuth();
  const location = useLocation();

  if (status === 'loading') return <FullPageSpinner label="Checking your account..." />;
  if (status === 'unconfigured' || status === 'signed_out') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (status !== 'ready') return <Navigate to="/account-pending" replace />;
  if (userRole !== role) return <Navigate to={homeForRole(userRole)} replace />;

  return <Outlet />;
}
