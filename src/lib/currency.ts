const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatGBP(value: number): string {
  return gbp.format(value);
}

export function formatPriceRange(min: number, max: number): string {
  if (min === max) return formatGBP(min);
  return `${formatGBP(min)} – ${formatGBP(max)}`;
}
