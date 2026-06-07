import type { PageDefinition } from '@/lib/data/pages';

export type CompetitorId = 'gardeners' | 'almanac' | 'lowes' | 'soilcalculator';

export type CompetitorProfile = {
  id: CompetitorId;
  name: string;
  url: string;
  publicPositioning: string;
  strengths: string[];
  verifiedLimits: string[];
  sourceNotes: string[];
};

export type ComparisonRow = {
  criterion: string;
  bedsoil: string;
  gardeners?: string;
  almanac?: string;
  lowes?: string;
  soilcalculator?: string;
};

export type CompetitorComparisonPage = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  targetKeyword: string;
  pageType: 'roundup' | 'versus';
  summary: string;
  verdict: string;
  competitors: CompetitorId[];
  relatedCalculators: string[];
  matrix: ComparisonRow[];
  bestFor: { label: string; text: string }[];
  sourceDisclosure: string;
  primaryCta: string;
  primaryCtaHref: string;
  secondaryCta?: string;
  secondaryCtaHref?: string;
};

export const COMPETITOR_REVIEW_DATE = '2026-06-07';

export const competitorProfiles: Record<CompetitorId, CompetitorProfile> = {
  gardeners: {
    id: 'gardeners',
    name: "Gardener's Supply soil calculator",
    url: 'https://www.gardeners.com/blogs/vegetable-gardening-articles/soil-calculator',
    publicPositioning: 'Garden soil calculator for raised beds, pots, and elevated planters with shape selection.',
    strengths: ['Raised bed and planter modes', 'Rectangle, square, and circle shape choices', 'Cubic feet and cubic yards for raised beds'],
    verifiedLimits: ['Shopping-list, bulk-delivery, and copy/export workflows were not verified from the public page snapshot used here.'],
    sourceNotes: ['Public page states that Raised Bed calculates in cubic yards and cubic feet and that Pot or Elevated Planter calculates in quarts.'],
  },
  almanac: {
    id: 'almanac',
    name: "The Old Farmer's Almanac soil calculator",
    url: 'https://www.almanac.com/tool/soil-calculator',
    publicPositioning: 'Soil calculator for raised garden beds and containers with dimension-based estimates.',
    strengths: ['Strong gardening brand context', 'Raised bed and pot dimension entry', 'Simple answer-first calculator positioning'],
    verifiedLimits: ['Bulk price comparison, bag rounding details, and copyable shopping-list workflow were not verified from the public page snapshot used here.'],
    sourceNotes: ['Public page describes entering raised bed or pot dimensions to tell users how much soil they need.'],
  },
  lowes: {
    id: 'lowes',
    name: "Lowe's mulch and soil calculator",
    url: 'https://www.lowes.com/n/calculators/mulch-and-soil-calculator',
    publicPositioning: 'Retail soil and mulch estimator for garden and landscaping projects.',
    strengths: ['Retail buying context', 'Area and acreage inputs', 'Mulch and soil project framing'],
    verifiedLimits: ['It is framed as an estimating tool; raised-bed mix, square-foot spacing, and independent source notes were not verified from the public page snapshot used here.'],
    sourceNotes: ['Public page says the calculator estimates how much mulch or soil is needed and is an estimating tool only.'],
  },
  soilcalculator: {
    id: 'soilcalculator',
    name: 'SoilCalculator.com',
    url: 'https://soilcalculator.com/',
    publicPositioning: 'Dedicated soil calculator homepage for raised garden beds and potting containers.',
    strengths: ['Cubic feet and cubic yards output', 'Bag count output', 'Raised bed and potting-container focus'],
    verifiedLimits: ['Bulk delivery fees, soil mix component splits, square-foot planting layout, and explicit methodology panels were not verified from the public page snapshot used here.'],
    sourceNotes: ['Public page shows raised garden bed and potting-container calculation plus cubic feet, cubic yards, and bags of soil needed.'],
  },
};

const standardMatrix: ComparisonRow[] = [
  {
    criterion: 'Primary job',
    bedsoil: 'Raised-bed soil volume, bag count, bulk/cost comparison, mix split, container volume, depth, top-off, and planting layout planning.',
    gardeners: 'Raised bed and planter soil amount calculation.',
    almanac: 'Raised bed or pot soil amount calculation.',
    lowes: 'Mulch and soil estimating for garden and landscaping projects.',
    soilcalculator: 'Soil calculation for raised garden beds and potting containers.',
  },
  {
    criterion: 'Volume outputs',
    bedsoil: 'Cubic feet, cubic yards, liters, dry quarts, gallons where relevant, and rounded bag count.',
    gardeners: 'Raised bed output is publicly described as cubic yards and cubic feet; planter output is quarts.',
    almanac: 'How much soil is needed from dimensions; exact public output set should be verified live before quoting beyond that.',
    lowes: 'Estimator-style mulch or soil quantity output; exact output labels should be verified live before quoting beyond that.',
    soilcalculator: 'Public page shows cubic feet, cubic yards, and bags of soil needed.',
  },
  {
    criterion: 'Bag and purchase planning',
    bedsoil: 'Package-volume presets, rounded-up bag count, copyable shopping list, bulk order minimum, delivery fee, and overbuy checks.',
    gardeners: 'Not publicly verified from the snapshot used for this comparison.',
    almanac: 'Not publicly verified from the snapshot used for this comparison.',
    lowes: 'Retail context is strong; package and cart behavior should be verified on the live page before quoting.',
    soilcalculator: 'Shows bag counts for common package volumes on the public snapshot.',
  },
  {
    criterion: 'Planning transparency',
    bedsoil: 'Visible formula, assumptions, source boundaries, review triggers, and limitations on calculator pages.',
    gardeners: 'Public page includes calculator steps and page context; deeper formula and source-boundary detail should be verified live.',
    almanac: 'Public page positions the tool clearly; deeper methodology should be verified live.',
    lowes: 'Public page explicitly says the calculator is an estimating tool only.',
    soilcalculator: 'Public page emphasizes direct calculator outputs; source-boundary detail should be verified live.',
  },
  {
    criterion: 'Best-fit user',
    bedsoil: 'Gardeners who need a transparent, copyable, multi-step planning path before buying soil or choosing a related calculator.',
    gardeners: 'Gardeners who want an established gardening retailer page with raised-bed and planter calculator modes.',
    almanac: 'Gardeners who want a familiar gardening publisher calculator and simple dimension-based estimate.',
    lowes: 'Shoppers already planning a retail or landscaping purchase through Lowe’s.',
    soilcalculator: 'Users who want a direct standalone soil volume and bag-count calculator.',
  },
];

export const comparisonPages: CompetitorComparisonPage[] = [
  {
    slug: 'best-raised-bed-soil-calculators',
    title: 'Best Raised Bed Soil Calculators Compared in 2026',
    description: 'Compare BedSoil with Gardener’s Supply, Almanac, Lowe’s, and SoilCalculator.com using public feature evidence, fair limitations, and planning-fit guidance.',
    h1: 'Best raised bed soil calculators compared',
    targetKeyword: 'best raised bed soil calculators',
    pageType: 'roundup',
    summary: 'This comparison is for users choosing a soil calculator before buying raised-bed soil, bagged soil, or bulk delivery. It compares visible calculator jobs rather than making unverifiable quality claims.',
    verdict: 'Choose BedSoil when you need one workflow that connects volume, bags, bulk cost, soil mix, containers, depth checks, and a copyable shopping list. Choose a retailer or publisher calculator when brand familiarity or immediate retail context matters more than transparent multi-step planning.',
    competitors: ['gardeners', 'almanac', 'lowes', 'soilcalculator'],
    relatedCalculators: ['raised-bed-soil-calculator', 'soil-bags-calculator', 'bulk-soil-vs-bags-calculator', 'raised-bed-soil-mix-calculator'],
    matrix: standardMatrix,
    bestFor: [
      { label: 'Best all-in-one planning path', text: 'BedSoil, because it connects soil volume, bag count, bulk comparison, mix ratios, top-off, and next-step calculators.' },
      { label: 'Best retailer context', text: 'Lowe’s, when the user wants a store-adjacent estimating tool and plans to shop in that ecosystem.' },
      { label: 'Best gardening-brand familiarity', text: 'Gardener’s Supply or Almanac, when the user prefers a long-running gardening content brand.' },
      { label: 'Best simple calculator-only pattern', text: 'SoilCalculator.com, when the user mainly wants cubic feet, cubic yards, and bags in a dedicated calculator page.' },
    ],
    sourceDisclosure: 'BedSoil is operated by YmirTool. Competitor facts are based on public pages reviewed on 2026-06-07 and should be refreshed quarterly or after major competitor page changes.',
    primaryCta: 'Use BedSoil raised bed calculator',
    primaryCtaHref: '/raised-bed-soil-calculator',
    secondaryCta: 'Compare bags and bulk soil',
    secondaryCtaHref: '/bulk-soil-vs-bags-calculator',
  },
  {
    slug: 'bedsoil-vs-gardeners-supply-soil-calculator',
    title: 'BedSoil vs Gardener’s Supply Soil Calculator 2026',
    description: 'Compare BedSoil and Gardener’s Supply soil calculators by raised-bed output, planter support, bag planning, bulk cost, source notes, and best-fit use cases.',
    h1: 'BedSoil vs Gardener’s Supply soil calculator',
    targetKeyword: 'BedSoil vs Gardener’s Supply soil calculator',
    pageType: 'versus',
    summary: 'Both pages serve raised-bed gardeners. The practical difference is that BedSoil is designed as a multi-step planning workflow, while Gardener’s Supply is a known gardening retailer page with raised bed and planter calculator modes.',
    verdict: 'Use BedSoil when you want editable assumptions, bag conversion, bulk comparison, mix planning, and source-boundary notes in one workflow. Use Gardener’s Supply when you prefer its retailer content ecosystem and its visible raised-bed/planter calculator modes are sufficient.',
    competitors: ['gardeners'],
    relatedCalculators: ['raised-bed-soil-calculator', 'container-soil-calculator', 'soil-bags-calculator'],
    matrix: standardMatrix.map((row) => ({ criterion: row.criterion, bedsoil: row.bedsoil, gardeners: row.gardeners })),
    bestFor: [
      { label: 'BedSoil fit', text: 'A user who wants copy/print/share actions, formula visibility, bag rounding, bulk delivery checks, and related calculators after the first result.' },
      { label: 'Gardener’s Supply fit', text: 'A user who wants a gardening-retailer page with raised bed, pot or elevated planter, and shape choices visible in the public page snapshot.' },
    ],
    sourceDisclosure: 'This page is independent and not affiliated with Gardener’s Supply. Competitor feature statements are limited to public-page evidence reviewed on 2026-06-07.',
    primaryCta: 'Run the BedSoil raised bed preset',
    primaryCtaHref: '/raised-bed-soil-calculator',
    secondaryCta: 'Try container and grow-bag volume',
    secondaryCtaHref: '/container-soil-calculator',
  },
  {
    slug: 'bedsoil-vs-almanac-soil-calculator',
    title: 'BedSoil vs Almanac Soil Calculator Compared 2026',
    description: 'Compare BedSoil and The Old Farmer’s Almanac soil calculator by calculator intent, dimension inputs, bag planning, methodology, and next-step workflow.',
    h1: 'BedSoil vs Almanac soil calculator',
    targetKeyword: 'BedSoil vs Almanac soil calculator',
    pageType: 'versus',
    summary: 'Almanac has strong gardening-brand recognition and a simple raised-bed/container calculator framing. BedSoil is better suited when the user needs the first estimate to continue into bag count, bulk comparison, mix ratio, or planning notes.',
    verdict: 'Use BedSoil for a transparent calculator workflow with bag, bulk, mix, source-boundary, and export actions. Use Almanac when a familiar gardening publisher page and a straightforward soil estimate are enough.',
    competitors: ['almanac'],
    relatedCalculators: ['raised-bed-soil-calculator', 'soil-bags-calculator', 'raised-bed-soil-mix-calculator'],
    matrix: standardMatrix.map((row) => ({ criterion: row.criterion, bedsoil: row.bedsoil, almanac: row.almanac })),
    bestFor: [
      { label: 'BedSoil fit', text: 'A user who wants calculator outputs plus review notes, limitations, bag rounding, and next-step planner links.' },
      { label: 'Almanac fit', text: 'A user who wants a familiar gardening publisher calculator and a direct soil-needed estimate from bed or pot dimensions.' },
    ],
    sourceDisclosure: 'This page is independent and not affiliated with The Old Farmer’s Almanac. Competitor feature statements are limited to public-page evidence reviewed on 2026-06-07.',
    primaryCta: 'Calculate raised bed soil in BedSoil',
    primaryCtaHref: '/raised-bed-soil-calculator',
    secondaryCta: 'Convert the result into bags',
    secondaryCtaHref: '/soil-bags-calculator',
  },
  {
    slug: 'bedsoil-vs-lowes-soil-calculator',
    title: 'BedSoil vs Lowe’s Soil Calculator Compared 2026',
    description: 'Compare BedSoil and Lowe’s mulch and soil calculator by retail context, estimating scope, bag/bulk planning, transparency, and best-fit user intent.',
    h1: 'BedSoil vs Lowe’s soil calculator',
    targetKeyword: 'BedSoil vs Lowe’s soil calculator',
    pageType: 'versus',
    summary: 'Lowe’s is useful when the searcher wants a retail-adjacent mulch or soil estimator. BedSoil is useful when the searcher wants an independent raised-bed planning workflow before deciding whether to buy bags, bulk soil, or mix components.',
    verdict: 'Use BedSoil when you want editable assumptions and a transparent multi-calculator path before shopping. Use Lowe’s when the retail calculator context is the primary reason for the visit.',
    competitors: ['lowes'],
    relatedCalculators: ['bulk-soil-vs-bags-calculator', 'soil-bags-calculator', 'raised-bed-soil-cost-calculator'],
    matrix: standardMatrix.map((row) => ({ criterion: row.criterion, bedsoil: row.bedsoil, lowes: row.lowes })),
    bestFor: [
      { label: 'BedSoil fit', text: 'A user comparing bag count, bulk order minimums, delivery fees, and overbuy before choosing a supplier.' },
      { label: 'Lowe’s fit', text: 'A shopper who wants a mulch or soil estimating tool inside a retail project-planning environment.' },
    ],
    sourceDisclosure: 'This page is independent and not affiliated with Lowe’s. Competitor feature statements are limited to public-page evidence reviewed on 2026-06-07.',
    primaryCta: 'Compare bulk soil and bags in BedSoil',
    primaryCtaHref: '/bulk-soil-vs-bags-calculator',
    secondaryCta: 'Estimate soil bag count',
    secondaryCtaHref: '/soil-bags-calculator',
  },
];

export const competitorPageDefinitions: PageDefinition[] = comparisonPages.map((page) => ({
  slug: page.slug,
  title: page.title,
  description: page.description,
  related: page.relatedCalculators,
  comparison: page.slug,
}));

export function comparisonPageForSlug(slug: string) {
  return comparisonPages.find((page) => page.slug === slug);
}

export function competitorProfilesForPage(page: CompetitorComparisonPage) {
  return page.competitors.map((id) => competitorProfiles[id]);
}
