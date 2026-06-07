import type { MetadataRoute } from 'next';
import { allPages } from '@/lib/data/pages';
import { lastModifiedForSlug } from '@/lib/seo/pageDates';
import { SITE_URL } from '@/lib/site';

const baseUrl = SITE_URL;

function priorityFor(slug: string) {
  if (slug === 'raised-bed-soil-calculator') return 0.95;
  if (slug === '4x8-raised-bed-soil-calculator') return 0.9;
  if (['soil-bags-calculator', 'bulk-soil-vs-bags-calculator', 'raised-bed-soil-mix-calculator'].includes(slug)) return 0.85;
  if (['about', 'privacy', 'terms', 'disclaimer', 'contact', 'affiliate-disclosure'].includes(slug)) return 0.4;
  return 0.7;
}

function changeFrequencyFor(slug: string): MetadataRoute.Sitemap[number]['changeFrequency'] {
  if (['about', 'privacy', 'terms', 'disclaimer', 'contact', 'affiliate-disclosure'].includes(slug)) return 'monthly';
  return 'weekly';
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, lastModified: lastModifiedForSlug(), changeFrequency: 'weekly', priority: 1 },
    ...allPages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: lastModifiedForSlug(page.slug),
      changeFrequency: changeFrequencyFor(page.slug),
      priority: priorityFor(page.slug),
    })),
  ];
}
