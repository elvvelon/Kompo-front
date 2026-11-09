const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export function formatPrice(value) {
  const number = Number(value);
  return Number.isFinite(number) ? priceFormatter.format(number) : '—';
}

const UNIT_SUFFIXES = {
  ghz: 'GHz',
  mhz: 'MHz',
  hz: 'Hz',
  gb: 'GB',
  tb: 'TB',
  mb: 'MB',
  w: 'W',
  mm: 'mm',
  inch: 'in',
  ms: 'ms',
};

/** "base_clock_ghz" -> "Base clock (GHz)" */
export function humanizeKey(key) {
  const parts = String(key).split('_');
  let unit = null;
  const last = parts[parts.length - 1]?.toLowerCase();
  if (parts.length > 1 && UNIT_SUFFIXES[last]) {
    unit = UNIT_SUFFIXES[last];
    parts.pop();
  }
  const label = parts.join(' ');
  const pretty = label.charAt(0).toUpperCase() + label.slice(1);
  return unit ? `${pretty} (${unit})` : pretty;
}

export function formatSpecValue(value) {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
