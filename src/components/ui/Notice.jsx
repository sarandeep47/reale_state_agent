/** Inline message box. tone: 'info' | 'warning' | 'error' */
export function Notice({ tone = 'info', title, children }) {
  return (
    <div className={`notice notice--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {title && <strong className="notice__title">{title}</strong>}
      {children && <div className="notice__body">{children}</div>}
    </div>
  );
}
