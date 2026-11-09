import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { useApi } from '../hooks/useApi.js';
import Icon from '../components/Icon.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { categoryIcon } from '../utils/categoryIcon.js';
import { pluralize } from '../utils/format.js';

function CategoryTile({ category, index }) {
  return (
    <Link
      to={`/categories/${category.id}`}
      className="tile tile--category fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="tile__top">
        <span className="tile__icon">
          <Icon name={categoryIcon(category.name)} size={22} />
        </span>
        <span className="tile__go" aria-hidden="true">
          <Icon name="arrowUpRight" size={16} strokeWidth={2.2} />
        </span>
      </div>
      <h3 className="tile__title">{category.name}</h3>
      <p className="tile__desc">{category.description}</p>
      <div className="tile__quota">
        <span className="tile__quota-value">{category.max_per_build}</span>
        <span className="tile__quota-label">max per build</span>
      </div>
    </Link>
  );
}

export default function Categories() {
  const { data, loading, error, retry } = useApi((signal) => api.getCategories(signal), []);

  const internal = data?.filter((c) => !c.is_periphery) || [];
  const periphery = data?.filter((c) => c.is_periphery) || [];

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Build quotas</p>
          <h1 className="page-title">Categories</h1>
          <p className="page-sub">
            Each category explains a component&apos;s role in a PC and how many of them fit into a single build.
          </p>
        </div>
        {data && <span className="badge badge--outline">{pluralize(data.length, 'category', 'categories')}</span>}
      </header>

      {error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : loading ? (
        <div className="tile-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton" style={{ height: 240 }} />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState title="No categories yet" />
      ) : (
        <>
          {internal.length > 0 && (
            <section>
              <h2 className="group-title">
                Internal components <span>{internal.length}</span>
              </h2>
              <div className="tile-grid">
                {internal.map((c, i) => (
                  <CategoryTile key={c.id} category={c} index={i} />
                ))}
              </div>
            </section>
          )}
          {periphery.length > 0 && (
            <section style={{ marginTop: 48 }}>
              <h2 className="group-title">
                Peripherals <span>{periphery.length}</span>
              </h2>
              <div className="tile-grid">
                {periphery.map((c, i) => (
                  <CategoryTile key={c.id} category={c} index={i} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
