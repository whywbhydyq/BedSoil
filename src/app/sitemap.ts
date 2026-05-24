import type { MetadataRoute } from 'next';
import { allPages } from '@/lib/data/pages';
import { SITE_URL } from '@/lib/site';

const baseUrl = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...allPages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: page.legal ? 0.4 : 0.8,
    })),
  ];
}
