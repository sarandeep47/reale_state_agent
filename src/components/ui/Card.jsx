export function Card({ title, actions, children, className = '' }) {
  return (
    <section className={`card ${className}`.trim()}>
      {(title || actions) && (
        <header className="card__header">
          {title && <h2 className="card__title">{title}</h2>}
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
