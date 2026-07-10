import type { MetadataRoute } from 'next';
import { allPages } from '@/lib/data/pages';
import { isIndexableSlug } from '@/lib/publicPolicy';
import { SITE_URL } from '@/lib/site';

function priorityFor(slug: string) {
  if (slug === 'raised-bed-soil-calculator') return 0.95;
  if (slug === '4x8-raised-bed-soil-calculator') return 0.9;
  if (['soil-bags-calculator', 'bulk-soil-vs-bags-calculator', 'raised-bed-soil-mix-calculator'].includes(slug)) return 0.85;
  if (['about', 'privacy', 'terms', 'disclaimer', 'contact', 'affiliate-disclosure'].includes(slug)) return 0.4;
  return 0.7;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date('2026-07-10T00:00:00.000Z');
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...allPages.filter((page) => isIndexableSlug(page.slug)).map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: now,
      changeFrequency: page.legal ? 'monthly' as const : 'weekly' as const,
      priority: priorityFor(page.slug),
    })),
  ];
}
