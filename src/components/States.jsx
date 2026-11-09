import Icon from './Icon.jsx';

export function Loader({ label = 'Loading…' }) {
  return (
    <div className="state" role="status" aria-live="polite">
      <div className="spinner" />
      <p className="state__text">{label}</p>
    </div>
  );
}

export function ErrorState({ error, onRetry, title = 'Something went wrong' }) {
  const notFound = error?.status === 404;
  return (
    <div className="state state--error" role="alert">
      <div className="state__icon">
        <Icon name="alert" size={26} />
      </div>
      <h3 className="state__title">{notFound ? 'Not found' : title}</h3>
      <p className="state__text">{error?.message || 'Unexpected error.'}</p>
      {onRetry && !notFound && (
        <button type="button" className="btn btn--ghost" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', text, children }) {
  return (
    <div className="state">
      <div className="state__icon">
        <Icon name="box" size={26} />
      </div>
      <h3 className="state__title">{title}</h3>
      {text && <p className="state__text">{text}</p>}
      {children}
    </div>
  );
}
