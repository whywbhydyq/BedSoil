import { BagUnit, CurrencyCode, volumeToFt3 } from './units';
import type { CalculatorWarning } from './warnings';
import { warn } from './warnings';

export interface SoilBagInput {
  bagSize: number;
  bagUnit: BagUnit;
  bagPrice?: number;
  currency?: CurrencyCode;
}

export interface BagResult {
  bagVolumeFt3: number;
  rawBags: number;
  bagsNeeded: number;
  leftoverFt3: number;
  totalCost?: number;
  currency?: CurrencyCode;
  canEstimateBags: boolean;
  isWeightBased: boolean;
  warnings: CalculatorWarning[];
}

export function calculateSoilBags(requiredVolumeFt3: number, input: SoilBagInput): BagResult {
  const warnings: CalculatorWarning[] = [];

  const isWeightBased = input.bagUnit === 'lb' || input.bagUnit === 'kg';

  if (isWeightBased) {
    warnings.push(warn('weight-based-bag', 'Weight-only soil bags cannot be converted to bag count without a package volume. Use cubic feet, dry quarts, liters, or gallons from the label.'));
  }

  const bagVolumeFt3 = volumeToFt3(input.bagSize, input.bagUnit);
  const canEstimateBags = !isWeightBased && bagVolumeFt3 > 0;
  if (input.bagSize <= 0) warnings.push(warn('bag-size-zero', 'Bag size must be greater than zero.', 'critical'));

  if (requiredVolumeFt3 <= 0 || bagVolumeFt3 <= 0) {
    return {
      bagVolumeFt3,
      rawBags: 0,
      bagsNeeded: 0,
      leftoverFt3: 0,
      totalCost: input.bagPrice === undefined ? undefined : 0,
      currency: input.currency,
      canEstimateBags,
      isWeightBased,
      warnings,
    };
  }

  const rawBags = requiredVolumeFt3 / bagVolumeFt3;
  const bagsNeeded = Math.ceil(rawBags);
  const leftoverFt3 = bagsNeeded * bagVolumeFt3 - requiredVolumeFt3;

  return {
    bagVolumeFt3,
    rawBags,
    bagsNeeded,
    leftoverFt3,
    totalCost: input.bagPrice === undefined ? undefined : bagsNeeded * input.bagPrice,
    currency: input.currency,
    canEstimateBags,
    isWeightBased,
    warnings,
  };
}
