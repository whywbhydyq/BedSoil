import type { PageDefinition } from '@/lib/data/pages';

type Insight = {
  heading: string;
  body: string;
  bullets: string[];
};

function depthFromSlug(slug: string): number | undefined {
  const match = slug.match(/4x8-raised-bed-(6|8|10|12|18|24)-inches-soil/);
  return match ? Number(match[1]) : undefined;
}

function sizeFromTitle(title: string): string | undefined {
  const match = title.match(/(\d+)×(\d+)/);
  return match ? `${match[1]}×${match[2]}` : undefined;
}

function bagSizeFromSlug(slug: string): string | undefined {
  if (slug.includes('40-qt')) return '40 dry quart';
  if (slug.includes('1-5-cubic-foot')) return '1.5 ft³';
  if (slug.includes('2-cubic-foot')) return '2 ft³';
  if (slug.includes('1-cubic-foot')) return '1 ft³';
  if (slug.includes('40-lb')) return '40 lb weight-labeled';
  return undefined;
}

function cropFromSlug(slug: string): string | undefined {
  if (slug.includes('tomato')) return 'tomatoes';
  if (slug.includes('pepper')) return 'peppers';
  if (slug.includes('lettuce')) return 'lettuce';
  if (slug.includes('carrot')) return 'carrots';
  if (slug.includes('cucumber')) return 'cucumbers';
  if (slug.includes('basil')) return 'basil';
  return undefined;
}

function containerFromSlug(slug: string): string | undefined {
  if (slug.includes('10-gallon')) return '10-gallon grow bags';
  if (slug.includes('20-gallon')) return '20-gallon grow bags';
  if (slug.includes('5-gallon-bucket')) return '5-gallon buckets';
  if (slug.includes('six-inch-pots')) return 'six-inch pots';
  if (slug.includes('grow-bag')) return 'grow bags';
  if (slug.includes('planter')) return 'planters';
  return undefined;
}

function shapeFromSlug(slug: string): string | undefined {
  if (slug.includes('round')) return 'round raised beds';
  if (slug.includes('l-shaped')) return 'L-shaped raised beds';
  if (slug.includes('u-shaped')) return 'U-shaped raised beds';
  return undefined;
}

function primaryUse(page: PageDefinition): Insight {
  const depth = depthFromSlug(page.slug);
  const size = sizeFromTitle(page.title);
  const bag = bagSizeFromSlug(page.slug);
  const crop = cropFromSlug(page.slug);
  const container = containerFromSlug(page.slug);
  const shape = shapeFromSlug(page.slug);

  if (depth) {
    return {
      heading: `${depth} inch 4×8 planning context`,
      body: `This page is tuned for a 4×8 bed filled ${depth} inches deep, so the default interpretation starts with a 32 ft² footprint and converts the depth into cubic feet before bag or bulk comparisons.`,
      bullets: [
        depth <= 8 ? 'Use the result mainly for shallow-root planning and top-off scenarios.' : 'Compare bagged soil with bulk delivery because deeper 4×8 beds can require substantial volume.',
        'Keep the 10% settling allowance unless your supplier or material mix suggests a different cushion.',
        'Use the bag-size selector before buying because 1 ft³, 1.5 ft³, 2 ft³, and 40 dry quart bags produce different round-up counts.',
      ],
    };
  }

  if (size) {
    return {
      heading: `${size} raised bed planning context`,
      body: `This page focuses on a common ${size} bed footprint and uses editable depth, freeboard, quantity, settling allowance, and bag-size assumptions rather than a single fixed purchase answer.`,
      bullets: [
        'Measure the inside dimensions if the lumber, blocks, or kit sides are thick.',
        'Keep depth in inches unless you intentionally switch to metric units in the calculator.',
        'Check the output in cubic feet first, then compare bags and cubic-yard bulk ordering.',
      ],
    };
  }

  if (bag) {
    return {
      heading: `${bag} bag interpretation`,
      body: `This page is designed for shoppers comparing soil volume labels. It treats ${bag} as a planning label and still lets you override bag size when your product label differs.`,
      bullets: [
        bag.includes('lb') ? 'Weight-labeled products need a volume label or density estimate before a reliable bag count can be calculated.' : 'Round up bag count because partial bags are rarely purchasable.',
        'Check whether the label uses cubic feet, dry quarts, liters, or gallons before entering the value.',
        'Use the leftover-volume note to decide whether to buy one extra bag for settling or future top-off.',
      ],
    };
  }

  if (crop) {
    return {
      heading: `${crop[0].toUpperCase()}${crop.slice(1)} planning context`,
      body: `This page treats ${crop} as a spacing or depth planning case, not as a guaranteed yield plan. The calculator gives a conservative count or suitability check that still depends on variety, support, water, and local growing conditions.`,
      bullets: [
        'Check the seed packet or transplant tag before treating the grid count as final.',
        'Use larger spacing for vigorous varieties, trellised crops, or crops that need airflow.',
        'Keep soil depth, drainage, irrigation, and season length in the decision before planting.',
      ],
    };
  }

  if (container) {
    return {
      heading: `${container[0].toUpperCase()}${container.slice(1)} planning context`,
      body: `This page converts container labels and measured dimensions into volume estimates, then reuses the bag-count logic so you can plan how much potting mix to buy.`,
      bullets: [
        'Container ratings are nominal; real fill can change with taper, folds, drainage layer, and fill line.',
        'Use potting mix or container media when appropriate rather than dense garden soil.',
        'Set quantity before shopping because small rounding errors multiply across many containers.',
      ],
    };
  }

  if (shape) {
    return {
      heading: `${shape[0].toUpperCase()}${shape.slice(1)} planning context`,
      body: `This page helps translate non-rectangular beds into volume by decomposing the shape into simpler sections and applying the same depth and settling assumptions.`,
      bullets: [
        'Sketch the bed and measure each section from the inside edge.',
        'Use one consistent depth unit across every shape segment.',
        'Round the final bag count up after all segments are combined, not per segment.',
      ],
    };
  }

  switch (page.initial) {
    case 'bulk':
      return {
        heading: 'Bulk-order decision context',
        body: 'This page compares bagged soil with cubic-yard ordering, delivery minimums, pickup constraints, and overbuy volume so the cheaper option is not judged by unit price alone.',
        bullets: ['Include delivery fees and minimum-order rules.', 'Check whether you have a truck or trailer before choosing pickup.', 'Keep extra soil storage and top-off use in mind if the minimum order exceeds your need.'],
      };
    case 'mix':
      return {
        heading: 'Mix-ratio planning context',
        body: 'This page splits a known soil volume into components. It does not prescribe one universal recipe because compost quality, drainage, crop choice, and local soil-test context change the right blend.',
        bullets: ['Make custom percentages total 100%.', 'Treat compost-heavy results as planning estimates, not soil-test advice.', 'Use local product labels because screened topsoil, compost, coir, peat, perlite, and vermiculite have different package units.'],
      };
    case 'spacing':
      return {
        heading: 'Square-foot spacing context',
        body: 'This page turns bed area into planting squares and estimated crop counts. It is useful for layout planning, but plant size, support style, pruning, and airflow can reduce the practical count.',
        bullets: ['Use the grid count as a starting point only.', 'Leave access paths and trellis room outside the simple square count.', 'Compare the result with seed-packet spacing and local Extension guidance.'],
      };
    case 'depth':
      return {
        heading: 'Depth-suitability context',
        body: 'This page compares planned bed depth with conservative crop-depth ranges. It should be read as a suitability screen rather than a local agronomy recommendation.',
        bullets: ['Hard surfaces under the bed make depth more important.', 'Loose native soil below the bed can extend usable root volume.', 'Long root crops and large fruiting crops generally need more conservative depth choices.'],
      };
    case 'topoff':
      return {
        heading: 'Top-off planning context',
        body: 'This page estimates the material needed to restore a settled bed surface by a measured depth, usually after compost breakdown, harvest, or seasonal settling.',
        bullets: ['Measure the current drop below the rim before choosing 1, 2, or 3 inches.', 'Separate top-off volume from mulch and fertilizer decisions.', 'Avoid assuming compost-only top-off is appropriate every season without soil-test context.'],
      };
    case 'cost':
      return {
        heading: 'Cost-estimate context',
        body: 'This page combines volume, material price, delivery or pickup, and related bed costs so the estimate reflects a project budget rather than soil volume alone.',
        bullets: ['Add tax, delivery, hardware, compost, mulch, and kit costs separately.', 'Compare unit prices using the same volume unit.', 'Keep a contingency for settling or supplier minimums.'],
      };
    default:
      return {
        heading: 'Calculator planning context',
        body: 'This page starts with editable calculator inputs and keeps the final answer tied to your dimensions, quantity, unit choice, and shopping assumptions.',
        bullets: ['Use inside dimensions for constructed beds.', 'Check volume first, then decide between bags and bulk.', 'Print or copy the result before purchasing materials.'],
      };
  }
}

function verification(page: PageDefinition): Insight {
  const crop = cropFromSlug(page.slug);
  const container = containerFromSlug(page.slug);
  return {
    heading: 'Before you rely on the result',
    body: `Use the ${page.title} output as a purchasing and planning estimate, then verify the real-world constraints that the calculator cannot observe from your browser inputs.`,
    bullets: [
      crop ? 'Confirm variety-specific spacing, support, and harvest style before planting.' : 'Confirm product volume labels, local supplier prices, and delivery minimums before buying.',
      container ? 'Check drainage, fill line, and media type for the exact container you will use.' : 'Confirm site drainage, bed construction, and whether freeboard changes the usable fill depth.',
      'If the result is near a bag or cubic-yard boundary, compare the cost of one extra bag or a small top-off reserve.',
    ],
  };
}

function internalNextStep(page: PageDefinition): Insight {
  const related = page.related ?? [];
  const relatedCopy = related.length ? `Related next calculators: ${related.slice(0, 3).join(', ')}.` : 'Use the related calculator links below to continue planning.';
  return {
    heading: 'Best next step',
    body: relatedCopy,
    bullets: [
      'Use the calculator on this page first so the result reflects your project dimensions.',
      'Then compare bag count, bulk ordering, mix ratio, and crop spacing only when those assumptions apply.',
      'Keep the copied shopping list with your chosen unit system and bag size so supplier labels can be checked quickly.',
    ],
  };
}

export function insightsForPage(page: PageDefinition): Insight[] {
  return [primaryUse(page), verification(page), internalNextStep(page)];
}
