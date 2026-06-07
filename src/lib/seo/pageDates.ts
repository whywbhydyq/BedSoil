export const DEFAULT_LAST_MODIFIED = '2026-06-06';

const legalPageLastModified = '2026-06-06';
const calculatorPageLastModified = '2026-06-06';
const competitorPageLastModified = '2026-06-07';

const legalSlugs = new Set(['about', 'privacy', 'terms', 'disclaimer', 'contact', 'affiliate-disclosure']);
const competitorSlugs = new Set([
  'best-raised-bed-soil-calculators',
  'bedsoil-vs-gardeners-supply-soil-calculator',
  'bedsoil-vs-almanac-soil-calculator',
  'bedsoil-vs-lowes-soil-calculator',
]);

export function lastModifiedForSlug(slug?: string): string {
  if (!slug) return DEFAULT_LAST_MODIFIED;
  if (legalSlugs.has(slug)) return legalPageLastModified;
  if (competitorSlugs.has(slug)) return competitorPageLastModified;
  return calculatorPageLastModified;
}
