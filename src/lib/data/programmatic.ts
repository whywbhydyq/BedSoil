import { allPages, type PageDefinition } from '@/lib/data/pages';
import { comparisonPageForSlug } from '@/lib/data/competitorPages';
import { slugToTitle } from '@/lib/utils/format';

export type ProgrammaticCluster = {
  id: string;
  label: string;
  description: string;
  hubSlug: string;
  match: (page: PageDefinition) => boolean;
};

export type ProgrammaticLink = {
  slug: string;
  title: string;
  anchor: string;
  reason: string;
};

export type ProgrammaticQualityStatus = 'pass' | 'review';

export type ProgrammaticProfile = {
  cluster: ProgrammaticCluster;
  routeType: 'calculator' | 'comparison' | 'support';
  templateFamily: string;
  dataSource: string;
  uniqueAttributes: string[];
  uniquenessEstimate: number;
  qualityGate: {
    status: ProgrammaticQualityStatus;
    label: string;
    details: string;
  };
  indexPolicy: string;
  rolloutPolicy: string;
  related: ProgrammaticLink[];
};

const modeLabels: Record<NonNullable<PageDefinition['initial']>, string> = {
  raised: 'raised-bed volume',
  bags: 'soil bag conversion',
  bulk: 'bulk-versus-bag cost',
  mix: 'soil mix ratio',
  containers: 'container and grow-bag volume',
  spacing: 'square-foot planting',
  topoff: 'seasonal top-off',
  depth: 'crop depth suitability',
  cost: 'project cost planning',
  multi: 'multi-bed aggregation',
  shapes: 'non-rectangular bed volume',
};

export const PROGRAMMATIC_CLUSTERS: ProgrammaticCluster[] = [
  {
    id: '4x8-depth',
    label: '4×8 depth calculators',
    description: 'A controlled 4×8 page set where each URL has a fixed depth-specific formula, example, and buying context.',
    hubSlug: '4x8-raised-bed-soil-calculator',
    match: (page) => page.slug.startsWith('4x8-raised-bed-') || page.slug === 'how-much-soil-for-4x8-raised-bed',
  },
  {
    id: 'raised-bed-size',
    label: 'Raised bed size calculators',
    description: 'Pages generated from common bed footprints, editable depth, freeboard, quantity, and settling assumptions.',
    hubSlug: 'raised-bed-soil-calculator',
    match: (page) => page.initial === 'raised' || page.slug.includes('raised-bed-cubic-feet'),
  },
  {
    id: 'bag-conversion',
    label: 'Soil bag conversion calculators',
    description: 'Bag-size pages generated from package volume labels and rounded-up buying logic.',
    hubSlug: 'soil-bags-calculator',
    match: (page) => page.initial === 'bags' || page.slug.includes('bags-of-soil') || page.slug.includes('liters-to-cubic-feet'),
  },
  {
    id: 'bulk-cost',
    label: 'Bulk soil and cost calculators',
    description: 'Pages comparing bags, cubic-yard bulk ordering, delivery fees, supplier minimums, and overbuy volume.',
    hubSlug: 'bulk-soil-vs-bags-calculator',
    match: (page) => page.initial === 'bulk' || page.initial === 'cost' || page.slug.includes('cheapest-way'),
  },
  {
    id: 'mix-ratio',
    label: 'Raised bed mix calculators',
    description: 'Mix pages generated from compost, topsoil, potting mix, and custom percentage assumptions.',
    hubSlug: 'raised-bed-soil-mix-calculator',
    match: (page) => page.initial === 'mix' || page.slug.includes('compost'),
  },
  {
    id: 'container-volume',
    label: 'Container and grow-bag calculators',
    description: 'Container pages generated from gallon labels, pot dimensions, planter shapes, quantity, and fill-line assumptions.',
    hubSlug: 'container-soil-calculator',
    match: (page) => page.initial === 'containers' || page.slug.includes('grow-bag') || page.slug.includes('pots'),
  },
  {
    id: 'planting-layout',
    label: 'Spacing and planting layout calculators',
    description: 'Planting pages generated from square-foot grids, crop-specific spacing, support style, and depth constraints.',
    hubSlug: 'square-foot-garden-spacing-calculator',
    match: (page) => page.initial === 'spacing' || page.slug.includes('planting-layout'),
  },
  {
    id: 'depth-screen',
    label: 'Crop depth suitability pages',
    description: 'Depth pages generated from crop group, planned soil depth, surface below the bed, and conservative root-volume checks.',
    hubSlug: 'raised-bed-depth-calculator',
    match: (page) => page.initial === 'depth',
  },
  {
    id: 'seasonal-maintenance',
    label: 'Seasonal top-off calculators',
    description: 'Maintenance pages generated from bed surface area, measured seasonal drop, compost/top-off quantity, and checklist context.',
    hubSlug: 'annual-raised-bed-top-off-calculator',
    match: (page) => page.initial === 'topoff' || page.slug.includes('checklist'),
  },
  {
    id: 'shape-volume',
    label: 'Non-rectangular bed calculators',
    description: 'Shape pages generated from circles, L-shapes, U-shapes, section subtraction, and shared depth assumptions.',
    hubSlug: 'round-raised-bed-soil-calculator',
    match: (page) => page.initial === 'shapes',
  },
  {
    id: 'multi-bed',
    label: 'Multi-bed planning calculators',
    description: 'Aggregation pages generated from several bed or container rows before final bag rounding.',
    hubSlug: 'multiple-raised-bed-soil-calculator',
    match: (page) => page.initial === 'multi',
  },
  {
    id: 'calculator-comparison',
    label: 'Calculator comparison pages',
    description: 'Comparison pages generated from a small, cited competitor dataset, visible disclosure text, review dates, and calculator next-step links.',
    hubSlug: 'best-raised-bed-soil-calculators',
    match: (page) => Boolean(page.comparison),
  },
];

const fallbackCluster: ProgrammaticCluster = {
  id: 'support',
  label: 'Support and policy pages',
  description: 'Non-calculator pages that explain scope, correction, privacy, terms, and affiliate disclosures.',
  hubSlug: 'about',
  match: () => true,
};

export function routeTypeForPage(page: PageDefinition): ProgrammaticProfile['routeType'] {
  if (page.comparison) return 'comparison';
  if (page.initial) return 'calculator';
  return 'support';
}

export function programmaticPublishedPages() {
  return allPages.filter((page) => page.initial || page.comparison);
}

export function programmaticClusterForPage(page: PageDefinition): ProgrammaticCluster {
  return PROGRAMMATIC_CLUSTERS.find((cluster) => cluster.match(page)) ?? fallbackCluster;
}

export function homepageProgrammaticClusters() {
  return PROGRAMMATIC_CLUSTERS.map((cluster) => ({
    ...cluster,
    pages: programmaticPublishedPages().filter((page) => cluster.match(page)).map((page) => page.slug),
  })).filter((cluster) => cluster.pages.length > 0);
}

function depthSignal(slug: string) {
  const match = slug.match(/(6|8|10|12|18|24)-inches-soil/);
  return match ? `${match[1]} inch fixed-depth page` : undefined;
}

function sizeSignal(title: string) {
  const match = title.match(/(\d+)×(\d+)/);
  return match ? `${match[1]}×${match[2]} footprint` : undefined;
}

function bagSignal(slug: string) {
  if (slug.includes('40-qt')) return '40 dry quart bag label';
  if (slug.includes('1-5-cubic-foot')) return '1.5 ft³ bag label';
  if (slug.includes('1-cubic-foot')) return '1 ft³ bag label';
  if (slug.includes('2-cubic-foot')) return '2 ft³ bag label';
  if (slug.includes('40-lb')) return 'weight-labeled soil warning';
  if (slug.includes('liters')) return 'liter package conversion';
  if (slug.includes('cubic-yards')) return 'cubic-yard conversion';
  return undefined;
}

function cropSignal(slug: string) {
  for (const crop of ['tomato', 'pepper', 'lettuce', 'carrot', 'cucumber', 'basil']) {
    if (slug.includes(crop)) return `${crop} planning assumptions`;
  }
  return undefined;
}

function shapeSignal(slug: string) {
  if (slug.includes('round')) return 'round bed cylinder formula';
  if (slug.includes('l-shaped')) return 'L-shaped section subtraction';
  if (slug.includes('u-shaped')) return 'U-shaped section subtraction';
  return undefined;
}

function containerSignal(slug: string) {
  if (slug.includes('10-gallon')) return '10 gallon grow-bag conversion';
  if (slug.includes('20-gallon')) return '20 gallon grow-bag conversion';
  if (slug.includes('5-gallon')) return '5 gallon bucket conversion';
  if (slug.includes('six-inch-pots')) return '45 six-inch pot quantity';
  if (slug.includes('planter')) return 'planter dimension formula';
  if (slug.includes('grow-bag')) return 'grow-bag gallon conversion';
  return undefined;
}

function comparisonSignal(page: PageDefinition) {
  if (!page.comparison) return [];
  const comparisonPage = comparisonPageForSlug(page.comparison);
  if (!comparisonPage) return [`Comparison slug: ${page.comparison}`];
  return [
    `Comparison type: ${comparisonPage.pageType}`,
    `Target keyword: ${comparisonPage.targetKeyword}`,
    `Competitor count: ${comparisonPage.competitors.length}`,
    `Matrix rows: ${comparisonPage.matrix.length}`,
    `Best-fit scenarios: ${comparisonPage.bestFor.length}`,
    `Disclosure: ${comparisonPage.sourceDisclosure}`,
  ];
}

function uniqueAttributesForPage(page: PageDefinition) {
  const attributes = [
    `URL slug: ${page.slug}`,
    `Template family: ${page.initial ? modeLabels[page.initial] : page.comparison ? 'fair calculator comparison' : 'support page'}`,
    `Formula: ${page.formula ?? (page.comparison ? 'feature-matrix comparison, not a calculator formula' : 'policy/support content, not a calculator formula')}`,
    `Example: ${page.example ?? page.description}`,
    ...(page.notes ?? []).map((note) => `Page note: ${note}`),
    ...(page.related ?? []).slice(0, 4).map((slug) => `Related next step: ${slugToTitle(slug)}`),
    ...comparisonSignal(page),
    depthSignal(page.slug),
    sizeSignal(page.title),
    bagSignal(page.slug),
    cropSignal(page.slug),
    shapeSignal(page.slug),
    containerSignal(page.slug),
  ].filter(Boolean) as string[];

  return [...new Set(attributes)].slice(0, 12);
}

function linkReason(source: PageDefinition, target: PageDefinition, cluster: ProgrammaticCluster) {
  if (source.related?.includes(target.slug)) return 'Directly linked in the source record as the next calculator step.';
  if (target.slug === cluster.hubSlug) return `Cluster hub for ${cluster.label.toLowerCase()}.`;
  if (source.comparison && target.initial) return 'Comparison page next-step calculator for users who want to run the BedSoil workflow.';
  if (source.comparison && target.comparison) return 'Sibling comparison page in the calculator alternatives cluster.';
  if (source.initial && source.initial === target.initial) return `Same template family: ${modeLabels[source.initial]}.`;
  if (source.slug.includes('4x8') && target.slug.includes('4x8')) return 'Same 4×8 planning series with a different depth or layout assumption.';
  if (source.slug.includes('grow-bag') && target.slug.includes('grow-bag')) return 'Same grow-bag conversion family with a different gallon label.';
  if (source.slug.includes('spacing') && target.slug.includes('depth')) return 'Useful follow-up from spacing to depth suitability.';
  return `Related page in the ${cluster.label.toLowerCase()} cluster.`;
}

function anchorForLink(target: PageDefinition, reason: string) {
  if (reason.startsWith('Cluster hub')) return `${target.title} hub`;
  if (target.comparison) return `${target.title.replace(' 2026', '')} comparison`;
  if (target.slug.includes('4x8-raised-bed-') && target.slug.includes('inches')) return `${target.title.replace(' Calculator', '')} depth estimate`;
  if (target.initial === 'bags') return `${target.title} for bag counts`;
  if (target.initial === 'bulk') return `${target.title} for bulk comparison`;
  if (target.initial === 'mix') return `${target.title} for mix ratios`;
  if (target.initial === 'spacing') return `${target.title} for planting layout`;
  return target.title;
}

function orderedUnique<T>(items: T[], key: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const id = key(item);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

export function programmaticRelatedPages(page: PageDefinition, limit = 7): ProgrammaticLink[] {
  const cluster = programmaticClusterForPage(page);
  const relatedSlugs = page.related ?? [];
  const clusterPages = programmaticPublishedPages().filter((candidate) => cluster.match(candidate)).map((candidate) => candidate.slug);
  const sameModePages = programmaticPublishedPages().filter((candidate) => candidate.initial && candidate.initial === page.initial).map((candidate) => candidate.slug);
  const comparisonHubSlugs = page.comparison ? ['best-raised-bed-soil-calculators', ...relatedSlugs] : [];
  const fallbackSlugs = ['raised-bed-soil-calculator', 'soil-bags-calculator', 'bulk-soil-vs-bags-calculator', 'raised-bed-soil-mix-calculator'];
  const slugs = orderedUnique([cluster.hubSlug, ...comparisonHubSlugs, ...relatedSlugs, ...clusterPages, ...sameModePages, ...fallbackSlugs], String)
    .filter((slug) => slug !== page.slug);

  return slugs
    .map((slug) => allPages.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is PageDefinition => Boolean(candidate))
    .slice(0, limit)
    .map((target) => {
      const reason = linkReason(page, target, cluster);
      return {
        slug: target.slug,
        title: target.title,
        anchor: anchorForLink(target, reason),
        reason,
      };
    });
}

function qualityStatusFor(attributes: string[], routeType: ProgrammaticProfile['routeType']): ProgrammaticQualityStatus {
  if (routeType === 'support') return 'review';
  return attributes.length >= (routeType === 'comparison' ? 8 : 6) ? 'pass' : 'review';
}

function qualityLabel(status: ProgrammaticQualityStatus, routeType: ProgrammaticProfile['routeType']) {
  if (status === 'pass' && routeType === 'comparison') return 'Passes comparison-page evidence gate';
  if (status === 'pass') return 'Passes controlled-set quality gate';
  return 'Review before indexing at larger scale';
}

function qualityDetails(status: ProgrammaticQualityStatus, routeType: ProgrammaticProfile['routeType']) {
  if (status === 'pass' && routeType === 'comparison') {
    return 'This comparison page has a disclosed review date, public-source boundary, feature matrix, best-fit scenarios, and calculator next-step links.';
  }
  if (status === 'pass') {
    return 'This page has enough distinct structured inputs to publish within the current controlled page set.';
  }
  return 'This page should be manually reviewed or consolidated if the programmatic set expands beyond the current controlled inventory.';
}

function dataSourceForPage(routeType: ProgrammaticProfile['routeType']) {
  if (routeType === 'comparison') return 'src/lib/data/competitorPages.ts plus public-source notes, review date, feature matrix rows, disclosure, and calculator next-step links.';
  if (routeType === 'calculator') return 'src/lib/data/pages.ts plus calculator mode, formula, example, notes, related slugs, and page-specific content modules.';
  return 'src/lib/data/pages.ts support-page copy, legal scope, and policy content.';
}

function indexPolicyFor(routeType: ProgrammaticProfile['routeType']) {
  if (routeType === 'comparison') {
    return 'Indexable only while the comparison remains balanced, sourced, and visibly reviewed; refresh public-source notes quarterly or after competitor page changes.';
  }
  if (routeType === 'calculator') {
    return 'Indexable, self-canonical URL with no parameterized primary content. Exclude future low-value filter or sort variants from sitemap.';
  }
  return 'Indexable support page when it is user-facing and included intentionally in sitemap; no bulk variants.';
}

export function programmaticProfileForPage(page: PageDefinition): ProgrammaticProfile {
  const cluster = programmaticClusterForPage(page);
  const routeType = routeTypeForPage(page);
  const uniqueAttributes = uniqueAttributesForPage(page);
  const status = qualityStatusFor(uniqueAttributes, routeType);
  const uniquenessEstimate = Math.min(96, Math.max(42, 34 + uniqueAttributes.length * 7));

  return {
    cluster,
    routeType,
    templateFamily: page.initial ? modeLabels[page.initial] : page.comparison ? 'fair calculator comparison' : 'support and policy page',
    dataSource: dataSourceForPage(routeType),
    uniqueAttributes,
    uniquenessEstimate,
    qualityGate: {
      status,
      label: qualityLabel(status, routeType),
      details: qualityDetails(status, routeType),
    },
    indexPolicy: indexPolicyFor(routeType),
    rolloutPolicy: 'Current inventory is a small controlled set under the 100-page review-warning gate; future expansions should ship in batches with manual sample review and GSC monitoring.',
    related: programmaticRelatedPages(page),
  };
}

export function programmaticAnchorLabel(slug: string) {
  const page = allPages.find((candidate) => candidate.slug === slug);
  return page?.title ?? slugToTitle(slug);
}
