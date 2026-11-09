import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { formatPrice } from '../utils/format.js';

/**
 * Compact list of components as returned by nested endpoints
 * (/manufacturers/{id} and /categories/{id}).
 */
export default function ComponentList({ components, metaKey, metaLabel }) {
  return (
    <ul className="row-list">
      {components.map((c, i) => (
        <li key={c.id} className="fade-up" style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}>
          <Link to={`/components/${c.id}`} className="row-item">
            <span className="row-item__index">{String(i + 1).padStart(2, '0')}</span>
            <span className="row-item__name">{c.name}</span>
            <span className="row-item__meta" title={metaLabel}>
              {c[metaKey]}
            </span>
            <span className="row-item__price">{formatPrice(c.price)}</span>
            <span className="row-item__go" aria-hidden="true">
              <Icon name="arrowUpRight" size={16} strokeWidth={2.2} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
