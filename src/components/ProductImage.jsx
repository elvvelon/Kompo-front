import { useState } from 'react';
import Icon from './Icon.jsx';
import { initials } from '../utils/format.js';

/**
 * Image with a graceful fallback. Seed data often points to placeholder URLs,
 * so when an image can't load we render a soft lilac tile instead.
 */
export default function ProductImage({ src, alt, label, icon = 'chip', className = '', variant = 'product' }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div className={`media-fallback media-fallback--${variant} ${className}`} role="img" aria-label={alt}>
        {variant === 'logo' ? (
          <span className="media-fallback__initials">{initials(label || alt)}</span>
        ) : (
          <>
            <span className="media-fallback__grid" />
            <span className="media-fallback__icon">
              <Icon name={icon} size={30} strokeWidth={1.5} />
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`media-img media-img--${variant} ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
