import { useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useApi } from '../hooks/useApi.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ProductImage from '../components/ProductImage.jsx';
import ComponentList from '../components/ComponentList.jsx';
import ArrowLink from '../components/ArrowLink.jsx';
import { EmptyState, ErrorState, Loader } from '../components/States.jsx';

export default function ManufacturerDetail() {
  const { id } = useParams();
  const { data: m, loading, error, retry } = useApi((signal) => api.getManufacturer(id, signal), [id]);

  if (loading) return <Loader label="Loading manufacturer…" />;
  if (error) {
    return (
      <>
        <Breadcrumbs items={[{ label: 'Manufacturers', to: '/manufacturers' }, { label: 'Not found' }]} />
        <div style={{ marginTop: 24 }}>
          <ErrorState error={error} onRetry={retry} />
        </div>
      </>
    );
  }

  const age = new Date().getFullYear() - m.founded_year;
  const categoriesCount = new Set(m.components.map((c) => c.category_name)).size;

  return (
    <>
      <Breadcrumbs items={[{ label: 'Manufacturers', to: '/manufacturers' }, { label: m.name }]} />

      <div className="split fade-up">
        <div className="panel panel--dark split__main">
          <div className="profile-head">
            <div className="profile-logo">
              <ProductImage src={m.logo_url} alt={`${m.name} logo`} label={m.name} variant="logo" />
            </div>
            <span className="badge badge--dark">{m.country}</span>
          </div>
          <h1 className="split__title">{m.name}</h1>
          {m.description && <p className="split__desc">{m.description}</p>}

          <div className="stat-list">
            <div className="stat-row">
              <span className="stat-row__value">{m.components.length}</span>
              <span className="stat-row__label">Components in catalog</span>
            </div>
            <div className="stat-row">
              <span className="stat-row__value">{categoriesCount}</span>
              <span className="stat-row__label">Hardware categories</span>
            </div>
            <div className="stat-row">
              <span className="stat-row__value">{age}</span>
              <span className="stat-row__label">Years on the market</span>
            </div>
          </div>

          <ArrowLink to={`/components?manufacturer_id=${m.id}`}>Open in catalog</ArrowLink>
        </div>

        <div className="split__side">
          <div className="section-head">
            <div>
              <p className="eyebrow">Lineup</p>
              <h2 className="section-title">Products by {m.name}</h2>
            </div>
          </div>
          {m.components.length === 0 ? (
            <EmptyState title="No components yet" text={`${m.name} has no components in the catalog yet.`} />
          ) : (
            <ComponentList components={m.components} metaKey="category_name" metaLabel="Category" />
          )}
        </div>
      </div>
    </>
  );
}
