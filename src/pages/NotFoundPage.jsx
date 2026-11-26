import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui/EmptyState';

export function NotFoundPage() {
  return (
    <div className="container">
      <EmptyState
        icon="🧭"
        title="Page not found"
        action={
          <Link to="/" className="btn btn--primary">
            Go home
          </Link>
        }
      >
        The page you are looking for doesn't exist.
      </EmptyState>
    </div>
  );
}
