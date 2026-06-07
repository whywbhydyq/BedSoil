import { SITE_NAME, SITE_PUBLISHER, SITE_URL } from '@/lib/site';

export type ImageSeoAsset = {
  id: string;
  url: string;
  contentUrl: string;
  name: string;
  caption: string;
  alt: string;
  width: number;
  height: number;
  encodingFormat: string;
  license: string;
  acquireLicensePage: string;
  creditText: string;
  copyrightNotice: string;
};

export const IMAGE_LICENSE_URL = `${SITE_URL}/terms`;
export const IMAGE_ACQUIRE_LICENSE_URL = `${SITE_URL}/contact`;
export const IMAGE_CREDIT_TEXT = `${SITE_PUBLISHER} / ${SITE_NAME}`;
export const IMAGE_COPYRIGHT_NOTICE = `Copyright 2026 ${SITE_PUBLISHER}`;

export const PRIMARY_OG_IMAGE: ImageSeoAsset = {
  id: `${SITE_URL}/#primaryimage`,
  url: `${SITE_URL}/og-bedsoil.png`,
  contentUrl: `${SITE_URL}/og-bedsoil.png`,
  name: 'BedSoil raised bed soil calculator preview',
  caption: 'Preview card for the BedSoil raised bed soil calculator showing soil volume, bag count, bulk order, mix, and shopping list planning.',
  alt: 'BedSoil raised bed soil calculator preview',
  width: 1200,
  height: 630,
  encodingFormat: 'image/png',
  license: IMAGE_LICENSE_URL,
  acquireLicensePage: IMAGE_ACQUIRE_LICENSE_URL,
  creditText: IMAGE_CREDIT_TEXT,
  copyrightNotice: IMAGE_COPYRIGHT_NOTICE,
};

export const PLANNING_DIAGRAM_IMAGE: ImageSeoAsset = {
  id: `${SITE_URL}/#soil-planning-diagram`,
  url: `${SITE_URL}/raised-bed-soil-planning-diagram.svg`,
  contentUrl: `${SITE_URL}/raised-bed-soil-planning-diagram.svg`,
  name: 'Raised bed soil planning diagram',
  caption: 'Diagram showing how raised bed dimensions become soil volume, bag count, bulk order, mix ratio, and a shopping-list estimate.',
  alt: 'Raised bed soil planning diagram',
  width: 960,
  height: 540,
  encodingFormat: 'image/svg+xml',
  license: IMAGE_LICENSE_URL,
  acquireLicensePage: IMAGE_ACQUIRE_LICENSE_URL,
  creditText: IMAGE_CREDIT_TEXT,
  copyrightNotice: IMAGE_COPYRIGHT_NOTICE,
};

export const RESPONSIVE_PREVIEW_SOURCES = [
  { srcSet: '/og-bedsoil.avif 1200w, /og-bedsoil-800.avif 800w, /og-bedsoil-400.avif 400w', type: 'image/avif' },
  { srcSet: '/og-bedsoil.webp 1200w, /og-bedsoil-800.webp 800w, /og-bedsoil-400.webp 400w', type: 'image/webp' },
] as const;

export const PREVIEW_FALLBACK_SRCSET = '/og-bedsoil.png 1200w';

export function imageAltForTitle(title: string): string {
  const cleanTitle = title.replace(/\s+/g, ' ').trim();
  const candidate = `Soil planning diagram for ${cleanTitle}`;
  return candidate.length <= 110 ? candidate : 'Raised bed soil planning diagram';
}

export function previewAltForTitle(title: string): string {
  const cleanTitle = title.replace(/\s+/g, ' ').trim();
  const candidate = `${cleanTitle} calculator preview with volume, bags, bulk, mix, and shopping list`;
  return candidate.length <= 120 ? candidate : 'BedSoil calculator preview with volume, bags, bulk, mix, and shopping list';
}

export const IMAGE_SEO_CHECKLIST = [
  'Images use standard HTML img elements or Next.js Image output so crawlers can discover src URLs.',
  'Visible diagrams include concise alt text, fixed dimensions, and surrounding explanatory copy.',
  'Primary preview image is supplied through OpenGraph metadata, Twitter metadata, and WebPage primaryImageOfPage JSON-LD.',
  'Responsive AVIF and WebP preview variants are available at 400, 800, and 1200 px widths with a PNG fallback for broad crawler and browser support.',
  'ImageObject nodes include creator, credit, copyright, license, and acquire-license contact fields.',
] as const;

export const IMAGE_SITEMAP_ASSETS = [PRIMARY_OG_IMAGE, PLANNING_DIAGRAM_IMAGE] as const;
