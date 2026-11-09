import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useApi } from '../hooks/useApi.js';
import ArrowLink from '../components/ArrowLink.jsx';
import OrbitGraphic from '../components/OrbitGraphic.jsx';
import ComponentCard, { ComponentCardSkeleton } from '../components/ComponentCard.jsx';
import ProductImage from '../components/ProductImage.jsx';
import Icon from '../components/Icon.jsx';
import { ErrorState } from '../components/States.jsx';
import { categoryIcon } from '../utils/categoryIcon.js';

function StatValue({ value, loading }) {
  if (loading) return <span className="stat-row__value stat-row__value--loading">00</span>;
  return <span className="stat-row__value">{value ?? '—'}</span>;
}

export default function Home() {
  const overview = useApi(
    (signal) =>
      Promise.all([
        api.getComponents({ sort_by: 'popularity', order: 'desc' }, signal),
        api.getManufacturers(signal),
        api.getCategories(signal),
      ]),
    [],
  );

  const [components, manufacturers, categories] = overview.data || [];
  const countries = manufacturers ? new Set(manufacturers.map((m) => m.country)).size : null;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="panel panel--dark hero__intro fade-up">
          <span className="badge badge--dark">Custom PC Builder</span>
          <h1 className="hero__title">
            Build smarter.
            <br />
            <span>Pick every part.</span>
          </h1>
          <p className="hero__text">
            Explore a curated catalog of CPUs, motherboards, memory, GPUs and peripherals — with full specs, power
            draw and per-build limits for every component.
          </p>

          <div className="stat-list hero__stats">
            <div className="stat-row">
              <StatValue value={components?.length} loading={overview.loading} />
              <span className="stat-row__label">Components in catalog</span>
            </div>
            <div className="stat-row">
              <StatValue value={manufacturers?.length} loading={overview.loading} />
              <span className="stat-row__label">Trusted manufacturers</span>
            </div>
            <div className="stat-row">
              <StatValue value={categories?.length} loading={overview.loading} />
              <span className="stat-row__label">Hardware categories</span>
            </div>
          </div>

          <ArrowLink to="/components">Explore the catalog</ArrowLink>
        </div>

        <div className="panel panel--lilac hero__visual fade-up" style={{ animationDelay: '120ms' }}>
          <div className="hero__visual-tags">
            <span className="badge badge--milk">Hardware</span>
            <span className="badge badge--milk">Peripherals</span>
          </div>
          <OrbitGraphic />
          <p className="hero__caption glass">
            {countries
              ? `Brands from ${countries} countries, one place to compare specs, prices and power requirements.`
              : 'Brands from around the world, one place to compare specs, prices and power requirements.'}
          </p>
        </div>
      </section>

      {overview.error && (
        <div style={{ marginTop: 28 }}>
          <ErrorState error={overview.error} onRetry={overview.retry} title="Couldn't load data from the API" />
        </div>
      )}

      {/* ---------- Popular components ---------- */}
      {!overview.error && (
        <section className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Trending now</p>
              <h2 className="section-title">Most popular parts</h2>
              <p className="section-sub">The components builders reach for most often.</p>
            </div>
            <ArrowLink to="/components?sort_by=popularity&order=desc" light>
              View all
            </ArrowLink>
          </div>

          <div className="product-grid">
            {overview.loading
              ? Array.from({ length: 4 }, (_, i) => <ComponentCardSkeleton key={i} />)
              : components.slice(0, 4).map((c, i) => (
                  <ComponentCard key={c.id} component={c} style={{ animationDelay: `${i * 60}ms` }} />
                ))}
          </div>
        </section>
      )}

      {/* ---------- Categories ---------- */}
      {categories?.length > 0 && (
        <section className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Browse by type</p>
              <h2 className="section-title">Categories</h2>
            </div>
            <ArrowLink to="/categories" light>
              All categories
            </ArrowLink>
          </div>
          <div className="chip-row">
            {categories.map((c) => (
              <Link key={c.id} to={`/categories/${c.id}`} className="category-chip">
                <span className="category-chip__icon">
                  <Icon name={categoryIcon(c.name)} size={18} />
                </span>
                {c.name}
                <span className="category-chip__count">×{c.max_per_build}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Brands ---------- */}
      {manufacturers?.length > 0 && (
        <section className="section">
          <div className="brands panel panel--dark">
            <div className="brands__head">
              <div>
                <p className="eyebrow eyebrow--light">Partners</p>
                <h2 className="section-title">Brands you trust</h2>
              </div>
              <ArrowLink to="/manufacturers">All manufacturers</ArrowLink>
            </div>
            <div className="brands__grid">
              {manufacturers.map((m) => (
                <Link key={m.id} to={`/manufacturers/${m.id}`} className="brand-tile">
                  <span className="brand-tile__logo">
                    <ProductImage src={m.logo_url} alt={`${m.name} logo`} label={m.name} variant="logo" />
                  </span>
                  <span>
                    <strong>{m.name}</strong>
                    <small>{m.country}</small>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
