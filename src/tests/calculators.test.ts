import { describe, expect, it } from 'vitest';
import {
  CROPS,
  calculateAnnualTopOff,
  calculateGrowBagVolume,
  calculateRaisedBedVolume,
  calculateSoilBags,
  calculateSoilMix,
  calculateSquareFootSpacing,
  volumeToFt3,
  calculateLShapedRaisedBedVolume,
  calculateMultipleRaisedBedVolume,
  calculateRoundRaisedBedVolume,
  calculateUShapedRaisedBedVolume,
  calculateMultipleRectangularContainerVolume,
  compareBulkVsBags,
  currencySymbol,
  estimateRaisedBedProjectCost,
  calculateTopOffMaterials,
} from '@/lib/calculators';
import { allPages } from '@/lib/data/pages';

const baseBed = {
  length: 4,
  width: 8,
  depth: 12,
  lengthUnit: 'ft' as const,
  widthUnit: 'ft' as const,
  depthUnit: 'in' as const,
  numberOfBeds: 1,
  freeboard: 0,
  freeboardUnit: 'in' as const,
  settlingAllowancePercent: 0,
};

describe('BedSoil required acceptance calculations', () => {
  it('4 ft × 8 ft × 12 in = 32 ft³ / 1.19 yd³', () => {
    const result = calculateRaisedBedVolume(baseBed);
    expect(result.finalVolumeFt3).toBeCloseTo(32, 4);
    expect(result.volumeYd3).toBeCloseTo(1.185, 3);
  });

  it('2 beds of 4 ft × 8 ft × 12 in with 10% settling = 70.4 ft³ / 2.61 yd³', () => {
    const result = calculateRaisedBedVolume({ ...baseBed, numberOfBeds: 2, settlingAllowancePercent: 10 });
    expect(result.finalVolumeFt3).toBeCloseTo(70.4, 4);
    expect(result.volumeYd3).toBeCloseTo(2.607, 3);
  });

  it('32 ft³ ÷ 2 ft³ bag = 16 bags', () => {
    expect(calculateSoilBags(32, { bagSize: 2, bagUnit: 'ft3' }).bagsNeeded).toBe(16);
  });

  it('32 ft³ ÷ 1.5 ft³ bag = 22 bags with about 1 ft³ left', () => {
    const result = calculateSoilBags(32, { bagSize: 1.5, bagUnit: 'ft3' });
    expect(result.bagsNeeded).toBe(22);
    expect(result.leftoverFt3).toBeCloseTo(1, 4);
  });

  it('40 dry quarts ≈ 1.56 ft³', () => {
    expect(volumeToFt3(40, 'dryQuart')).toBeCloseTo(1.56, 2);
  });

  it('10 × 15-gallon grow bags + 6 × 10-gallon grow bags = 210 gallons ≈ 28.07 ft³', () => {
    const result = calculateGrowBagVolume({ gallons: 10 * 15 + 6 * 10, quantity: 1 });
    expect(result.finalVolumeFt3).toBeCloseTo(28.07, 2);
  });

  it('4 ft × 8 ft × 2 in top-off = 5.33 ft³', () => {
    const result = calculateAnnualTopOff({ length: 4, width: 8, topOffDepth: 2, lengthUnit: 'ft', widthUnit: 'ft', topOffDepthUnit: 'in', numberOfBeds: 1 });
    expect(result.finalVolumeFt3).toBeCloseTo(5.333, 3);
  });

  it('32 ft³ 60/30/10 mix = 19.2 / 9.6 / 3.2 ft³', () => {
    const result = calculateSoilMix(32, {
      templateId: 'basic',
      components: [
        { id: 'topsoil', name: 'Topsoil', ratioPercent: 60 },
        { id: 'compost', name: 'Compost', ratioPercent: 30 },
        { id: 'pottingMix', name: 'Potting mix', ratioPercent: 10 },
      ],
    });
    expect(result[0].volumeFt3).toBeCloseTo(19.2, 4);
    expect(result[1].volumeFt3).toBeCloseTo(9.6, 4);
    expect(result[2].volumeFt3).toBeCloseTo(3.2, 4);
  });

  it('4x8 square foot grid = 32 squares and 4x4 = 16 squares', () => {
    expect(calculateSquareFootSpacing({ lengthFt: 4, widthFt: 8, cropId: 'tomato' }).totalSquares).toBe(32);
    expect(calculateSquareFootSpacing({ lengthFt: 4, widthFt: 4, cropId: 'tomato' }).totalSquares).toBe(16);
    expect(CROPS.length).toBeGreaterThanOrEqual(10);
  });
});

describe('BedSoil completed P1 planning functions', () => {
  it('calculates round raised bed soil as cylinder volume', () => {
    const result = calculateRoundRaisedBedVolume({ diameter: 6, depth: 12, unit: 'ft', depthUnit: 'in', numberOfBeds: 1, settlingAllowancePercent: 0 });
    expect(result.finalVolumeFt3).toBeCloseTo(Math.PI * 3 * 3 * 1, 4);
    expect(result.warnings[0].code).toBe('round-bed-estimate');
  });

  it('calculates L-shaped and U-shaped bed approximations', () => {
    const l = calculateLShapedRaisedBedVolume({ outerLength: 8, outerWidth: 6, cutoutLength: 4, cutoutWidth: 3, depth: 12, unit: 'ft', depthUnit: 'in', numberOfBeds: 1, settlingAllowancePercent: 0 });
    expect(l.finalVolumeFt3).toBeCloseTo(36, 4);
    const u = calculateUShapedRaisedBedVolume({ outerLength: 8, outerWidth: 6, innerLength: 4, innerWidth: 3, depth: 12, unit: 'ft', depthUnit: 'in', numberOfBeds: 1, settlingAllowancePercent: 0 });
    expect(u.finalVolumeFt3).toBeCloseTo(36, 4);
  });

  it('sums multiple raised bed rows', () => {
    const result = calculateMultipleRaisedBedVolume([
      baseBed,
      { ...baseBed, length: 4, width: 4 },
      { ...baseBed, length: 2, width: 8 },
    ]);
    expect(result.finalVolumeFt3).toBeCloseTo(64, 4);
  });

  it('sums multiple rectangular container rows instead of using a fixed demo value', () => {
    const result = calculateMultipleRectangularContainerVolume([
      { length: 24, width: 12, depth: 12, unit: 'in', quantity: 2 },
      { length: 18, width: 18, depth: 14, unit: 'in', quantity: 3 },
    ]);
    expect(result.finalVolumeFt3).toBeCloseTo(2 * 1 * 1 * 2 + 1.5 * 1.5 * (14 / 12) * 3, 4);
  });

  it('estimates project cost with currency code support', () => {
    const result = estimateRaisedBedProjectCost({ soilCost: 128, lumberOrKitCost: 180, compostCost: 40, mulchCost: 25, hardwareCost: 20, deliveryFee: 60, taxPercent: 10, numberOfBeds: 2, currency: 'USD' });
    expect(result.total).toBeCloseTo(498.3, 4);
    expect(result.costPerBed).toBeCloseTo(249.15, 4);
    expect(currencySymbol('EUR')).toBe('€');
  });

  it('returns top-off compost, soil, and optional mulch planning amounts', () => {
    const result = calculateTopOffMaterials(8, 75, 25);
    expect(result.compostFt3).toBeCloseTo(6, 4);
    expect(result.soilFt3).toBeCloseTo(2, 4);
    expect(result.optionalMulchFt3).toBeCloseTo(2, 4);
  });

  it('returns bulk comparison cost-per-volume and overbuy fields', () => {
    const result = compareBulkVsBags(32, { bagSize: 2, bagUnit: 'ft3', bagPrice: 8 }, { pricePerCubicYard: 60, deliveryFee: 40, minimumOrderYards: 2 });
    expect(result.requiredYd3).toBeCloseTo(32 / 27, 4);
    expect(result.bulkOrderYd3).toBeCloseTo(2, 4);
    expect(result.overbuyFt3).toBeCloseTo(22, 4);
    expect(result.bagCostPerFt3).toBeCloseTo(4, 4);
    expect(result.bulkCostPerFt3).toBeCloseTo(160 / 54, 4);
  });
});

describe('BedSoil full original requirements route coverage', () => {
  it('keeps every route unique and includes all original 45 SEO requirement slugs', () => {
    const slugs = allPages.map((page) => page.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const requiredSlugs = [
      'raised-bed-soil-calculator','4x8-raised-bed-soil-calculator','how-much-soil-for-4x8-raised-bed','how-many-bags-of-soil-for-raised-bed','4x8-raised-bed-12-inches-soil','4x8-raised-bed-10-inches-soil','4x4-raised-bed-soil-calculator','3x6-raised-bed-soil-calculator','2x8-raised-bed-soil-calculator','raised-bed-cubic-feet-calculator','soil-bags-calculator','40-qt-soil-bag-calculator','1-5-cubic-foot-soil-bag-calculator','2-cubic-foot-soil-bag-calculator','cubic-feet-to-soil-bags-calculator','cubic-yards-to-soil-bags-calculator','liters-to-cubic-feet-soil-calculator','how-many-40-lb-bags-of-soil-do-i-need','bulk-soil-vs-bags-calculator','raised-bed-cost-calculator','cheapest-way-to-fill-raised-beds','how-much-bulk-soil-for-raised-beds','cubic-yards-of-soil-for-raised-beds','raised-bed-soil-mix-calculator','compost-topsoil-mix-calculator','mels-mix-calculator','how-much-compost-for-raised-bed','topsoil-compost-ratio-raised-bed','container-soil-calculator','planter-soil-volume-calculator','grow-bag-soil-calculator','10-gallon-grow-bag-soil-calculator','20-gallon-grow-bag-soil-calculator','5-gallon-bucket-soil-calculator','how-much-soil-for-45-six-inch-pots','square-foot-garden-spacing-calculator','4x8-raised-bed-planting-layout','how-many-tomato-plants-in-4x8-raised-bed','tomato-spacing-raised-bed','pepper-spacing-raised-bed','carrot-spacing-square-foot-garden','lettuce-spacing-square-foot-garden','cucumber-spacing-raised-bed','raised-bed-depth-for-tomatoes','raised-bed-depth-for-carrots',
    ];
    for (const slug of requiredSlugs) expect(slugs).toContain(slug);
  });
});
