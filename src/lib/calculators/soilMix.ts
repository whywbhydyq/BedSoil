import { calculateSoilBags } from './bags';
import { BagUnit, ft3ToLiters } from './units';
import type { CalculatorWarning } from './warnings';
import { warn } from './warnings';

export interface SoilMixComponent {
  id: string;
  name: string;
  ratioPercent: number;
  bagSize?: number;
  bagUnit?: BagUnit;
  bagPrice?: number;
}

export interface SoilMixInput {
  templateId: string;
  components: readonly SoilMixComponent[];
}

export interface MixBreakdownResult {
  componentId: string;
  name: string;
  ratioPercent: number;
  volumeFt3: number;
  volumeYd3: number;
  volumeLiters: number;
  bagsNeeded?: number;
  cost?: number;
  warnings: CalculatorWarning[];
}

function safeRatio(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateSoilMix(totalVolumeFt3: number, input: SoilMixInput): MixBreakdownResult[] {
  const safeTotalVolumeFt3 = Math.max(0, Number.isFinite(totalVolumeFt3) ? totalVolumeFt3 : 0);
  const normalizedComponents = input.components.map((component) => ({ ...component, ratioPercent: safeRatio(component.ratioPercent) }));
  const sum = normalizedComponents.reduce((total, component) => total + component.ratioPercent, 0);
  const baseWarnings: CalculatorWarning[] = [];

  if (input.components.some((component) => !Number.isFinite(component.ratioPercent))) baseWarnings.push(warn('mix-non-finite-ratio', 'Soil mix percentages must be finite numbers.', 'critical'));
  if (normalizedComponents.some((component) => component.ratioPercent < 0)) baseWarnings.push(warn('mix-negative-ratio', 'Soil mix percentages cannot be negative.', 'critical'));
  if (Math.abs(sum - 100) > 0.01) baseWarnings.push(warn('mix-not-100', 'Soil mix percentages must add up to 100%.', 'critical'));
  if (normalizedComponents.some((component) => /compost|manure/i.test(component.name) && component.ratioPercent > 50)) {
    baseWarnings.push(warn('compost-over-50', 'Compost or manure above 50% may not suit all crops or local soil conditions.'));
  }

  return normalizedComponents.map((component) => {
    const volumeFt3 = baseWarnings.some((item) => item.severity === 'critical') ? 0 : safeTotalVolumeFt3 * Math.max(0, component.ratioPercent) / 100;
    const bag = component.bagSize && component.bagUnit
      ? calculateSoilBags(volumeFt3, { bagSize: component.bagSize, bagUnit: component.bagUnit, bagPrice: component.bagPrice })
      : undefined;

    return {
      componentId: component.id,
      name: component.name,
      ratioPercent: component.ratioPercent,
      volumeFt3,
      volumeYd3: volumeFt3 / 27,
      volumeLiters: ft3ToLiters(volumeFt3),
      bagsNeeded: bag?.bagsNeeded,
      cost: bag?.totalCost,
      warnings: [...baseWarnings, ...(bag?.warnings ?? [])],
    };
  });
}
