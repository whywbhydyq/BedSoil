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
  recommendation: 'bulk' | 'bags' | 'tie';
  warnings: CalculatorWarning[];
}

export function compareBulkVsBags(requiredVolumeFt3: number, bagInput: SoilBagInput, bulkInput: BulkSoilInput): BulkComparisonResult {
  const fulfillmentMode = bulkInput.fulfillmentMode ?? 'delivery';
  const truckAvailability = bulkInput.truckAvailability ?? 'unknown';
  const bagResult = calculateSoilBags(requiredVolumeFt3, bagInput);
  const requiredYd3 = requiredVolumeFt3 / 27;
  const bulkOrderYd3 = Math.max(requiredYd3, Math.max(0, bulkInput.minimumOrderYards));
  const serviceCost = fulfillmentMode === 'pickup'
    ? Math.max(0, bulkInput.pickupTripCost ?? 0)
    : Math.max(0, bulkInput.deliveryFee);
  const bulkTotalCost = bulkOrderYd3 * Math.max(0, bulkInput.pricePerCubicYard) + serviceCost;
  const bagTotalCost = bagResult.totalCost ?? 0;
  const savings = bagTotalCost - bulkTotalCost;
  const overbuyFt3 = bulkOrderYd3 * 27 - requiredVolumeFt3;
  const warnings: CalculatorWarning[] = [...bagResult.warnings];

  if (!bagResult.canEstimateBags) {
    warnings.push(warn('bulk-bag-volume-required', 'Bagged-soil cost comparison needs a package volume. Weight-only bags cannot produce a reliable bag count.', 'critical'));
  }
  if (requiredVolumeFt3 < 10) warnings.push(warn('bulk-small-volume', 'For small volumes under 10 ft³, bagged soil is often more practical than bulk delivery.', 'info'));
  if (overbuyFt3 > requiredVolumeFt3 && bulkInput.minimumOrderYards > requiredYd3) warnings.push(warn('bulk-minimum-overbuy', 'Your minimum bulk order is much larger than the required volume.'));
  if (fulfillmentMode === 'delivery' && bulkInput.deliveryFee > bulkOrderYd3 * bulkInput.pricePerCubicYard && bulkInput.deliveryFee > 0) warnings.push(warn('bulk-delivery-heavy', 'Delivery costs more than the soil itself. Check pickup or local options.'));
  if (fulfillmentMode === 'pickup' && truckAvailability === 'notAvailable') warnings.push(warn('bulk-pickup-no-truck', 'Pickup is selected, but no truck or trailer is available. Delivery or bagged soil may be more practical.', 'critical'));
  if (fulfillmentMode === 'pickup' && truckAvailability === 'unknown') warnings.push(warn('bulk-pickup-truck-check', 'Pickup is selected. Confirm your vehicle can safely carry the bulk volume and weight before ordering.', 'info'));
  if (fulfillmentMode === 'pickup' && bulkOrderYd3 > 1.5) warnings.push(warn('bulk-pickup-large-order', 'This is a large pickup order. Confirm payload limits, loading method, and whether multiple trips are needed.', 'info'));

  return {
    bagTotalCost,
    bulkTotalCost,
    requiredYd3,
    bulkOrderYd3,
    bagCostPerFt3: bagInput.bagPrice && bagResult.bagVolumeFt3 > 0 ? bagInput.bagPrice / bagResult.bagVolumeFt3 : 0,
    bulkCostPerFt3: bulkOrderYd3 > 0 ? bulkTotalCost / (bulkOrderYd3 * 27) : 0,
    savings,
    overbuyFt3,
    fulfillmentMode,
    serviceCost,
    truckAvailability,
    currency: bulkInput.currency ?? bagInput.currency,
    recommendation: !bagResult.canEstimateBags ? 'bags' : savings > 0.01 ? 'bulk' : savings < -0.01 ? 'bags' : 'tie',
    warnings,
  };
}
