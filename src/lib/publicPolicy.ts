export const indexableSlugs = new Set([
  'raised-bed-soil-calculator',
  '4x8-raised-bed-soil-calculator',
  'soil-bags-calculator',
  'bulk-soil-vs-bags-calculator',
  'raised-bed-soil-mix-calculator',
  'container-soil-calculator',
  'grow-bag-soil-calculator',
  'square-foot-garden-spacing-calculator',
  'raised-bed-depth-calculator',
  'annual-raised-bed-top-off-calculator',
  'raised-bed-cost-calculator',
  'multiple-raised-bed-soil-calculator',
  'round-raised-bed-soil-calculator',
  'about', 'privacy', 'terms', 'disclaimer', 'contact', 'affiliate-disclosure'
]);

export const adsenseAllowedPaths = new Set([
  '/',
  '/raised-bed-soil-calculator',
  '/4x8-raised-bed-soil-calculator',
  '/soil-bags-calculator',
  '/bulk-soil-vs-bags-calculator',
  '/raised-bed-soil-mix-calculator'
]);

export const isIndexableSlug = (slug: string) => indexableSlugs.has(slug);
export function isAdsenseAllowedPath(pathname: string) {
  const normalized = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  return adsenseAllowedPaths.has(normalized);
}
