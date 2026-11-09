import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { useApi } from '../hooks/useApi.js';
import { useDebounce } from '../hooks/useDebounce.js';
import ComponentCard, { ComponentCardSkeleton } from '../components/ComponentCard.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import Icon from '../components/Icon.jsx';
import { pluralize } from '../utils/format.js';

const SORT_OPTIONS = [
  { value: '', label: 'Default order' },
  { value: 'price:asc', label: 'Price: low to high' },
  { value: 'price:desc', label: 'Price: high to low' },
  { value: 'popularity:desc', label: 'Most popular' },
  { value: 'power_watts:asc', label: 'Power: lowest first' },
  { value: 'power_watts:desc', label: 'Power: highest first' },
  { value: 'category:asc', label: 'Category (A–Z)' },
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category_id') || '';
  const manufacturerId = searchParams.get('manufacturer_id') || '';
  const sortBy = searchParams.get('sort_by') || '';
  const order = searchParams.get('order') || '';
  const sortValue = sortBy ? `${sortBy}:${order || 'asc'}` : '';

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const search = useDebounce(searchInput.trim());

  const updateParams = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next, { replace: true });
  };

  // Keep the debounced search term in the URL so results are shareable.
  useEffect(() => {
    if ((searchParams.get('search') || '') !== search) updateParams({ search });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const filters = useApi(
    (signal) => Promise.all([api.getCategories(signal), api.getManufacturers(signal)]),
    [],
  );
  const [categories = [], manufacturers = []] = filters.data || [];

  const components = useApi(
    (signal) =>
      api.getComponents(
        { search, category_id: categoryId, manufacturer_id: manufacturerId, sort_by: sortBy, order },
        signal,
      ),
    [search, categoryId, manufacturerId, sortBy, order],
  );

  const hasFilters = Boolean(search || categoryId || manufacturerId || sortBy);

  const resetFilters = () => {
    setSearchInput('');
    setSearchParams({}, { replace: true });
  };

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Hardware catalog</p>
          <h1 className="page-title">Find your next part</h1>
          <p className="page-sub">
            Browse CPUs, motherboards, memory, graphics cards and peripherals. Search by name or exact SKU,
            filter by category and brand, and sort by what matters to you.
          </p>
        </div>
        {components.data && (
          <span className="badge badge--outline">{pluralize(components.data.length, 'component')}</span>
        )}
      </header>

      <div className="toolbar panel">
        <label className="field field--search">
          <Icon name="search" size={18} />
          <input
            type="search"
            placeholder="Search by name or SKU…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search components"
          />
        </label>

        <label className="field">
          <span className="field__label">Category</span>
          <select value={categoryId} onChange={(e) => updateParams({ category_id: e.target.value })}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Manufacturer</span>
          <select value={manufacturerId} onChange={(e) => updateParams({ manufacturer_id: e.target.value })}>
            <option value="">All brands</option>
            {manufacturers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Sort by</span>
          <select
            value={sortValue}
            onChange={(e) => {
              const [nextSort = '', nextOrder = ''] = e.target.value.split(':');
              updateParams({ sort_by: nextSort, order: nextOrder });
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        {hasFilters && (
          <button type="button" className="btn btn--ghost toolbar__reset" onClick={resetFilters}>
            Reset
          </button>
        )}
      </div>

      <section style={{ marginTop: 28 }}>
        {components.error ? (
          <ErrorState error={components.error} onRetry={components.retry} />
        ) : components.loading && !components.data ? (
          <div className="product-grid">
            {Array.from({ length: 8 }, (_, i) => (
              <ComponentCardSkeleton key={i} />
            ))}
          </div>
        ) : components.data.length === 0 ? (
          <EmptyState title="No components found" text="Try a different search term or clear the filters.">
            {hasFilters && (
              <button type="button" className="btn btn--primary" onClick={resetFilters}>
                Clear filters
              </button>
            )}
          </EmptyState>
        ) : (
          <div className={`product-grid ${components.loading ? 'is-refreshing' : ''}`}>
            {components.data.map((component, i) => (
              <ComponentCard
                key={component.id}
                component={component}
                style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
