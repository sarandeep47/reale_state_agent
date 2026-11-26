export function Spinner({ label = 'Loading...' }) {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <span className="spinner__circle" aria-hidden="true" />
      <span className="spinner__label">{label}</span>
    </div>
  );
}

export function FullPageSpinner({ label }) {
  return (
    <div className="full-page-center">
      <Spinner label={label} />
    </div>
  );
}
