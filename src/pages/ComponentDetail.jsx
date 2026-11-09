import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useApi } from '../hooks/useApi.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ProductImage from '../components/ProductImage.jsx';
import ArrowLink from '../components/ArrowLink.jsx';
import { ErrorState, Loader } from '../components/States.jsx';
import { formatPrice, formatSpecValue, humanizeKey } from '../utils/format.js';
import { categoryIcon } from '../utils/categoryIcon.js';

export default function ComponentDetail() {
  const { id } = useParams();
  const { data: component, loading, error, retry } = useApi((signal) => api.getComponent(id, signal), [id]);

  if (loading) return <Loader label="Loading component…" />;
  if (error) {
    return (
      <>
        <Breadcrumbs items={[{ label: 'Catalog', to: '/components' }, { label: 'Not found' }]} />
        <div style={{ marginTop: 24 }}>
          <ErrorState error={error} onRetry={retry} />
        </div>
      </>
    );
  }

  const { name, sku, price, power_watts, popularity_score, description, specifications, image_url, manufacturer, category } =
    component;
  const specs = Object.entries(specifications || {});

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Catalog', to: '/components' },
          { label: category?.name, to: `/categories/${category?.id}` },
          { label: name },
        ]}
      />

      <div className="detail fade-up">
        <div className="detail__media panel panel--lilac">
          <ProductImage src={image_url} alt={name} icon={categoryIcon(category?.name)} variant="hero" />
          <div className="detail__media-caption glass">
            <span>SKU</span>
            <strong>{sku}</strong>
          </div>
        </div>

        <div className="detail__info panel panel--dark">
          <div className="detail__tags">
            <Link to={`/categories/${category?.id}`} className="badge badge--dark">
              {category?.name}
            </Link>
            <Link to={`/manufacturers/${manufacturer?.id}`} className="badge badge--dark">
              by {manufacturer?.name}
            </Link>
          </div>

          <h1 className="detail__title">{name}</h1>
          {description && <p className="detail__desc">{description}</p>}

          <div className="stat-list">
            <div className="stat-row">
              <span className="stat-row__value">{formatPrice(price)}</span>
              <span className="stat-row__label">Price</span>
            </div>
            <div className="stat-row">
              <span className="stat-row__value">
                {power_watts}
                <small>W</small>
              </span>
              <span className="stat-row__label">Power consumption</span>
            </div>
            <div className="stat-row">
              <span className="stat-row__value">{popularity_score}</span>
              <span className="stat-row__label">Popularity score</span>
            </div>
            <div className="stat-row">
              <span className="stat-row__value">
                {category?.max_per_build}
                <small>max</small>
              </span>
              <span className="stat-row__label">Allowed per build</span>
            </div>
          </div>

          <ArrowLink to={`/manufacturers/${manufacturer?.id}`}>More from {manufacturer?.name}</ArrowLink>
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Technical details</p>
            <h2 className="section-title">Specifications</h2>
          </div>
        </div>

        {specs.length === 0 ? (
          <p className="section-sub">No specifications provided for this component.</p>
        ) : (
          <dl className="spec-grid">
            {specs.map(([key, value]) => (
              <div key={key} className="spec-item">
                <dt>{humanizeKey(key)}</dt>
                <dd>{formatSpecValue(value)}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </>
  );
}
