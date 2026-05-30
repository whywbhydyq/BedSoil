import { calculateSoilBags, SoilBagInput } from './bags';
import { CurrencyCode } from './units';
import type { CalculatorWarning } from './warnings';
import { warn } from './warnings';

export type BulkFulfillmentMode = 'delivery' | 'pickup';
export type TruckAvailability = 'unknown' | 'available' | 'notAvailable';

export interface BulkSoilInput {
  pricePerCubicYard: number;
  deliveryFee: number;
  minimumOrderYards: number;
  pickupTripCost?: number;
  fulfillmentMode?: BulkFulfillmentMode;
  truckAvailability?: TruckAvailability;
  currency?: CurrencyCode;
}

function safeNonNegative(value: number | undefined): number {
  return Number.isFinite(value) ? Math.max(0, value as number) : 0;
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
  fulfillmentMode: BulkFulfillmentMode;
  serviceCost: number;
  truckAvailability: TruckAvailability;
  currency?: CurrencyCode;
  recommendation: 'bulk' | 'bags' | 'tie' | 'notComparable';
  warnings: CalculatorWarning[];
}

export function compareBulkVsBags(requiredVolumeFt3: number, bagInput: SoilBagInput, bulkInput: BulkSoilInput): BulkComparisonResult {
  const fulfillmentMode = bulkInput.fulfillmentMode ?? 'delivery';
  const truckAvailability = bulkInput.truckAvailability ?? 'unknown';
  const safeRequiredVolumeFt3 = safeNonNegative(requiredVolumeFt3);
  const safeMinimumOrderYards = safeNonNegative(bulkInput.minimumOrderYards);
  const safePricePerCubicYard = safeNonNegative(bulkInput.pricePerCubicYard);
  const safeDeliveryFee = safeNonNegative(bulkInput.deliveryFee);
  const safePickupTripCost = safeNonNegative(bulkInput.pickupTripCost);
  const bagResult = calculateSoilBags(safeRequiredVolumeFt3, bagInput);
  const requiredYd3 = safeRequiredVolumeFt3 / 27;
  const warnings: CalculatorWarning[] = [...bagResult.warnings];

  if (safeRequiredVolumeFt3 <= 0) {
    warnings.push(warn('bulk-zero-volume', 'Bulk order comparison needs a positive soil volume. Enter dimensions or a manual volume before comparing delivery or pickup.', 'critical'));
    return {
      bagTotalCost: bagResult.totalCost ?? 0,
      bulkTotalCost: 0,
      requiredYd3,
      bulkOrderYd3: 0,
      bagCostPerFt3: bagInput.bagPrice !== undefined && bagResult.bagVolumeFt3 > 0 ? safeNonNegative(bagInput.bagPrice) / bagResult.bagVolumeFt3 : 0,
      bulkCostPerFt3: 0,
      savings: 0,
      overbuyFt3: 0,
      fulfillmentMode,
      serviceCost: 0,
      truckAvailability,
      currency: bulkInput.currency ?? bagInput.currency,
      recommendation: 'notComparable',
      warnings,
    };
  }

  const bulkOrderYd3 = Math.max(requiredYd3, safeMinimumOrderYards);
  const serviceCost = fulfillmentMode === 'pickup' ? safePickupTripCost : safeDeliveryFee;
  const bulkTotalCost = bulkOrderYd3 * safePricePerCubicYard + serviceCost;
  const bagTotalCost = bagResult.totalCost ?? 0;
  const savings = bagResult.canEstimateBags ? bagTotalCost - bulkTotalCost : 0;
  const overbuyFt3 = bulkOrderYd3 * 27 - safeRequiredVolumeFt3;

  if (!bagResult.canEstimateBags) {
    warnings.push(warn('bulk-bag-volume-required', 'Bagged-soil cost comparison needs a package volume. Weight-only bags cannot produce a reliable bag count or cost comparison.', 'critical'));
  }
  if (safeRequiredVolumeFt3 < 10) warnings.push(warn('bulk-small-volume', 'For small volumes under 10 ft³, bagged soil is often more practical than bulk delivery.', 'info'));
  if (overbuyFt3 > safeRequiredVolumeFt3 && safeMinimumOrderYards > requiredYd3) warnings.push(warn('bulk-minimum-overbuy', 'Your minimum bulk order is much larger than the required volume.'));
  if (fulfillmentMode === 'delivery' && safeDeliveryFee > bulkOrderYd3 * safePricePerCubicYard && safeDeliveryFee > 0) warnings.push(warn('bulk-delivery-heavy', 'Delivery costs more than the soil itself. Check pickup or local options.'));
  if (fulfillmentMode === 'pickup' && truckAvailability === 'notAvailable') warnings.push(warn('bulk-pickup-no-truck', 'Pickup is selected, but no truck or trailer is available. Delivery or bagged soil may be more practical.', 'critical'));
  if (fulfillmentMode === 'pickup' && truckAvailability === 'unknown') warnings.push(warn('bulk-pickup-truck-check', 'Pickup is selected. Confirm your vehicle can safely carry the bulk volume and weight before ordering.', 'info'));
  if (fulfillmentMode === 'pickup' && bulkOrderYd3 > 1.5) warnings.push(warn('bulk-pickup-large-order', 'This is a large pickup order. Confirm payload limits, loading method, and whether multiple trips are needed.', 'info'));

  return {
    bagTotalCost,
    bulkTotalCost,
    requiredYd3,
    bulkOrderYd3,
    bagCostPerFt3: bagInput.bagPrice !== undefined && bagResult.bagVolumeFt3 > 0 ? safeNonNegative(bagInput.bagPrice) / bagResult.bagVolumeFt3 : 0,
    bulkCostPerFt3: bulkOrderYd3 > 0 ? bulkTotalCost / (bulkOrderYd3 * 27) : 0,
    savings,
    overbuyFt3,
    fulfillmentMode,
    serviceCost,
    truckAvailability,
    currency: bulkInput.currency ?? bagInput.currency,
    recommendation: !bagResult.canEstimateBags ? 'notComparable' : savings > 0.01 ? 'bulk' : savings < -0.01 ? 'bags' : 'tie',
    warnings,
  };
}
