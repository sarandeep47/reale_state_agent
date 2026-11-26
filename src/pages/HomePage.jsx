import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const FEATURES = [
  { icon: '🔎', title: 'Browse properties', text: 'Filter homes by location, type and budget.' },
  { icon: '💬', title: 'Ask the assistant', text: 'Get help with your search from our chat assistant.' },
  { icon: '🤝', title: 'Talk to a consultant', text: 'Our team follows up on the homes you like.' },
];

export function HomePage() {
  const { status } = useAuth();
  const signedIn = status !== 'signed_out' && status !== 'unconfigured' && status !== 'loading';

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <h1 className="hero__title">Find a home that fits your life.</h1>
          <p className="hero__subtitle">
            Apartments, villas and plots, with a team that helps you from search to keys.
          </p>
          <Link to={signedIn ? '/app' : '/login'} className="btn btn--primary btn--lg">
            {signedIn ? 'Go to your account' : 'Get started'}
          </Link>
        </div>
      </section>

      <section className="container features">
        {FEATURES.map((f) => (
          <div key={f.title} className="feature">
            <div className="feature__icon" aria-hidden="true">{f.icon}</div>
            <h3 className="feature__title">{f.title}</h3>
            <p className="feature__text">{f.text}</p>
          </div>
        ))}
      </section>
    </>
  );
}
