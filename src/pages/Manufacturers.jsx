import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useApi } from '../hooks/useApi.js';
import ProductImage from '../components/ProductImage.jsx';
import Icon from '../components/Icon.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { pluralize } from '../utils/format.js';

export default function Manufacturers() {
  const { data, loading, error, retry } = useApi((signal) => api.getManufacturers(signal), []);

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Brands</p>
          <h1 className="page-title">Manufacturers</h1>
          <p className="page-sub">
            Every hardware brand available on Kompo — from silicon makers to memory and cooling specialists.
          </p>
        </div>
        {data && <span className="badge badge--outline">{pluralize(data.length, 'brand')}</span>}
      </header>

      {error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : loading ? (
        <div className="tile-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton" style={{ height: 210 }} />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="No manufacturers yet" />
      ) : (
        <div className="tile-grid">
          {data.map((m, i) => (
            <Link
              key={m.id}
              to={`/manufacturers/${m.id}`}
              className="tile fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="tile__top">
                <div className="tile__logo">
                  <ProductImage src={m.logo_url} alt={`${m.name} logo`} label={m.name} variant="logo" />
                </div>
                <span className="tile__go" aria-hidden="true">
                  <Icon name="arrowUpRight" size={16} strokeWidth={2.2} />
                </span>
              </div>
              <h3 className="tile__title">{m.name}</h3>
              <div className="tile__meta">
                <span>
                  <Icon name="globe" size={14} /> {m.country}
                </span>
                <span>
                  <Icon name="calendar" size={14} /> Since {m.founded_year}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
