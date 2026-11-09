/** Picks an icon that roughly matches a hardware category name. */
export function categoryIcon(name = '') {
  const n = name.toLowerCase();
  if (n.includes('monitor') || n.includes('display')) return 'monitor';
  if (n.includes('power') || n.includes('psu')) return 'bolt';
  if (n.includes('graphic') || n.includes('gpu')) return 'layers';
  if (n.includes('case') || n.includes('storage')) return 'box';
  return 'chip';
}
