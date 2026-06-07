import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const baseUrl = SITE_URL;

const aiSearchCrawlers = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'ClaudeBot',
  'GPTBot',
] as const;

const trainingAndBulkCrawlers = [
  'Amazonbot',
  'anthropic-ai',
  'Bytespider',
  'CCBot',
  'cohere-ai',
  'Diffbot',
  'FacebookBot',
  'Google-Extended',
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...aiSearchCrawlers.map((userAgent) => ({ userAgent, allow: '/' })),
      ...trainingAndBulkCrawlers.map((userAgent) => ({ userAgent, disallow: '/' })),
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/image-sitemap.xml`],
  };
}
