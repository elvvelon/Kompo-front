import { useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useApi } from '../hooks/useApi.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ComponentList from '../components/ComponentList.jsx';
import ArrowLink from '../components/ArrowLink.jsx';
import Icon from '../components/Icon.jsx';
import { EmptyState, ErrorState, Loader } from '../components/States.jsx';
import { categoryIcon } from '../utils/categoryIcon.js';
import { formatPrice } from '../utils/format.js';

export default function CategoryDetail() {
  const { id } = useParams();
  const { data: c, loading, error, retry } = useApi((signal) => api.getCategory(id, signal), [id]);

  if (loading) return <Loader label="Loading category…" />;
  if (error) {
    return (
      <>
        <Breadcrumbs items={[{ label: 'Categories', to: '/categories' }, { label: 'Not found' }]} />
        <div style={{ marginTop: 24 }}>
          <ErrorState error={error} onRetry={retry} />
        </div>
      </>
    );
  }

  const prices = c.components.map((x) => Number(x.price));
  const priceFrom = prices.length ? Math.min(...prices) : null;

  return (
    <>
      <Breadcrumbs items={[{ label: 'Categories', to: '/categories' }, { label: c.name }]} />

      <div className="split fade-up">
        <div className="panel panel--dark split__main">
          <div className="profile-head">
            <div className="profile-logo profile-logo--icon">
              <Icon name={categoryIcon(c.name)} size={30} />
            </div>
            <span className="badge badge--dark">{c.is_periphery ? 'Peripheral' : 'Internal component'}</span>
          </div>
          <h1 className="split__title">{c.name}</h1>
          {c.description && <p className="split__desc">{c.description}</p>}

          <div className="stat-list">
            <div className="stat-row">
              <span className="stat-row__value">{c.max_per_build}</span>
              <span className="stat-row__label">Max per build</span>
            </div>
            <div className="stat-row">
              <span className="stat-row__value">{c.components.length}</span>
              <span className="stat-row__label">Components available</span>
            </div>
            <div className="stat-row">
              <span className="stat-row__value">{priceFrom !== null ? formatPrice(priceFrom) : '—'}</span>
              <span className="stat-row__label">Starting price</span>
            </div>
          </div>

          <ArrowLink to={`/components?category_id=${c.id}`}>Open in catalog</ArrowLink>
        </div>

        <div className="split__side">
          <div className="section-head">
            <div>
              <p className="eyebrow">/{c.slug}</p>
              <h2 className="section-title">All {c.name.toLowerCase()}</h2>
            </div>
          </div>
          {c.components.length === 0 ? (
            <EmptyState title="No components yet" text="This category has no components in the catalog yet." />
          ) : (
            <ComponentList components={c.components} metaKey="manufacturer_name" metaLabel="Manufacturer" />
          )}
        </div>
      </div>
    </>
  );
}
