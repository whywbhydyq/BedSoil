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
  warnings: CalculatorWarning[];
}

export function calculateSoilBags(requiredVolumeFt3: number, input: SoilBagInput): BagResult {
  const warnings: CalculatorWarning[] = [];

  if (input.bagUnit === 'lb' || input.bagUnit === 'kg') {
    warnings.push(warn('weight-based-bag', 'Weight-based soil bags are only rough estimates because soil density varies by moisture and material. Use the package volume when possible.'));
  }

  const bagVolumeFt3 = volumeToFt3(input.bagSize, input.bagUnit);
  if (input.bagSize <= 0) warnings.push(warn('bag-size-zero', 'Bag size must be greater than zero.', 'critical'));

  if (requiredVolumeFt3 <= 0 || bagVolumeFt3 <= 0) {
    return {
      bagVolumeFt3,
      rawBags: 0,
      bagsNeeded: 0,
      leftoverFt3: 0,
      totalCost: input.bagPrice === undefined ? undefined : 0,
      currency: input.currency,
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
    warnings,
  };
}
