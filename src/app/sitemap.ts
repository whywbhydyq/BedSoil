import type { MetadataRoute } from 'next';
import { allPages } from '@/lib/data/pages';
import { SITE_URL } from '@/lib/site';

const baseUrl = SITE_URL;

const indexedSlugs = new Set([
  'raised-bed-soil-calculator',
  '4x8-raised-bed-soil-calculator',
  'soil-bags-calculator',
  'bulk-soil-vs-bags-calculator',
  'raised-bed-soil-mix-calculator',
  'container-soil-calculator',
  'grow-bag-soil-calculator',
  'square-foot-garden-spacing-calculator',
  'annual-raised-bed-top-off-calculator',
  'raised-bed-depth-calculator',
  '4x4-raised-bed-soil-calculator',
  '4x6-raised-bed-soil-calculator',
  'raised-bed-cubic-feet-calculator',
  '40-qt-soil-bag-calculator',
  'about',
  'privacy',
  'terms',
  'disclaimer',
  'contact',
  'affiliate-disclosure',
]);

function priorityFor(slug: string) {
  if (slug === 'raised-bed-soil-calculator') return 0.95;
  if (slug === '4x8-raised-bed-soil-calculator') return 0.9;
  if (['soil-bags-calculator', 'bulk-soil-vs-bags-calculator', 'raised-bed-soil-mix-calculator'].includes(slug)) return 0.85;
  if (['about', 'privacy', 'terms', 'disclaimer', 'contact', 'affiliate-disclosure'].includes(slug)) return 0.4;
  return 0.7;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...allPages.filter((page) => indexedSlugs.has(page.slug)).map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: priorityFor(page.slug),
    })),
  ];
}
