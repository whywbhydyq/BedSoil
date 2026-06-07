import type { PageDefinition } from '@/lib/data/pages';
import { FOUR_BY_EIGHT_OUTPUTS, fourByEightDepthOutputsForSlug } from '@/lib/data/pageContent';
import { DEFAULT_LAST_MODIFIED } from '@/lib/seo/pageDates';

export type ContentQualityBrief = {
  quickAnswer: string;
  bestFor: string;
  notFor: string;
  verify: string[];
  sourceBasis: string[];
  reviewTriggers: string[];
  citationFacts: string[];
  editorialNote: string;
};

const modeLabels: Record<NonNullable<PageDefinition['initial']>, string> = {
  raised: 'raised-bed soil volume planning',
  bags: 'soil bag-count conversion',
  bulk: 'bulk soil versus bagged soil comparison',
  mix: 'raised-bed soil mix ratio planning',
  containers: 'container and grow-bag media planning',
  spacing: 'square-foot planting layout planning',
  topoff: 'seasonal top-off volume planning',
  depth: 'crop depth suitability screening',
  cost: 'project budget planning',
  multi: 'multi-bed and multi-container estimating',
  shapes: 'non-rectangular bed volume estimating',
};

function depthFromSlug(slug: string) {
  const match = slug.match(/4x8-raised-bed-(6|8|10|12|18|24)-inches-soil/);
  return match ? Number(match[1]) : undefined;
}

function sizeFromTitle(title: string) {
  return title.match(/\d+×\d+/)?.[0];
}

function volumeFromDepth(depthInches: number) {
  return FOUR_BY_EIGHT_OUTPUTS.find((row) => row.depthInches === depthInches);
}

function cropFromSlug(slug: string) {
  if (slug.includes('tomato')) return 'tomatoes';
  if (slug.includes('carrot')) return 'carrots';
  if (slug.includes('radish')) return 'radishes';
  if (slug.includes('lettuce')) return 'lettuce';
  if (slug.includes('pepper')) return 'peppers';
  return undefined;
}

function containerFromSlug(slug: string) {
  if (slug.includes('10-gallon-grow-bag')) return '10 gallon grow bags';
  if (slug.includes('20-gallon-grow-bag')) return '20 gallon grow bags';
  if (slug.includes('5-gallon-bucket')) return '5 gallon buckets';
  if (slug.includes('six-inch-pots')) return 'six inch pots';
  if (slug.includes('grow-bag')) return 'grow bags';
  if (slug.includes('container') || slug.includes('planter')) return 'containers';
  return undefined;
}

function quickAnswerForPage(page: PageDefinition) {
  const depth = depthFromSlug(page.slug);
  const depthOutput = depth ? volumeFromDepth(depth) : undefined;
  if (depthOutput) {
    return `A 4×8 raised bed filled ${depth} inches deep needs ${depthOutput.baseFt3.toFixed(2)} ft³ before settling. With the default 10% settling allowance, plan for ${depthOutput.finalFt3.toFixed(2)} ft³, or ${depthOutput.twoFtBags} two-cubic-foot bags.`;
  }

  const fourByEight = fourByEightDepthOutputsForSlug(page.slug);
  if (fourByEight.length > 1) {
    return 'A 4×8 raised bed contains 32 square feet of surface area. Soil volume changes by depth: 6 inches is 16 ft³ before settling, 12 inches is 32 ft³, and 24 inches is 64 ft³.';
  }

  const crop = cropFromSlug(page.slug);
  if (crop) {
    return `${page.title} uses conservative planning assumptions for ${crop}. Use the calculator result as a layout or depth screen, then verify the variety, support method, irrigation, and local growing guidance before planting.`;
  }

  const container = containerFromSlug(page.slug);
  if (container) {
    return `${page.title} converts ${container} into cubic feet, liters, dry quarts, and bag counts. Treat the answer as a purchase estimate because real fill changes with shape, folds, drainage space, compaction, and fill line.`;
  }

  switch (page.initial) {
    case 'bags':
      return 'To estimate bags, divide required cubic feet by the cubic feet per bag, then round up. Use package volume labels, not weight-only labels, because moisture and density change soil weight.';
    case 'bulk':
      return 'Bulk soil can be cheaper for larger projects, but the better choice depends on cubic-yard price, delivery fees, pickup costs, minimum order size, and the value of any overbuy volume.';
    case 'mix':
      return 'A mix calculator splits total volume by percentage. It can plan topsoil, compost, potting mix, and soilless components, but it does not replace a soil test or local mix recommendation.';
    case 'spacing':
      return 'Square-foot spacing estimates convert bed area into one-foot cells and crop counts. Use the output as a layout draft, not as a guaranteed yield or final spacing plan.';
    case 'depth':
      return 'Depth suitability compares your bed depth with conservative crop-depth ranges. Hard surfaces below the bed make planned depth more important than beds placed over loose native soil.';
    case 'topoff':
      return 'Top-off volume is the bed surface area multiplied by the measured soil drop. Measure the current gap below the rim before buying compost, soil, or mulch.';
    case 'cost':
      return 'Cost estimates combine volume, material unit price, delivery or pickup costs, and related bed inputs. Use one consistent volume unit before comparing suppliers.';
    case 'multi':
      return 'Multi-bed estimating adds each bed or container before rounding the final purchase quantity. Combine volumes first, then round bags once to avoid unnecessary overbuy.';
    case 'shapes':
      return 'Non-rectangular bed volume is estimated by decomposing the shape into simpler sections, applying one depth, then adding the sections before rounding bag count.';
    default:
      return `${page.title} estimates soil volume from editable dimensions, depth, quantity, freeboard, and settling assumptions, then converts the result into bags, bulk volume, and a copyable shopping list.`;
  }
}

function bestForForPage(page: PageDefinition) {
  const mode = page.initial ? modeLabels[page.initial] : 'raised-bed planning';
  const size = sizeFromTitle(page.title);
  if (size) return `Best for gardeners who already know they are planning a ${size} bed and need a fast soil, bag, or bulk estimate before buying materials.`;
  if (page.slug.includes('how-much')) return 'Best for answering one exact shopping question first, then adjusting assumptions in the calculator if the bed, bag, or supplier differs.';
  return `Best for ${mode} when you want a transparent formula, editable assumptions, and a copyable result instead of a fixed blog answer.`;
}

function notForForPage(page: PageDefinition) {
  if (page.initial === 'depth' || cropFromSlug(page.slug)) return 'Not a substitute for local Extension guidance, soil testing, seed-packet spacing, cultivar recommendations, or site-specific agronomy advice.';
  if (page.initial === 'mix') return 'Not a universal raised-bed recipe; compost quality, drainage, native soil, crop choice, and soil-test results can change the right mix.';
  if (page.initial === 'containers') return 'Not an exact manufacturer fill specification; container shape, taper, drainage, fill line, and media texture can change real volume.';
  if (page.initial === 'bulk') return 'Not a supplier quote; delivery minimums, fuel fees, loading rules, taxes, and product availability must be checked with the seller.';
  return 'Not a guarantee of plant performance, local pricing, soil quality, or yield. It is a planning estimate built from the inputs you enter.';
}

function verificationForPage(page: PageDefinition) {
  const checks = [
    'Measure inside dimensions rather than outside lumber, block, or kit dimensions.',
    'Confirm the package volume label before converting soil bags.',
    'Keep or adjust the settling allowance based on the material and supplier.',
  ];

  if (page.initial === 'bulk') return ['Ask the supplier for cubic-yard price, minimum order, delivery fee, and loading rules.', 'Compare overbuy volume with future top-off needs.', 'Use one unit system when comparing bags and bulk.'];
  if (page.initial === 'mix') return ['Make sure component percentages total 100%.', 'Check compost maturity, drainage, and local soil-test guidance.', 'Do not treat volume ratios as nutrient recommendations.'];
  if (page.initial === 'containers') return ['Check pot or grow-bag fill line and drainage space.', 'Use container media when a potting mix is more appropriate than dense garden soil.', 'Set quantity before shopping so small volume differences are multiplied correctly.'];
  if (page.initial === 'spacing') return ['Verify seed-packet or transplant spacing.', 'Adjust for trellis, pruning, airflow, and mature plant size.', 'Leave working room for paths, cages, stakes, or harvest access.'];
  if (page.initial === 'depth') return ['Check whether the bed sits over soil, compacted base, or concrete.', 'Compare crop variety and root length with planned depth.', 'Consider drainage and irrigation before assuming deeper is always better.'];
  return checks;
}


function sourceBasisForPage(page: PageDefinition) {
  const common = [
    'Unit conversion formulas used by the calculator are deterministic and visible in the formula section on this page.',
    'Page guidance separates calculator math from gardening assumptions so volume outputs can be checked independently.',
  ];

  switch (page.initial) {
    case 'bags':
      return [...common, 'Bag recommendations are based on package volume, not weight labels, because moisture and density change bag weight.'];
    case 'bulk':
      return [...common, 'Bulk comparisons use cubic-yard conversion plus delivery and minimum-order checks that must be confirmed with the supplier.'];
    case 'mix':
      return [...common, 'Mix outputs are volume splits by percentage; nutrient suitability still depends on compost quality and soil-test context.'];
    case 'containers':
      return [...common, 'Container and grow-bag estimates use nominal gallon, quart, liter, or geometric volume and disclose shape/fill-line limitations.'];
    case 'spacing':
      return [...common, 'Plant counts use square-foot planning math and deliberately require variety, airflow, trellis, and packet spacing verification.'];
    case 'depth':
      return [...common, 'Depth screens compare the entered depth with conservative crop-depth planning ranges rather than making agronomic guarantees.'];
    case 'topoff':
      return [...common, 'Top-off estimates are based on measured surface drop and bed area, then treated as a purchase planning estimate.'];
    case 'cost':
      return [...common, 'Cost outputs combine editable unit prices, bag or bulk quantities, and delivery assumptions so shoppers can replace defaults with local quotes.'];
    default:
      return [...common, 'Raised-bed volume follows length × width × effective depth × quantity, with optional freeboard and settling adjustments.'];
  }
}

function reviewTriggersForPage(page: PageDefinition) {
  const triggers = [
    'A calculator formula, unit conversion, or rounding rule changes.',
    'A source or visible planning assumption is corrected or replaced.',
    'A user reports a mismatch between the page result and a reproducible input set.',
  ];

  if (page.initial === 'bags' || page.initial === 'bulk') {
    return [...triggers, 'Common soil bag sizes, delivery minimums, or supplier packaging conventions change.'];
  }
  if (page.initial === 'mix' || page.initial === 'depth' || page.initial === 'spacing') {
    return [...triggers, 'Gardening guidance, crop spacing, depth assumptions, or source recommendations are updated.'];
  }
  return triggers;
}

function citationFactsForPage(page: PageDefinition) {
  const depth = depthFromSlug(page.slug);
  const depthOutput = depth ? volumeFromDepth(depth) : undefined;
  if (depthOutput) {
    return [
      `4×8 at ${depth} inches = ${depthOutput.baseFt3.toFixed(2)} ft³ before settling.`,
      `With 10% settling = ${depthOutput.finalFt3.toFixed(2)} ft³, or ${depthOutput.yd3.toFixed(2)} yd³.`,
      `Using 2 ft³ bags, the rounded shopping estimate is ${depthOutput.twoFtBags} bags.`,
    ];
  }

  if (page.slug === '4x8-raised-bed-soil-calculator' || page.slug === 'how-much-soil-for-4x8-raised-bed') {
    return ['A 4×8 bed has 32 square feet of surface area.', 'At 12 inches deep, the base soil volume is 32 ft³ before settling.', 'One cubic yard equals 27 cubic feet, so 32 ft³ is about 1.19 yd³.'];
  }

  switch (page.initial) {
    case 'bags':
      return ['Bag count = ceil(required cubic feet ÷ cubic feet per bag).', 'Weight-only soil labels need a product density before reliable volume conversion.', 'One cubic foot equals about 29.92 dry quarts.'];
    case 'bulk':
      return ['One cubic yard equals 27 cubic feet.', 'Bulk order comparison should include delivery fees and minimum order size.', 'Overbuy volume should be shown separately from required project volume.'];
    case 'mix':
      return ['Component volume = total volume × component percentage.', 'A 60/30/10 mix over 32 ft³ allocates 19.2 ft³, 9.6 ft³, and 3.2 ft³.', 'Mix percentages are volume estimates, not nutrient guarantees.'];
    case 'containers':
      return ['One US gallon equals about 0.13368 ft³.', 'Round-pot volume uses π × radius² × height.', 'Container labels are nominal and can differ from actual filled volume.'];
    case 'spacing':
      return ['A 4×8 bed provides 32 one-square-foot grid cells.', 'Plant count depends on plants per square foot and variety-specific spacing.', 'Grid math does not account for trellis, pruning, or airflow needs.'];
    case 'depth':
      return ['Depth suitability is a screen against conservative crop-depth ranges.', 'Beds over hard surfaces depend more heavily on the installed soil depth.', 'Loose native soil below a bed can extend usable root volume.'];
    default:
      return ['Raised bed volume = length × width × effective depth × number of beds.', 'Effective depth should subtract freeboard when the bed is not filled to the rim.', 'Final planning volume can include a settling allowance before bag count is rounded.'];
  }
}

export function contentQualityForPage(page: PageDefinition): ContentQualityBrief {
  return {
    quickAnswer: quickAnswerForPage(page),
    bestFor: bestForForPage(page),
    notFor: notForForPage(page),
    verify: verificationForPage(page),
    sourceBasis: sourceBasisForPage(page),
    reviewTriggers: reviewTriggersForPage(page),
    citationFacts: citationFactsForPage(page),
    editorialNote: `Maintained by YmirTool. Last reviewed ${DEFAULT_LAST_MODIFIED}. Corrections should include the page URL, input values, and the expected calculation or source issue.`,
  };
}

export function homepageContentQuality(): ContentQualityBrief {
  return {
    quickAnswer: 'BedSoil estimates raised-bed soil volume, bag count, bulk cubic yards, mix components, container volume, top-off material, crop depth fit, and square-foot planting counts from editable inputs.',
    bestFor: 'Best for gardeners who need a purchase-ready estimate before comparing bag labels, bulk delivery, compost ratios, or planting layouts.',
    notFor: 'Not a substitute for supplier quotes, soil tests, local Extension advice, seed-packet spacing, or professional horticultural recommendations.',
    verify: ['Measure the inside bed dimensions.', 'Check product package volume labels before buying.', 'Verify delivery minimums, soil tests, drainage, and crop-specific guidance locally.'],
    sourceBasis: [
      'Calculator formulas are exposed on the page and use deterministic volume, bag, bulk, mix, spacing, top-off, and cost math.',
      'Planning guidance separates measurable inputs from local gardening advice so users can verify purchases before acting.',
      'Source and methodology panels remain visible below the calculator for users who need formula, limitation, or citation context.',
    ],
    reviewTriggers: [
      'Formula logic, conversion constants, or rounding rules change.',
      'Calculator modes, presets, or citation sources are added or removed.',
      'A user reports a reproducible mismatch between entered values and displayed results.',
    ],
    citationFacts: ['Raised bed volume uses length × width × effective depth × quantity.', 'Bag counts round up after the final required volume is calculated.', 'One cubic yard equals 27 cubic feet, the common bridge between bagged and bulk soil estimates.'],
    editorialNote: `Maintained by YmirTool. Last reviewed ${DEFAULT_LAST_MODIFIED}. Calculator logic is separated from gardening assumptions so corrections can be traced to either formula math or source guidance.`,
  };
}
