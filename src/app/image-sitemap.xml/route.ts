import { allPages } from '@/lib/data/pages';
import { IMAGE_SITEMAP_ASSETS } from '@/lib/data/imageSeo';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function imageXml(asset: (typeof IMAGE_SITEMAP_ASSETS)[number]): string {
  return [
    '<image:image>',
    `<image:loc>${xmlEscape(asset.contentUrl)}</image:loc>`,
    `<image:title>${xmlEscape(asset.name)}</image:title>`,
    `<image:caption>${xmlEscape(asset.caption)}</image:caption>`,
    `<image:license>${xmlEscape(asset.license)}</image:license>`,
    '</image:image>',
  ].join('');
}

export function GET() {
  const urls = [
    SITE_URL,
    ...allPages.filter((page) => !page.legal).map((page) => `${SITE_URL}/${page.slug}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls
    .map((url) => `<url><loc>${xmlEscape(url)}</loc>${IMAGE_SITEMAP_ASSETS.map(imageXml).join('')}</url>`)
    .join('')}</urlset>\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
