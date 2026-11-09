import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={item.label} style={{ display: 'contents' }}>
            {last || !item.to ? (
              <span aria-current={last ? 'page' : undefined}>{item.label}</span>
            ) : (
              <Link to={item.to}>{item.label}</Link>
            )}
            {!last && <span aria-hidden="true">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
