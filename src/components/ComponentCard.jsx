import { Link } from 'react-router-dom';
import ProductImage from './ProductImage.jsx';
import Icon from './Icon.jsx';
import { formatPrice } from '../utils/format.js';
import { categoryIcon } from '../utils/categoryIcon.js';

export default function ComponentCard({ component, style }) {
  const { id, name, sku, price, power_watts, popularity_score, image_url, manufacturer, category } = component;

  return (
    <Link to={`/components/${id}`} className="product-card fade-up" style={style}>
      <div className="product-card__media">
        <ProductImage src={image_url} alt={name} icon={categoryIcon(category?.name)} />
        {category && <span className="badge badge--milk product-card__category">{category.name}</span>}
      </div>

      <div className="product-card__body">
        <span className="product-card__brand">{manufacturer?.name}</span>
        <h3 className="product-card__title">{name}</h3>
        <span className="product-card__sku">SKU · {sku}</span>

        <div className="product-card__meta">
          <span title="Power consumption">
            <Icon name="bolt" size={14} /> {power_watts} W
          </span>
          <span title="Popularity score">
            <Icon name="star" size={14} /> {popularity_score}
          </span>
        </div>
      </div>

      <div className="product-card__footer">
        <span className="product-card__price">{formatPrice(price)}</span>
        <span className="product-card__go" aria-hidden="true">
          <Icon name="arrowUpRight" size={16} strokeWidth={2.2} />
        </span>
      </div>
    </Link>
  );
}

export function ComponentCardSkeleton() {
  return <div className="skeleton" style={{ height: 380 }} />;
}
