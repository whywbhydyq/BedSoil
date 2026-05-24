import { calculateSoilBags, SoilBagInput } from './bags';
import { CurrencyCode } from './units';
import type { CalculatorWarning } from './warnings';
import { warn } from './warnings';

export interface BulkSoilInput {
  pricePerCubicYard: number;
  deliveryFee: number;
  minimumOrderYards: number;
  currency?: CurrencyCode;
}

export interface BulkComparisonResult {
  bagTotalCost: number;
  bulkTotalCost: number;
  requiredYd3: number;
  bulkOrderYd3: number;
  bagCostPerFt3: number;
  bulkCostPerFt3: number;
  savings: number;
  overbuyFt3: number;
  currency?: CurrencyCode;
  recommendation: 'bulk' | 'bags' | 'tie';
  warnings: CalculatorWarning[];
}

export function compareBulkVsBags(requiredVolumeFt3: number, bagInput: SoilBagInput, bulkInput: BulkSoilInput): BulkComparisonResult {
  const bagResult = calculateSoilBags(requiredVolumeFt3, bagInput);
  const requiredYd3 = requiredVolumeFt3 / 27;
  const bulkOrderYd3 = Math.max(requiredYd3, Math.max(0, bulkInput.minimumOrderYards));
  const bulkTotalCost = bulkOrderYd3 * Math.max(0, bulkInput.pricePerCubicYard) + Math.max(0, bulkInput.deliveryFee);
  const bagTotalCost = bagResult.totalCost ?? 0;
  const savings = bagTotalCost - bulkTotalCost;
  const overbuyFt3 = bulkOrderYd3 * 27 - requiredVolumeFt3;
  const warnings: CalculatorWarning[] = [...bagResult.warnings];

  if (requiredVolumeFt3 < 10) warnings.push(warn('bulk-small-volume', 'For small volumes under 10 ft³, bagged soil is often more practical than bulk delivery.', 'info'));
  if (overbuyFt3 > requiredVolumeFt3 && bulkInput.minimumOrderYards > requiredYd3) warnings.push(warn('bulk-minimum-overbuy', 'Your minimum bulk order is much larger than the required volume.'));
  if (bulkInput.deliveryFee > bulkOrderYd3 * bulkInput.pricePerCubicYard && bulkInput.deliveryFee > 0) warnings.push(warn('bulk-delivery-heavy', 'Delivery costs more than the soil itself. Check local options.'));

  return {
    bagTotalCost,
    bulkTotalCost,
    requiredYd3,
    bulkOrderYd3,
    bagCostPerFt3: bagInput.bagPrice && bagResult.bagVolumeFt3 > 0 ? bagInput.bagPrice / bagResult.bagVolumeFt3 : 0,
    bulkCostPerFt3: bulkOrderYd3 > 0 ? bulkTotalCost / (bulkOrderYd3 * 27) : 0,
    savings,
    overbuyFt3,
    currency: bulkInput.currency ?? bagInput.currency,
    recommendation: savings > 0.01 ? 'bulk' : savings < -0.01 ? 'bags' : 'tie',
    warnings,
  };
}
