import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { homeForRole } from '../../lib/roles';
import { FullPageSpinner } from '../ui/Spinner';

/** Sends a signed-in user to the home page for their verified role. */
export function RoleHomeRedirect() {
  const { status, role } = useAuth();

  if (status === 'loading') return <FullPageSpinner label="Checking your account..." />;
  if (status === 'unconfigured' || status === 'signed_out') return <Navigate to="/login" replace />;
  if (status !== 'ready') return <Navigate to="/account-pending" replace />;
  return <Navigate to={homeForRole(role)} replace />;
}
