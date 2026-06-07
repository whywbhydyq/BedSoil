import { DEFAULT_LAST_MODIFIED, lastModifiedForSlug } from '@/lib/seo/pageDates';
import { SITE_CONTACT_EMAIL, SITE_NAME, SITE_PUBLISHER, SITE_URL } from '@/lib/site';
import { IMAGE_ACQUIRE_LICENSE_URL, IMAGE_COPYRIGHT_NOTICE, IMAGE_CREDIT_TEXT, IMAGE_LICENSE_URL, PLANNING_DIAGRAM_IMAGE, PRIMARY_OG_IMAGE } from '@/lib/data/imageSeo';
import type { PageDefinition } from '@/lib/data/pages';
import { comparisonPageForSlug, competitorProfilesForPage } from '@/lib/data/competitorPages';

export type JsonLdNode = Record<string, unknown>;
export type JsonLdValue = JsonLdNode | JsonLdNode[];

const SCHEMA_CONTEXT = 'https://schema.org';
const LANGUAGE = 'en-US';
const SITE_LOGO_ID = `${SITE_URL}/#logo`;
const SITE_IMAGE_ID = PRIMARY_OG_IMAGE.id;
const SITE_LOGO_URL = `${SITE_URL}/favicon.svg`;
const SITE_IMAGE_URL = PRIMARY_OG_IMAGE.url;

type CalculatorMode = NonNullable<PageDefinition['initial']>;

const calculatorFeatureListByMode: Record<CalculatorMode, string[]> = {
  raised: ['Raised bed cubic feet and cubic yards', 'Soil bag count', 'Settling allowance', 'Copyable shopping list'],
  bags: ['Soil volume to bag conversion', 'Dry quart, gallon, liter, and cubic-foot bag support', 'Rounded-up bag count'],
  bulk: ['Bagged soil versus bulk soil comparison', 'Delivery fee and minimum order checks', 'Overbuy and savings estimate'],
  mix: ['Soil mix component split', 'Custom percentage checks', 'Compost and topsoil volume planning'],
  containers: ['Container and grow-bag volume conversion', 'Gallons to cubic feet and liters', 'Potting mix bag estimates'],
  spacing: ['Square-foot garden grid count', 'Plant count estimate', 'Spacing assumption notes'],
  topoff: ['Annual raised bed top-off volume', 'Compost and soil replenishment estimates', 'Seasonal maintenance notes'],
  depth: ['Crop depth suitability estimate', 'Minimum and ideal depth ranges', 'Depth limitation warnings'],
  cost: ['Raised bed project cost estimate', 'Soil, compost, kit, delivery, and tax inputs', 'Per-bed total calculation'],
  multi: ['Multiple raised bed totals', 'Combined shopping list estimate', 'Project-level soil planning'],
  shapes: ['Round, L-shaped, and U-shaped bed volume', 'Non-rectangular assumptions', 'Shape-specific volume estimates'],
};

const calculatorSubCategoryByMode: Record<CalculatorMode, string> = {
  raised: 'Raised bed soil volume calculator',
  bags: 'Soil bag conversion calculator',
  bulk: 'Bulk soil cost comparison calculator',
  mix: 'Raised bed soil mix calculator',
  containers: 'Container soil volume calculator',
  spacing: 'Square-foot garden spacing calculator',
  topoff: 'Raised bed top-off calculator',
  depth: 'Raised bed crop depth calculator',
  cost: 'Raised bed cost estimator',
  multi: 'Multiple raised bed soil calculator',
  shapes: 'Non-rectangular raised bed soil calculator',
};

export function serializeJsonLd(value: JsonLdValue): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function graphJsonLd(nodes: JsonLdNode[]): JsonLdNode {
  return {
    '@context': SCHEMA_CONTEXT,
    '@graph': nodes,
  };
}

export function imageObjectJsonLd({
  id = SITE_IMAGE_ID,
  url = SITE_IMAGE_URL,
  caption = PRIMARY_OG_IMAGE.caption,
  width = PRIMARY_OG_IMAGE.width,
  height = PRIMARY_OG_IMAGE.height,
  encodingFormat = PRIMARY_OG_IMAGE.encodingFormat,
}: {
  id?: string;
  url?: string;
  caption?: string;
  width?: number;
  height?: number;
  encodingFormat?: string;
} = {}): JsonLdNode {
  return {
    '@type': 'ImageObject',
    '@id': id,
    url,
    contentUrl: url,
    width,
    height,
    encodingFormat,
    caption,
    inLanguage: LANGUAGE,
    creator: { '@id': `${SITE_URL}/#organization` },
    creditText: IMAGE_CREDIT_TEXT,
    copyrightNotice: IMAGE_COPYRIGHT_NOTICE,
    license: IMAGE_LICENSE_URL,
    acquireLicensePage: IMAGE_ACQUIRE_LICENSE_URL,
  };
}

export function planningDiagramImageObjectJsonLd(): JsonLdNode {
  return imageObjectJsonLd({
    id: PLANNING_DIAGRAM_IMAGE.id,
    url: PLANNING_DIAGRAM_IMAGE.url,
    caption: PLANNING_DIAGRAM_IMAGE.caption,
    width: PLANNING_DIAGRAM_IMAGE.width,
    height: PLANNING_DIAGRAM_IMAGE.height,
    encodingFormat: PLANNING_DIAGRAM_IMAGE.encodingFormat,
  });
}

export function organizationJsonLd(): JsonLdNode {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_PUBLISHER,
    url: SITE_URL,
    email: SITE_CONTACT_EMAIL,
    logo: {
      '@type': 'ImageObject',
      '@id': SITE_LOGO_ID,
      url: SITE_LOGO_URL,
      contentUrl: SITE_LOGO_URL,
      caption: `${SITE_NAME} logo`,
    },
    image: [{ '@id': SITE_IMAGE_ID }, { '@id': PLANNING_DIAGRAM_IMAGE.id }],
    contactPoint: {
      '@type': 'ContactPoint',
      email: SITE_CONTACT_EMAIL,
      contactType: 'customer support',
      availableLanguage: ['English'],
      url: `${SITE_URL}/contact`,
    },
  };
}

export function websiteJsonLd(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: LANGUAGE,
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'UseAction',
      name: 'Use the raised bed soil calculator',
      target: `${SITE_URL}/#calculator`,
    },
  };
}

export function siteStructuredData(): JsonLdNode {
  return graphJsonLd([imageObjectJsonLd(), planningDiagramImageObjectJsonLd(), organizationJsonLd(), websiteJsonLd()]);
}

export function webApplicationJsonLd({
  name,
  description,
  url,
  mode = 'raised',
  slug,
}: {
  name: string;
  description: string;
  url: string;
  mode?: CalculatorMode;
  slug?: string;
}): JsonLdNode {
  const dateModified = lastModifiedForSlug(slug);
  return {
    '@type': 'WebApplication',
    '@id': `${url}#calculator-app`,
    name,
    alternateName: `${SITE_NAME} ${calculatorSubCategoryByMode[mode]}`,
    description,
    applicationCategory: 'UtilitiesApplication',
    applicationSubCategory: calculatorSubCategoryByMode[mode],
    operatingSystem: 'Any',
    browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
    url,
    inLanguage: LANGUAGE,
    isAccessibleForFree: true,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    creator: { '@id': `${SITE_URL}/#organization` },
    author: { '@id': `${SITE_URL}/#organization` },
    image: [{ '@id': SITE_IMAGE_ID }, { '@id': PLANNING_DIAGRAM_IMAGE.id }],
    screenshot: { '@id': SITE_IMAGE_ID },
    featureList: calculatorFeatureListByMode[mode],
    datePublished: DEFAULT_LAST_MODIFIED,
    dateModified,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url,
    },
    potentialAction: {
      '@type': 'UseAction',
      name: `Calculate with ${name}`,
      target: `${url}#calculator`,
    },
    audience: {
      '@type': 'Audience',
      audienceType: 'Gardeners planning raised beds, containers, soil bags, bulk soil, and planting layouts',
    },
  };
}

export function webPageJsonLd({
  title,
  description,
  slug,
  aboutCalculator = true,
  pageType = 'WebPage',
}: {
  title: string;
  description: string;
  slug?: string;
  aboutCalculator?: boolean;
  pageType?: 'WebPage' | 'ContactPage' | 'CollectionPage';
}): JsonLdNode {
  const url = slug ? `${SITE_URL}/${slug}` : SITE_URL;
  const breadcrumbId = `${url}#breadcrumb`;
  const calculatorId = `${url}#calculator-app`;
  return {
    '@type': pageType,
    '@id': `${url}#webpage`,
    url,
    name: title,
    headline: title,
    description,
    inLanguage: LANGUAGE,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    creator: { '@id': `${SITE_URL}/#organization` },
    primaryImageOfPage: { '@id': SITE_IMAGE_ID },
    image: [{ '@id': SITE_IMAGE_ID }, { '@id': PLANNING_DIAGRAM_IMAGE.id }],
    breadcrumb: { '@id': breadcrumbId },
    ...(aboutCalculator ? { about: { '@id': calculatorId }, mainEntity: { '@id': calculatorId } } : {}),
    dateModified: lastModifiedForSlug(slug),
    datePublished: DEFAULT_LAST_MODIFIED,
    reviewedBy: { '@id': `${SITE_URL}/#organization` },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]): JsonLdNode {
  const currentUrl = items[items.length - 1]?.url ?? SITE_URL;
  return {
    '@type': 'BreadcrumbList',
    '@id': `${currentUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}


export function comparisonItemListJsonLd(slug: string): JsonLdNode | undefined {
  const comparison = comparisonPageForSlug(slug);
  if (!comparison) return undefined;
  const pageUrl = `${SITE_URL}/${slug}`;
  return {
    '@type': 'ItemList',
    '@id': `${pageUrl}#comparison-list`,
    name: comparison.title,
    description: comparison.description,
    itemListOrder: 'https://schema.org/ItemListUnordered',
    numberOfItems: comparison.competitors.length + 1,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE_NAME,
        url: SITE_URL,
        description: 'Free raised bed soil calculator with bag, bulk, mix, container, top-off, depth, and planning workflows.',
      },
      ...competitorProfilesForPage(comparison).map((profile, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: profile.name,
        url: profile.url,
        description: profile.publicPositioning,
      })),
    ],
  };
}

export function homeStructuredData(): JsonLdNode {
  return graphJsonLd([
    imageObjectJsonLd(),
    planningDiagramImageObjectJsonLd(),
    webApplicationJsonLd({
      name: 'BedSoil - Raised Bed Soil Calculator',
      description: 'Free raised bed soil, bag, bulk, mix, container, top-off, depth, and square-foot planting calculators.',
      url: SITE_URL,
      mode: 'raised',
    }),
    webPageJsonLd({
      title: 'Raised Bed Soil Calculator - Volume, Bags & Cost',
      description: 'Enter raised bed length, width, depth, and bag size to estimate cubic feet, cubic yards, liters, bags, bulk cost, mix ratios, and a shopping list.',
    }),
    breadcrumbJsonLd([{ name: SITE_NAME, url: SITE_URL }]),
  ]);
}

export function pageStructuredData(page: PageDefinition): JsonLdNode {
  const pageUrl = `${SITE_URL}/${page.slug}`;
  const breadcrumb = breadcrumbJsonLd([
    { name: SITE_NAME, url: SITE_URL },
    { name: page.title, url: pageUrl },
  ]);

  if (page.legal || page.comparison) {
    const comparisonList = page.comparison ? comparisonItemListJsonLd(page.slug) : undefined;
    return graphJsonLd([
      imageObjectJsonLd(),
      planningDiagramImageObjectJsonLd(),
      webPageJsonLd({
        title: page.title,
        description: page.description,
        slug: page.slug,
        aboutCalculator: false,
        pageType: page.slug === 'contact' ? 'ContactPage' : page.comparison ? 'CollectionPage' : 'WebPage',
      }),
      ...(comparisonList ? [comparisonList] : []),
      breadcrumb,
    ]);
  }

  const mode = page.initial ?? 'raised';
  return graphJsonLd([
    imageObjectJsonLd(),
    planningDiagramImageObjectJsonLd(),
    webApplicationJsonLd({ name: page.title, description: page.description, url: pageUrl, mode, slug: page.slug }),
    webPageJsonLd({ title: page.title, description: page.description, slug: page.slug, aboutCalculator: true }),
    breadcrumb,
  ]);
}
