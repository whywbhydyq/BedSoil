import { CurrencyCode } from './units';
import type { CalculatorWarning } from './warnings';
import { warn } from './warnings';

export interface RaisedBedCostInput {
  soilCost: number;
  lumberOrKitCost: number;
  compostCost: number;
  mulchCost: number;
  hardwareCost: number;
  deliveryFee: number;
  taxPercent: number;
  numberOfBeds: number;
  currency?: CurrencyCode;
}

export interface RaisedBedCostResult {
  subtotal: number;
  tax: number;
  total: number;
  costPerBed: number;
  currency?: CurrencyCode;
  warnings: CalculatorWarning[];
}

function safeCost(value: number): number {
  return Math.max(0, Number.isFinite(value) ? value : 0);
}

export function estimateRaisedBedProjectCost(input: RaisedBedCostInput): RaisedBedCostResult {
  const count = Math.max(0, Math.floor(Number.isFinite(input.numberOfBeds) ? input.numberOfBeds : 0));
  const materialSubtotal = safeCost(input.soilCost)
    + safeCost(input.lumberOrKitCost)
    + safeCost(input.compostCost)
    + safeCost(input.mulchCost)
    + safeCost(input.hardwareCost)
    + safeCost(input.deliveryFee);
  const tax = materialSubtotal * safeCost(input.taxPercent) / 100;
  const total = materialSubtotal + tax;
  const warnings: CalculatorWarning[] = [];
  if (count <= 0) warnings.push(warn('cost-bed-count-zero', 'Cost per bed needs at least one bed. Set bed count above zero or treat this as a project-only subtotal.', 'critical'));
  if (input.deliveryFee > materialSubtotal * 0.5 && input.deliveryFee > 0) warnings.push(warn('cost-delivery-heavy', 'Delivery fee is a large share of the project estimate. Check pickup or local bulk options.', 'info'));
  return { subtotal: materialSubtotal, tax, total, costPerBed: count > 0 ? total / count : 0, currency: input.currency, warnings };
}
