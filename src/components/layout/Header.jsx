import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../lib/roles';
import { Button } from '../ui/Button';

const NAV = {
  [ROLES.CUSTOMER]: [{ to: '/properties', label: 'Properties' }],
  [ROLES.OWNER]: [{ to: '/owner/dashboard', label: 'Dashboard' }],
};

export function Header() {
  const { status, role, profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const signedIn = status !== 'signed_out' && status !== 'unconfigured' && Boolean(user);
  const links = NAV[role] ?? [];
  const displayName = profile?.full_name || profile?.email || user?.email || '';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to={signedIn ? '/app' : '/'} className="brand">
          <span className="brand__mark" aria-hidden="true">⌂</span>
          <span className="brand__name">HomeFind</span>
        </Link>

        {links.length > 0 && (
          <nav className="site-nav" aria-label="Main">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className="site-nav__link">
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="site-header__actions">
          {signedIn ? (
            <>
              {displayName && <span className="site-header__user" title={displayName}>{displayName}</span>}
              {role && <span className={`role-badge role-badge--${role}`}>{role}</span>}
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <Link to="/login" className="btn btn--primary btn--sm">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
