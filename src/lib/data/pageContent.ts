import { fmt } from '@/lib/utils/format';

export type FourByEightDepthOutput = {
  depthInches: number;
  slug: string;
  baseFt3: number;
  finalFt3: number;
  yd3: number;
  twoFtBags: number;
  fitNote: string;
};

const FOUR_BY_EIGHT_DEPTHS = [6, 8, 10, 12, 18, 24] as const;

function fourByEightDepthSlug(depthInches: number) {
  return `4x8-raised-bed-${depthInches}-inches-soil`;
}

function fitNote(depthInches: number) {
  if (depthInches <= 6) return 'Shallow planning depth: better for greens, herbs, and short-root crops than for large fruiting crops.';
  if (depthInches <= 8) return 'Moderate shallow depth: workable for many smaller crops, but limited for deep-rooted or long-season vegetables.';
  if (depthInches <= 12) return 'Common raised-bed depth: a practical planning depth for many vegetables when soil and watering are managed well.';
  if (depthInches <= 18) return 'Deeper bed: higher material cost, but more root volume and more flexibility for larger crops.';
  return 'Very deep bed: compare bulk delivery with bags and check whether full-depth premium mix is necessary.';
}

export const FOUR_BY_EIGHT_OUTPUTS: FourByEightDepthOutput[] = FOUR_BY_EIGHT_DEPTHS.map((depthInches) => {
  const baseFt3 = 32 * (depthInches / 12);
  const finalFt3 = baseFt3 * 1.1;
  return {
    depthInches,
    slug: fourByEightDepthSlug(depthInches),
    baseFt3,
    finalFt3,
    yd3: finalFt3 / 27,
    twoFtBags: Math.ceil(finalFt3 / 2),
    fitNote: fitNote(depthInches),
  };
});

export function fourByEightDepthOutputsForSlug(slug: string): FourByEightDepthOutput[] {
  if (slug === '4x8-raised-bed-soil-calculator' || slug === 'how-much-soil-for-4x8-raised-bed') return FOUR_BY_EIGHT_OUTPUTS;
  const match = slug.match(/^4x8-raised-bed-(6|8|10|12|18|24)-inches-soil$/);
  if (!match) return [];
  return FOUR_BY_EIGHT_OUTPUTS.filter((row) => row.depthInches === Number(match[1]));
}

export function fourByEightDepthCopy(row: FourByEightDepthOutput) {
  return `${row.depthInches} in: ${fmt(row.baseFt3)} ft³ before settling; ${fmt(row.finalFt3)} ft³ with 10% settling; ${fmt(row.yd3)} yd³; about ${row.twoFtBags} × 2 ft³ bags.`;
}
