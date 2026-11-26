import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Notice } from '../components/ui/Notice';
import { FullPageSpinner } from '../components/ui/Spinner';

const MESSAGES = {
  no_profile: {
    tone: 'warning',
    title: "Your account isn't set up yet",
    body: "You're signed in, but we couldn't find a profile for your account. Please contact our team to get access.",
  },
  invalid_role: {
    tone: 'warning',
    title: "Your account doesn't have access yet",
    body: 'Your profile exists, but it has not been assigned a supported access level. Please contact our team.',
  },
  error: {
    tone: 'error',
    title: "We couldn't load your account",
    body: 'Something went wrong while loading your profile. Please try again.',
  },
};

/** Shown to signed-in users who have no profile, an unsupported role, or a failed lookup. */
export function AccountPendingPage() {
  const { status, user, reloadProfile, signOut } = useAuth();
  const navigate = useNavigate();

  if (status === 'loading') return <FullPageSpinner label="Checking your account..." />;
  if (status === 'ready') return <Navigate to="/app" replace />;
  if (status === 'signed_out' || status === 'unconfigured') return <Navigate to="/login" replace />;

  const msg = MESSAGES[status] ?? MESSAGES.error;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="container auth-page">
      <div className="auth-card">
        <Notice tone={msg.tone} title={msg.title}>
          {msg.body}
        </Notice>
        {user?.email && (
          <p className="auth-card__fine-print">
            Signed in as <strong>{user.email}</strong>
          </p>
        )}
        <div className="button-row">
          <Button variant="secondary" onClick={reloadProfile}>
            Try again
          </Button>
          <Button variant="ghost" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
