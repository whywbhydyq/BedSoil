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

export function estimateRaisedBedProjectCost(input: RaisedBedCostInput): RaisedBedCostResult {
  const count = Math.max(1, Math.floor(input.numberOfBeds || 1));
  const materialSubtotal = Math.max(0, input.soilCost)
    + Math.max(0, input.lumberOrKitCost)
    + Math.max(0, input.compostCost)
    + Math.max(0, input.mulchCost)
    + Math.max(0, input.hardwareCost)
    + Math.max(0, input.deliveryFee);
  const tax = materialSubtotal * Math.max(0, input.taxPercent || 0) / 100;
  const total = materialSubtotal + tax;
  const warnings: CalculatorWarning[] = [];
  if (input.deliveryFee > materialSubtotal * 0.5 && input.deliveryFee > 0) warnings.push(warn('cost-delivery-heavy', 'Delivery fee is a large share of the project estimate. Check pickup or local bulk options.', 'info'));
  return { subtotal: materialSubtotal, tax, total, costPerBed: total / count, currency: input.currency, warnings };
}
