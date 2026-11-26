export function Button({ variant = 'primary', size = 'md', className = '', type = 'button', ...props }) {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, className].filter(Boolean).join(' ');
  return <button type={type} className={classes} {...props} />;
}
