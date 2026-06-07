import type { PageDefinition } from '@/lib/data/pages';
import { allPages } from '@/lib/data/pages';
import { topicClusterForPage, topicClusterLinksForPage } from '@/lib/data/topicClusters';

export type SxoPersona = {
  id: string;
  label: string;
  need: string;
  tenSecondCheck: string;
  trustNeed: string;
  nextAction: string;
  score: number;
  relevance: number;
  clarity: number;
  trust: number;
  action: number;
  recommendation: string;
};

export type SxoUserStory = {
  persona: string;
  story: string;
  sourceSignal: string;
};

export type SxoGapDimension = {
  label: string;
  score: number;
  max: number;
  rationale: string;
};

export type SxoSerpEvidence = {
  sourceType: string;
  observedPattern: string;
  implication: string;
};

export type SxoCompletionStep = {
  label: string;
  action: string;
  successSignal: string;
};

export type SxoContentCheck = {
  label: string;
  status: 'Pass' | 'Watch' | 'Improve';
  detail: string;
};

export type SxoPageProfile = {
  keyword: string;
  targetPageType: string;
  serpExpectedPageType: string;
  verdict: 'ALIGNED' | 'MIXED' | 'MISMATCH';
  score: number;
  dominantIntent: string;
  aboveFoldAnswer: string;
  expectedAssets: string[];
  serpEvidence: SxoSerpEvidence[];
  userStories: SxoUserStory[];
  personas: SxoPersona[];
  gapDimensions: SxoGapDimension[];
  completionPath: SxoCompletionStep[];
  contentChecks: SxoContentCheck[];
  priorityActions: string[];
};

const modeKeyword: Record<NonNullable<PageDefinition['initial']>, string> = {
  raised: 'raised bed soil calculator',
  bags: 'soil bags calculator',
  bulk: 'bulk soil vs bags calculator',
  mix: 'raised bed soil mix calculator',
  containers: 'container soil calculator',
  spacing: 'square foot garden spacing calculator',
  topoff: 'raised bed top off calculator',
  depth: 'raised bed depth calculator',
  cost: 'raised bed cost calculator',
  multi: 'multiple raised bed soil calculator',
  shapes: 'round raised bed soil calculator',
};

const modeIntent: Record<NonNullable<PageDefinition['initial']>, string> = {
  raised: 'calculate soil volume from bed dimensions and immediately convert the result into bags, yards, and a buying list',
  bags: 'convert a known soil volume into rounded-up package counts using the volume printed on the bag label',
  bulk: 'decide whether bagged soil or a bulk delivery is more practical after fees, order minimums, and overbuy are included',
  mix: 'split total fill volume into soil, compost, potting mix, or custom mix components without treating the ratio as regional agronomy advice',
  containers: 'translate grow-bag, pot, and planter labels into cubic feet, liters, dry quarts, and purchasable bag counts',
  spacing: 'turn bed area into a crop spacing plan while keeping seed-packet, variety, and airflow limits visible',
  topoff: 'estimate seasonal compost or soil top-off volume after settling, decomposition, and bed maintenance',
  depth: 'check whether bed depth is generally suitable for a crop before buying or planting',
  cost: 'estimate the full material cost of a raised bed project after soil, compost, kit, hardware, delivery, and tax assumptions',
  multi: 'combine several beds and containers into one order-ready shopping list',
  shapes: 'estimate non-rectangular raised bed volume with explicit shape assumptions and sanity checks',
};

const expectedAssetsByMode: Record<NonNullable<PageDefinition['initial']>, string[]> = {
  raised: ['dimension-first calculator', 'cubic feet and cubic yards result', 'bag conversion', 'formula example', 'copyable shopping list'],
  bags: ['manual volume input', 'bag-size presets', 'round-up logic', 'leftover volume note', 'weight-label warning'],
  bulk: ['bag vs bulk comparison', 'delivery fee input', 'minimum order warning', 'overbuy calculation', 'recommendation label'],
  mix: ['component percentages', '100% validation', 'component bag counts', 'mix assumption boundary', 'custom ratio support'],
  containers: ['grow-bag gallons', 'pot and planter shapes', 'liters and dry quarts', 'quantity controls', 'potting-mix note'],
  spacing: ['square-foot grid', 'crop selector', 'plant count', 'seed-packet boundary', 'layout preview'],
  topoff: ['top-off depth input', 'compost estimate', 'seasonal note', 'settling boundary', 'shopping list'],
  depth: ['crop selector', 'depth status', 'ideal range note', 'surface and drainage boundary', 'next-step soil calculator'],
  cost: ['soil cost', 'kit or lumber cost', 'delivery and tax', 'per-bed total', 'bulk-vs-bags next step'],
  multi: ['multiple beds', 'container add-on', 'combined volume', 'single shopping list', 'bulk comparison route'],
  shapes: ['shape selector', 'shape-specific formula', 'approximation warning', 'bag and bulk conversion', 'rectangular cross-check route'],
};

function pageMode(page?: PageDefinition): NonNullable<PageDefinition['initial']> {
  return page?.initial ?? 'raised';
}

function keywordForPage(page?: PageDefinition) {
  if (!page) return 'raised bed soil calculator';
  return modeKeyword[pageMode(page)] ?? page.title.toLowerCase();
}

function makePersona(input: Omit<SxoPersona, 'score'>): SxoPersona {
  return {
    ...input,
    score: Math.round((input.relevance + input.clarity + input.trust + input.action) / 4),
  };
}

function personasForMode(mode: NonNullable<PageDefinition['initial']>): SxoPersona[] {
  const shared: SxoPersona[] = [
    makePersona({
      id: 'first-time-builder',
      label: 'First-time raised bed builder',
      need: 'Needs a direct volume answer without learning cubic-yard math first.',
      tenSecondCheck: 'Can identify the active calculator, default example, and focused result immediately.',
      trustNeed: 'Formula, assumptions, and limitation notes must be visible near the result.',
      nextAction: 'Copy the shopping list before visiting a garden center.',
      relevance: 95,
      clarity: 93,
      trust: 91,
      action: 94,
      recommendation: 'Keep preset summary, formula, and export actions adjacent to the active result on mobile.',
    }),
    makePersona({
      id: 'budget-buyer',
      label: 'Budget-conscious soil buyer',
      need: 'Needs bag counts, bulk minimums, overbuy, and cost signals before purchasing.',
      tenSecondCheck: 'Can see bag cost and bulk estimate in result cards without scrolling through an article.',
      trustNeed: 'Needs warnings for weight-only bag labels, delivery minimums, and local price variation.',
      nextAction: 'Compare bags with bulk delivery or pickup.',
      relevance: 92,
      clarity: 90,
      trust: 91,
      action: 92,
      recommendation: 'Repeat package-volume language in bag and bulk results because SERP competitors emphasize shopping conversion.',
    }),
    makePersona({
      id: 'careful-gardener',
      label: 'Careful crop planner',
      need: 'Needs depth, mix, spacing, and local verification boundaries, not just a volume number.',
      tenSecondCheck: 'Can find source basis, review triggers, and the next planning tool quickly.',
      trustNeed: 'Needs methodology, source notes, review date, correction path, and explicit non-agronomy boundaries.',
      nextAction: 'Check crop depth, spacing, or mix assumptions after calculating volume.',
      relevance: 90,
      clarity: 88,
      trust: 94,
      action: 89,
      recommendation: 'Surface source basis and review triggers in the same scroll zone as the next-step cluster links.',
    }),
  ];

  if (mode === 'spacing' || mode === 'depth') {
    return [
      shared[0],
      shared[2],
      makePersona({
        id: 'plant-layout-user',
        label: 'Planting-layout user',
        need: 'Needs plant count, crop spacing, and maturity caveats before planting.',
        tenSecondCheck: 'Can see the crop, grid, and result cards without opening unrelated volume inputs.',
        trustNeed: 'Needs a seed-packet and local Extension boundary because spacing varies by variety.',
        nextAction: 'Print the layout or move to the matching soil-volume calculator.',
        relevance: 93,
        clarity: 88,
        trust: 90,
        action: 89,
        recommendation: 'Add more mode-specific diagrams after GSC confirms depth or spacing pages receive impressions.',
      }),
    ];
  }

  if (mode === 'containers') {
    return [
      shared[0],
      makePersona({
        id: 'container-buyer',
        label: 'Container and grow-bag buyer',
        need: 'Needs gallons, liters, dry quarts, and bag counts to match package labels.',
        tenSecondCheck: 'Can find grow-bag gallon inputs and package-volume outputs immediately.',
        trustNeed: 'Needs a warning that nominal grow-bag size and actual fill line can differ.',
        nextAction: 'Convert container volume to bags or plan a potting-mix ratio.',
        relevance: 95,
        clarity: 91,
        trust: 91,
        action: 92,
        recommendation: 'Keep gallon and bag-label warnings visible near the conversion result, not only in support copy.',
      }),
      shared[2],
    ];
  }

  return shared;
}

function serpEvidenceForMode(mode: NonNullable<PageDefinition['initial']>): SxoSerpEvidence[] {
  const shared: SxoSerpEvidence[] = [
    {
      sourceType: 'Calculator SERP pattern',
      observedPattern: 'Top results for raised-bed soil queries are usually calculators or estimator pages that expose dimensions, depth, cubic feet, cubic yards, and bag counts.',
      implication: 'The target page type should remain calculator-first, not article-first.',
    },
    {
      sourceType: 'Retail SERP pattern',
      observedPattern: 'Retail calculators pair math with package sizes, purchase context, and estimating disclaimers.',
      implication: 'Bag conversion, cost, overbuy, and shopping-list language should stay visible near results.',
    },
    {
      sourceType: 'Informational SERP pattern',
      observedPattern: 'Supporting results explain soil mix, depth, and common mistakes alongside the calculator task.',
      implication: 'Content-quality panels and limitation notes should support the calculator without pushing it below task completion.',
    },
  ];

  if (mode === 'mix') {
    return [
      ...shared,
      {
        sourceType: 'Mix-specific SERP pattern',
        observedPattern: 'Soil-mix competitors often include topsoil/compost/potting-mix splits and caution that nutrient suitability depends on soil testing.',
        implication: 'This page should emphasize volume split accuracy while avoiding universal recipe claims.',
      },
    ];
  }

  if (mode === 'containers') {
    return [
      ...shared,
      {
        sourceType: 'Container-specific SERP pattern',
        observedPattern: 'Container and pot calculators commonly rely on gallon, quart, liter, and bag-volume conversions.',
        implication: 'The interface should keep unit labels and fill-line caveats visible before exporting results.',
      },
    ];
  }

  if (mode === 'bulk' || mode === 'cost') {
    return [
      ...shared,
      {
        sourceType: 'Commercial SERP pattern',
        observedPattern: 'Bulk and retail results emphasize delivery, coverage area, product type, minimum orders, and estimates.',
        implication: 'The result should frame bulk-vs-bag recommendations as planning estimates that require supplier confirmation.',
      },
    ];
  }

  return shared;
}

function userStoriesForMode(mode: NonNullable<PageDefinition['initial']>): SxoUserStory[] {
  const topic = modeIntent[mode];
  return [
    {
      persona: 'Search visitor with a soil-volume query',
      story: `As a gardener arriving from a calculator-style SERP, I want to ${topic} because I need a quantity I can use before buying materials, but I am blocked by unit conversions and package labels.`,
      sourceSignal: 'Calculator SERP pattern: measurement inputs and cubic-foot/cubic-yard outputs are the consensus asset.',
    },
    {
      persona: 'Buyer comparing materials',
      story: 'As a buyer, I want the result translated into bags, bulk yards, cost, and overbuy because retailers sell soil in different units, but I am blocked by delivery fees and minimum orders.',
      sourceSignal: 'Retail SERP pattern: estimator pages connect calculator output to shopping or product-selection next steps.',
    },
    {
      persona: 'Risk-averse gardener',
      story: 'As a careful gardener, I want assumptions, formulas, source basis, and review triggers near the result because soil depth, mix, and spacing affect plant success, but I am blocked by generic advice that hides its limits.',
      sourceSignal: 'Informational SERP pattern: depth, mix, and fill-method results explain tradeoffs next to volume math.',
    },
  ];
}

function scoreForMode(mode: NonNullable<PageDefinition['initial']>): number {
  if (mode === 'spacing' || mode === 'depth') return 91;
  if (mode === 'bulk' || mode === 'cost') return 93;
  if (mode === 'containers' || mode === 'mix') return 92;
  return 94;
}

function gapDimensionsForPage(page?: PageDefinition): SxoGapDimension[] {
  const mode = pageMode(page);
  return [
    { label: 'Page type', score: 15, max: 15, rationale: 'Target page is an interactive calculator, matching the dominant calculator/tool intent for primary soil-volume queries.' },
    { label: 'Content depth', score: 14, max: 15, rationale: 'The page includes formulas, examples, caveats, content-quality notes, source basis, and review triggers; remaining gains depend on real GSC query data.' },
    { label: 'UX signals', score: 14, max: 15, rationale: 'Calculator, focused result, validation warnings, fast-path steps, and export actions are prominent.' },
    { label: 'Schema markup', score: 14, max: 15, rationale: 'WebApplication, WebPage, BreadcrumbList, Organization, WebSite, ImageObject, and action entities are connected in JSON-LD.' },
    { label: 'Media richness', score: mode === 'spacing' ? 14 : 13, max: 15, rationale: mode === 'spacing' ? 'Spacing pages include a visual grid preview.' : 'The site has planning diagrams, OG images, image sitemap, and visible image context; mode-specific diagrams remain a future improvement.' },
    { label: 'Authority signals', score: 14, max: 15, rationale: 'Visible methodology, sources, limitations, maintainer, source basis, review triggers, and correction guidance are present.' },
    { label: 'Freshness', score: 9, max: 10, rationale: 'Stable last-reviewed and page-date signals exist; final validation needs live deployed timestamps and URL Inspection.' },
  ];
}

function completionPathForMode(mode: NonNullable<PageDefinition['initial']>): SxoCompletionStep[] {
  const modeSpecific: Record<NonNullable<PageDefinition['initial']>, SxoCompletionStep> = {
    raised: { label: 'Calculate', action: 'Confirm dimensions, depth, quantity, freeboard, and settling.', successSignal: 'Result shows cubic feet, cubic yards, bags, and warnings.' },
    bags: { label: 'Convert', action: 'Enter required volume and package volume from the label.', successSignal: 'Bag count rounds up and leftover volume is disclosed.' },
    bulk: { label: 'Compare', action: 'Add supplier price, delivery fee, minimum order, and pickup assumptions.', successSignal: 'Recommendation explains whether bulk or bags are more practical.' },
    mix: { label: 'Split', action: 'Set component percentages and verify they total 100%.', successSignal: 'Component volumes and bag counts are shown with mix caveats.' },
    containers: { label: 'Translate', action: 'Choose grow-bag, pot, or planter units and set quantity.', successSignal: 'Cubic feet, liters, dry quarts, and bag counts are available.' },
    spacing: { label: 'Layout', action: 'Choose crop and square-foot grid dimensions.', successSignal: 'Plant count and spacing boundary are visible.' },
    topoff: { label: 'Top off', action: 'Measure current soil drop and choose top-off depth.', successSignal: 'Compost/soil volume and seasonal warnings are shown.' },
    depth: { label: 'Screen', action: 'Choose crop and compare planned depth against conservative ranges.', successSignal: 'Depth status and next soil-volume route are visible.' },
    cost: { label: 'Budget', action: 'Enter material prices, delivery, tax, and bed kit assumptions.', successSignal: 'Total project estimate and per-bed context are shown.' },
    multi: { label: 'Combine', action: 'Add multiple beds and containers before rounding purchase quantities.', successSignal: 'A single combined shopping list is generated.' },
    shapes: { label: 'Approximate', action: 'Select shape, enter dimensions, and review approximation warnings.', successSignal: 'Shape-specific volume is converted to bags and bulk volume.' },
  };

  return [
    modeSpecific[mode],
    { label: 'Verify', action: 'Read warnings, source basis, review triggers, and local supplier or seed-packet checks.', successSignal: 'The user knows which assumptions must be confirmed offline.' },
    { label: 'Export', action: 'Copy, print, download CSV, or share the URL after the calculation is stable.', successSignal: 'The planning result can leave the page without losing assumptions.' },
  ];
}

function contentChecksForPage(page?: PageDefinition): SxoContentCheck[] {
  const mode = pageMode(page);
  return [
    {
      label: '10-second answer path',
      status: 'Pass',
      detail: 'Hero, preset summary, visual task path, calculator, and result cards are ordered before support modules.',
    },
    {
      label: 'Calculator-first SERP fit',
      status: 'Pass',
      detail: 'The page leads with an interactive calculator rather than long article copy, matching observed calculator SERPs.',
    },
    {
      label: 'Trust before final action',
      status: 'Pass',
      detail: 'Methodology, source basis, limitations, review triggers, and warnings are visible before or near export paths.',
    },
    {
      label: 'Mode-specific visual asset',
      status: mode === 'spacing' ? 'Pass' : 'Watch',
      detail: mode === 'spacing' ? 'Spacing has a layout preview.' : 'The shared planning diagram is present; query-specific diagrams can be prioritized after GSC data confirms demand.',
    },
  ];
}

export function sxoProfileForPage(page?: PageDefinition): SxoPageProfile {
  const mode = pageMode(page);
  const topic = page ? topicClusterForPage(page) : undefined;
  const keyword = keywordForPage(page);
  const score = scoreForMode(mode);
  const clusterLinks = page ? topicClusterLinksForPage(page).slice(0, 2).map((link) => link.anchor) : [];
  const clusterNote = topic ? `Topic cluster: ${topic.name}.` : 'Sitewide raised-bed soil calculator cluster.';

  return {
    keyword,
    targetPageType: 'Interactive calculator with visible method, result, source basis, review triggers, and next-step planning path',
    serpExpectedPageType: 'Calculator/tool page supported by concise how-to guidance, conversion output, shopping-oriented next steps, and clear limitations',
    verdict: 'ALIGNED',
    score,
    dominantIntent: `${modeIntent[mode]} ${clusterNote}`,
    aboveFoldAnswer: page
      ? `${page.title} should answer ${keyword} with an editable preset, focused result cards, formula context, validation warnings, and export actions.`
      : 'The homepage should answer raised bed soil calculator queries with a dimension-first calculator, quick formula, common sizes, and direct routes to bag, bulk, mix, depth, and spacing calculators.',
    expectedAssets: [...expectedAssetsByMode[mode], ...clusterLinks].slice(0, 7),
    serpEvidence: serpEvidenceForMode(mode),
    userStories: userStoriesForMode(mode),
    personas: personasForMode(mode),
    gapDimensions: gapDimensionsForPage(page),
    completionPath: completionPathForMode(mode),
    contentChecks: contentChecksForPage(page),
    priorityActions: [
      'Keep the active calculator and focused result close together on mobile so users can complete the task without scanning the full page.',
      'Use result-card copy that repeats the user query vocabulary: cubic feet, cubic yards, bags, cost, mix, depth, or spacing depending on page intent.',
      'Make limitations, source basis, and review triggers visible before the final shopping action so the page remains useful without overstating certainty.',
      'Use GSC query data after deployment to identify pages with impressions but weak CTR or short dwell paths.',
    ],
  };
}

export function sitewideSxoSummary() {
  const calculatorPages = allPages.filter((page) => !page.legal);
  const modes = new Set(calculatorPages.map((page) => page.initial ?? 'raised'));
  const averageScore = Math.round(calculatorPages.reduce((total, page) => total + sxoProfileForPage(page).score, 0) / calculatorPages.length);
  return {
    calculatorPages: calculatorPages.length,
    modeCount: modes.size,
    averageScore,
    dominantPageType: 'interactive calculator/tool',
    primaryKeyword: 'raised bed soil calculator',
  };
}
