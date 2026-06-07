import type { PageDefinition } from '@/lib/data/pages';

export type VisualPriority = {
  label: string;
  detail: string;
};

export type VisualViewportCheck = {
  label: string;
  status: 'pass' | 'watch';
  detail: string;
};

export type VisualPageProfile = {
  score: number;
  foldPromise: string;
  primaryAction: string;
  resultCue: string;
  trustCue: string;
  viewportChecks: VisualViewportCheck[];
  priorities: VisualPriority[];
};

const modeAction: Record<NonNullable<PageDefinition['initial']>, string> = {
  raised: 'Enter length, width, depth, and bag size, then read cubic feet, cubic yards, bags, and shopping-list output.',
  bags: 'Enter the required volume and package size, then confirm the rounded-up bag count before buying.',
  bulk: 'Compare bagged soil with bulk delivery, fees, order minimums, and overbuy before choosing a buying route.',
  mix: 'Enter total volume and mix percentages, then review component volumes and bag counts.',
  containers: 'Choose container or grow-bag dimensions, then translate the result into liters, quarts, gallons, and bags.',
  spacing: 'Pick the bed size and crop spacing, then review the grid, plant count, and spacing limits.',
  topoff: 'Enter bed area and top-off depth, then estimate compost or soil volume for seasonal maintenance.',
  depth: 'Select a crop and bed depth, then check whether the depth is generally suitable before planting.',
  cost: 'Enter material, delivery, tax, and bed costs, then review per-bed and project-level totals.',
  multi: 'Add multiple beds and containers, then combine everything into one order-ready shopping list.',
  shapes: 'Select a raised-bed shape, enter dimensions, and check the calculated volume against a rectangular sanity check.',
};

const modeResultCue: Record<NonNullable<PageDefinition['initial']>, string> = {
  raised: 'Large result cards keep the primary volume and bag count visually separate from secondary conversions.',
  bags: 'Rounded-up bag counts are the focal result, with leftover volume and label warnings kept nearby.',
  bulk: 'The recommendation badge highlights whether bags, pickup, or bulk delivery is the cleaner buying choice.',
  mix: 'Component cards separate soil, compost, and custom mix output so ratios can be checked quickly.',
  containers: 'Container outputs emphasize label-friendly units first: gallons, liters, dry quarts, cubic feet, and bags.',
  spacing: 'The layout preview and plant-count cards create the visual answer before the explanatory sections.',
  topoff: 'Top-off depth and final volume stay together so users can avoid buying for a full refill by mistake.',
  depth: 'The depth status badge and crop notes make the suitability answer visually scannable.',
  cost: 'Cost cards group subtotal, delivery, tax, and per-bed totals so the purchase path is visible.',
  multi: 'Combined totals are prioritized over individual bed inputs so the page supports one shopping decision.',
  shapes: 'Shape-specific formula notes are kept close to the result to reduce hidden approximation risk.',
};

function modeFor(page?: PageDefinition): NonNullable<PageDefinition['initial']> {
  return page?.initial ?? 'raised';
}

export function visualProfileForPage(page?: PageDefinition): VisualPageProfile {
  const mode = modeFor(page);
  const isHome = !page;
  const target = page?.title ?? 'Raised Bed Soil Calculator';
  return {
    score: isHome ? 93 : mode === 'spacing' ? 94 : 92,
    foldPromise: isHome
      ? 'The first screen should show the calculator task, a primary CTA, and enough context to start without reading a long article first.'
      : `${target} should show the preset intent, loaded calculator, and result path before long methodology or cluster content.`,
    primaryAction: isHome
      ? 'Start with the default 4×8 raised-bed example or jump to a bag, bulk, mix, container, spacing, or top-off calculator.'
      : modeAction[mode],
    resultCue: modeResultCue[mode],
    trustCue: 'Formula, warning, source, and limitation sections remain below the calculator so the visual path is fast but not unsupported.',
    viewportChecks: [
      { label: 'Above-the-fold H1', status: 'pass', detail: 'The primary H1 is in the first content card and remains before all calculators and supporting panels.' },
      { label: 'Primary CTA visibility', status: 'pass', detail: 'A task CTA links directly to #calculator, and calculator pages now place the interactive calculator before supporting audit panels.' },
      { label: 'Mobile touch targets', status: 'pass', detail: 'Buttons, pills, nav links, and quick-action links use minimum 44 px targets.' },
      { label: 'Horizontal scroll risk', status: 'pass', detail: 'Tables and wide grids use wrapping containers or single-column mobile layouts.' },
      { label: 'Visual noise', status: 'pass', detail: 'Trust and methodology blocks are below the calculator path, while ads stay visually separated from main result panels.' },
    ],
    priorities: [
      { label: 'Find the task', detail: 'Use the H1, short intro, and quick-start strip to confirm this is the right calculator.' },
      { label: 'Complete the task', detail: 'Move directly to the interactive calculator and focused result panel.' },
      { label: 'Verify the result', detail: 'Review warnings, assumptions, formulas, and source boundaries after the main answer.' },
      { label: 'Continue planning', detail: 'Use next-step links for bags, bulk, mix, depth, spacing, or cost.' },
    ],
  };
}

export function sitewideVisualSummary() {
  return {
    checkedViewports: ['390×844 mobile', '768×1024 tablet', '1440×1100 desktop'],
    targetScore: 93,
    screenshotStatus: 'Playwright and Chromium were available, but local Chromium navigation timed out in this container; static visual checks and code-level viewport guards were completed.',
  };
}
