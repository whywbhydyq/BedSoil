import type { PageDefinition } from '@/lib/data/pages';
import { allPages } from '@/lib/data/pages';
import { COMPETITOR_REVIEW_DATE, comparisonPageForSlug } from '@/lib/data/competitorPages';
import { topicClusterForPage, topicClusterLinksForPage } from '@/lib/data/topicClusters';

export type FlowStageId = 'find' | 'leverage' | 'optimize' | 'win';

export type FlowStage = {
  id: FlowStageId;
  label: string;
  shortLabel: string;
  goal: string;
  siteAction: string;
  evidence: string;
};

export type FlowNextStep = {
  label: string;
  href: string;
  reason: string;
};

export type PageFlow = {
  routeType: 'sitewide' | 'calculator' | 'comparison';
  landingIntent: string;
  primaryAction: string;
  expectedResult: string;
  completionAction: string;
  nextSteps: FlowNextStep[];
  measurementSignals: string[];
  frictionChecks: string[];
  evidenceNotes: string[];
  selectedPrompts: { stage: FlowStageId; name: string; reason: string }[];
};

const pageBySlug = new Map(allPages.map((page) => [page.slug, page]));

export const FLOW_STAGES: FlowStage[] = [
  {
    id: 'find',
    label: 'Find demand and intent',
    shortLabel: 'Find',
    goal: 'Match the entry query to a calculator, comparison, or planning task with a visible answer path.',
    siteAction: 'Surface the page purpose, preset or comparison scope, evidence boundary, and related cluster path before asking the user to act.',
    evidence: 'Page title, H1, quick answer, preset summary or comparison disclosure, and cluster links all describe the same task.',
  },
  {
    id: 'leverage',
    label: 'Leverage trust and corroboration',
    shortLabel: 'Leverage',
    goal: 'Show why the page can be used as a planning estimate or fair comparison without overstating certainty.',
    siteAction: 'Expose formulas, public-source boundaries, methodology, review notes, limitations, and correction paths near the task.',
    evidence: 'Visible methodology, source cards, comparison disclosures, limitations, and review metadata support the page claim.',
  },
  {
    id: 'optimize',
    label: 'Optimize extraction and completion',
    shortLabel: 'Optimize',
    goal: 'Move from search intent to result or next calculator with minimum friction and a clear exportable or clickable outcome.',
    siteAction: 'Keep the calculator, comparison matrix, focused answer, and completion CTA close to the primary task.',
    evidence: 'Result cards, validation warnings, feature matrix, assumptions, and export/CTA buttons are available without account creation.',
  },
  {
    id: 'win',
    label: 'Win the next planning step',
    shortLabel: 'Win',
    goal: 'Convert a solved calculation or comparison decision into the next useful garden-planning action instead of ending the session.',
    siteAction: 'Route the user to bag conversion, bulk comparison, mix planning, planting spacing, depth checks, top-off maintenance, or the chosen calculator path.',
    evidence: 'Related calculators, topic-cluster links, comparison CTAs, and completion CTAs keep the next task explicit.',
  },
];

const nextStepsByMode: Record<NonNullable<PageDefinition['initial']>, FlowNextStep[]> = {
  raised: [
    { label: 'Convert volume to soil bags', href: '/soil-bags-calculator', reason: 'Use the calculated cubic feet with package volume labels.' },
    { label: 'Compare bulk soil vs bags', href: '/bulk-soil-vs-bags-calculator', reason: 'Check whether delivery minimums make bulk soil practical.' },
    { label: 'Split the volume into a soil mix', href: '/raised-bed-soil-mix-calculator', reason: 'Turn total volume into topsoil, compost, and potting-mix amounts.' },
  ],
  bags: [
    { label: 'Compare with bulk soil', href: '/bulk-soil-vs-bags-calculator', reason: 'Use the bag estimate as the cost baseline.' },
    { label: 'Check 4×8 depth presets', href: '/4x8-raised-bed-soil-calculator', reason: 'Verify whether the volume assumption came from the right bed depth.' },
    { label: 'Plan the soil mix', href: '/raised-bed-soil-mix-calculator', reason: 'Break bag quantities into material components.' },
  ],
  bulk: [
    { label: 'Check bag fallback', href: '/soil-bags-calculator', reason: 'Compare delivery costs against a rounded-up bag count.' },
    { label: 'Plan mix components', href: '/raised-bed-soil-mix-calculator', reason: 'Translate delivered volume into component ratios.' },
    { label: 'Estimate total project cost', href: '/raised-bed-cost-calculator', reason: 'Add bed kit, compost, mulch, hardware, and tax assumptions.' },
  ],
  mix: [
    { label: 'Convert component volume to bags', href: '/soil-bags-calculator', reason: 'Buy materials using package volume labels instead of percentages only.' },
    { label: 'Compare bulk and bags', href: '/bulk-soil-vs-bags-calculator', reason: 'Check whether buying components in bulk changes the order.' },
    { label: 'Review seasonal top-off', href: '/annual-raised-bed-top-off-calculator', reason: 'Plan future compost additions after the first fill settles.' },
  ],
  containers: [
    { label: 'Convert container volume to bags', href: '/soil-bags-calculator', reason: 'Turn gallons, liters, or pot dimensions into package counts.' },
    { label: 'Check grow bag assumptions', href: '/grow-bag-soil-calculator', reason: 'Use gallon-labeled grow bags when dimensions are not reliable.' },
    { label: 'Plan potting-mix components', href: '/raised-bed-soil-mix-calculator', reason: 'Keep container mix distinct from dense garden soil assumptions.' },
  ],
  spacing: [
    { label: 'Check crop depth before planting', href: '/raised-bed-depth-calculator', reason: 'Plant count should be paired with root-depth suitability.' },
    { label: 'Calculate soil for this bed', href: '/raised-bed-soil-calculator', reason: 'Match the planting layout with enough fill volume.' },
    { label: 'Use the 4×8 layout guide', href: '/4x8-raised-bed-planting-layout', reason: 'Translate square-foot count into a common raised-bed plan.' },
  ],
  topoff: [
    { label: 'Plan compost amount', href: '/compost-topsoil-mix-calculator', reason: 'Top-off material often uses compost or a compost-heavy blend.' },
    { label: 'Recheck bed depth', href: '/raised-bed-depth-calculator', reason: 'Confirm the topped-off bed still supports the intended crop.' },
    { label: 'Run spring checklist', href: '/spring-raised-bed-checklist', reason: 'Pair measured top-off volume with seasonal prep checks.' },
  ],
  depth: [
    { label: 'Calculate soil volume', href: '/raised-bed-soil-calculator', reason: 'If the depth is suitable, convert it into cubic feet and bags.' },
    { label: 'Plan square-foot spacing', href: '/square-foot-garden-spacing-calculator', reason: 'Combine depth suitability with plant count planning.' },
    { label: 'Use tomato depth guide', href: '/raised-bed-depth-for-tomatoes', reason: 'Review a high-demand crop-specific depth example.' },
  ],
  cost: [
    { label: 'Compare bulk and bags', href: '/bulk-soil-vs-bags-calculator', reason: 'Soil purchase method usually drives the largest variable cost.' },
    { label: 'Estimate soil bags', href: '/soil-bags-calculator', reason: 'Convert volume into a purchasable bag count before pricing.' },
    { label: 'Check cheapest fill method', href: '/cheapest-way-to-fill-raised-beds', reason: 'Review tradeoffs before using low-cost fill strategies.' },
  ],
  multi: [
    { label: 'Convert combined volume to bags', href: '/soil-bags-calculator', reason: 'Use one shopping list for all beds and containers.' },
    { label: 'Compare bulk delivery', href: '/bulk-soil-vs-bags-calculator', reason: 'Larger combined volumes are more likely to justify bulk delivery.' },
    { label: 'Estimate project cost', href: '/raised-bed-cost-estimator', reason: 'Add materials and taxes after combining the project volume.' },
  ],
  shapes: [
    { label: 'Convert shape volume to bags', href: '/soil-bags-calculator', reason: 'Non-rectangular results still need rounded-up package counts.' },
    { label: 'Compare bulk delivery', href: '/bulk-soil-vs-bags-calculator', reason: 'Large round, L-shaped, or U-shaped beds may exceed bag-friendly volume.' },
    { label: 'Check general raised-bed formula', href: '/raised-bed-soil-calculator', reason: 'Use a rectangular approximation if the shape estimate needs a sanity check.' },
  ],
};

const defaultNextSteps: FlowNextStep[] = [
  { label: 'Use the main calculator', href: '/raised-bed-soil-calculator', reason: 'Start from editable bed dimensions and a visible result.' },
  { label: 'Convert to soil bags', href: '/soil-bags-calculator', reason: 'Translate volume into purchasable package counts.' },
  { label: 'Compare bulk and bags', href: '/bulk-soil-vs-bags-calculator', reason: 'Check the buying path before ordering materials.' },
];

function existingSteps(steps: FlowNextStep[]): FlowNextStep[] {
  return steps.filter((step) => {
    const slug = step.href.replace(/^\//, '');
    return slug === '' || pageBySlug.has(slug);
  });
}

function dedupeSteps(steps: FlowNextStep[]): FlowNextStep[] {
  const seen = new Set<string>();
  return steps.filter((step) => {
    if (seen.has(step.href)) return false;
    seen.add(step.href);
    return true;
  });
}

function comparisonNextSteps(page: PageDefinition): FlowNextStep[] {
  const comparison = page.comparison ? comparisonPageForSlug(page.comparison) : undefined;
  if (!comparison) return defaultNextSteps;
  const steps: FlowNextStep[] = [
    { label: comparison.primaryCta, href: comparison.primaryCtaHref, reason: 'Primary post-comparison action for users who choose the BedSoil workflow.' },
    ...(comparison.secondaryCta && comparison.secondaryCtaHref ? [{ label: comparison.secondaryCta, href: comparison.secondaryCtaHref, reason: 'Secondary path for users comparing bag, bulk, or container planning after reading the matrix.' }] : []),
    ...comparison.relatedCalculators.map((slug) => ({ label: pageBySlug.get(slug)?.title ?? slug, href: `/${slug}`, reason: 'Related calculator linked from this comparison page.' })),
  ];
  return existingSteps(dedupeSteps(steps)).slice(0, 4);
}

export function flowNextStepsForMode(mode?: PageDefinition['initial']): FlowNextStep[] {
  if (!mode) return defaultNextSteps;
  return existingSteps(nextStepsByMode[mode]).slice(0, 3);
}

function selectedPromptsForPage(page?: PageDefinition): PageFlow['selectedPrompts'] {
  if (page?.comparison) {
    return [
      { stage: 'find', name: 'SERP intent mapping', reason: 'Comparison pages need to validate whether the query expects alternatives, versus framing, or a direct calculator.' },
      { stage: 'leverage', name: 'Authority and evidence gap review', reason: 'Competitor claims must stay tied to public sources and review dates.' },
      { stage: 'win', name: 'Conversion path scorecard', reason: 'The page should route users from comparison reading into a concrete calculator action.' },
    ];
  }
  if (page) {
    return [
      { stage: 'find', name: 'Query-to-task fit', reason: 'Calculator pages need the preset, H1, quick answer, and formula to match the search task.' },
      { stage: 'optimize', name: 'On-page completion path', reason: 'Users should reach a result, warning state, and export action without account friction.' },
      { stage: 'win', name: 'Next-step routing', reason: 'Solved calculations should send users to the adjacent bag, bulk, mix, depth, or spacing task.' },
    ];
  }
  return [
    { stage: 'find', name: 'Topic opportunity overview', reason: 'The homepage needs to route broad soil-calculator demand into the correct task cluster.' },
    { stage: 'optimize', name: 'Landing page task clarity', reason: 'The calculator CTA and default example should be visible before supporting content.' },
    { stage: 'win', name: 'Cluster navigation', reason: 'Homepage traffic should move into calculator, comparison, or planning spokes.' },
  ];
}

export function flowForPage(page?: PageDefinition): PageFlow {
  if (page?.comparison) {
    const comparison = comparisonPageForSlug(page.comparison);
    const competitorCount = comparison?.competitors.length ?? 0;
    const ctaLabel = comparison?.primaryCta ?? 'Use BedSoil calculator';
    return {
      routeType: 'comparison',
      landingIntent: comparison
        ? `Help a user evaluating “${comparison.targetKeyword}” compare public calculator capabilities before choosing a planning workflow.`
        : `Help a user evaluate ${page.title} before choosing a calculator path.`,
      primaryAction: 'Read the fair-use disclosure, compare visible feature evidence, and choose the calculator path that matches the project need.',
      expectedResult: `${competitorCount + 1} calculator options are framed with verified limits, best-fit use cases, and BedSoil next-step links.`,
      completionAction: `${ctaLabel}, then calculate volume, bags, bulk cost, or mix assumptions in the selected BedSoil workflow.`,
      nextSteps: comparisonNextSteps(page),
      measurementSignals: [
        'Primary and secondary comparison CTA clicks indicate decision completion.',
        'Related calculator clicks indicate whether the comparison page created a useful next planning task.',
        'External source clicks indicate competitor verification behavior, not endorsement.',
      ],
      frictionChecks: [
        `Competitor review date is visible: ${COMPETITOR_REVIEW_DATE}.`,
        'Unknown competitor features remain marked as not publicly verified rather than guessed.',
        'Comparison pages avoid ratings, prices, or partnership claims that are not visible in source evidence.',
      ],
      evidenceNotes: [
        'Uses public competitor page snapshots and visible BedSoil functionality only.',
        'Comparison page schema uses CollectionPage and ItemList, not Review, Product, or AggregateRating.',
        'All next-step calculator links are internal and validated against the route registry.',
      ],
      selectedPrompts: selectedPromptsForPage(page),
    };
  }

  const mode = page?.initial;
  const cluster = page ? topicClusterForPage(page) : undefined;
  const clusterLinks = page ? topicClusterLinksForPage(page, 4) : [];
  const pageTitle = page?.title ?? 'Raised Bed Soil Calculator';
  const clusterSignal = cluster ? `Belongs to the ${cluster.name} cluster, with ${clusterLinks.length} nearby hub/spoke routes.` : 'Uses the homepage calculator and sitewide cluster map.';

  return {
    routeType: page ? 'calculator' : 'sitewide',
    landingIntent: page ? `Answer the query behind “${pageTitle}” with an editable calculator preset and visible formula.` : 'Route broad raised-bed soil queries into volume, bag, bulk, mix, container, spacing, depth, comparison, and maintenance paths.',
    primaryAction: mode === 'spacing'
      ? 'Choose a crop and grid size, then verify spacing and depth before planting.'
      : mode === 'depth'
        ? 'Choose a crop and bed depth, then check whether the depth is good, borderline, or shallow.'
        : mode === 'topoff'
          ? 'Measure current soil drop, choose top-off depth, and estimate compost or soil quantity.'
          : 'Enter or adjust dimensions, bag labels, price, and settling assumptions, then review the focused result.',
    expectedResult: mode === 'spacing'
      ? 'Plant count, square-foot grid, spacing caveats, and printable planning output.'
      : mode === 'depth'
        ? 'Depth suitability status, source-boundary notes, and next-step calculator links.'
        : 'Cubic feet, cubic yards, liters, bag count, cost signal, mix rows, warnings, and a copyable shopping list.',
    completionAction: 'Copy, print, download, or share the result before purchasing materials or planting.',
    nextSteps: flowNextStepsForMode(mode),
    measurementSignals: [
      'Calculator tab change events indicate whether the page matched the search intent.',
      'Copy, print, CSV, PNG, PDF, and share URL events indicate successful completion.',
      'Next-step link clicks indicate whether cluster routing created a second useful task.',
    ],
    frictionChecks: [
      clusterSignal,
      'Primary result appears before secondary explanations in the result panel.',
      'Warnings and validation messages stay attached to the output instead of hidden in policy text.',
    ],
    evidenceNotes: [
      'The calculator formula, quick answer, methodology, and source-boundary notes are visible on the page.',
      'Next-step routes point only to existing internal URLs.',
      'The result panel exposes copy, print, CSV, PNG, PDF, and share paths without requiring login.',
    ],
    selectedPrompts: selectedPromptsForPage(page),
  };
}

export function sitewideFlowSummary() {
  const calculatorCount = allPages.filter((page) => !page.legal && !page.comparison).length;
  const legalCount = allPages.filter((page) => page.legal).length;
  const comparisonCount = allPages.filter((page) => page.comparison).length;
  const comparisonRoutes = allPages.filter((page) => page.comparison).reduce((total, page) => total + comparisonNextSteps(page).length, 0);
  return {
    calculatorCount,
    legalCount,
    comparisonCount,
    stages: FLOW_STAGES.length,
    nextStepRoutes: Object.values(nextStepsByMode).reduce((total, steps) => total + existingSteps(steps).length, 0) + comparisonRoutes,
  };
}
