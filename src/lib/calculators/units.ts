import type { CalculatorWarning } from './warnings';

export type LengthUnit = 'in' | 'ft' | 'cm' | 'm';
export type VolumeUnit = 'ft3' | 'yd3' | 'liter' | 'dryQuart' | 'gallon';
export type BagUnit = VolumeUnit | 'lb' | 'kg';
export type CurrencyCode = 'USD' | 'CAD' | 'GBP' | 'AUD' | 'EUR';

export const FT3_PER_YD3 = 27;
export const LITERS_PER_FT3 = 28.316846592;
export const DRY_QUARTS_PER_FT3 = 25.71404638;
export const GALLONS_PER_FT3 = 7.48051948;
export const FT3_PER_GALLON = 0.133680556;
export const CUBIC_INCHES_PER_FT3 = 1728;

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: '$',
  CAD: 'C$',
  GBP: '£',
  AUD: 'A$',
  EUR: '€',
};

export function currencySymbol(currency: CurrencyCode): string {
  return CURRENCY_SYMBOLS[currency] ?? '$';
}

export function lengthToFeet(value: number, unit: LengthUnit): number {
  if (!Number.isFinite(value)) return 0;
  switch (unit) {
    case 'ft': return value;
    case 'in': return value / 12;
    case 'cm': return value / 30.48;
    case 'm': return value * 3.280839895;
  }
}

export function volumeToFt3(value: number, unit: VolumeUnit | BagUnit): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  switch (unit) {
    case 'ft3': return value;
    case 'yd3': return value * FT3_PER_YD3;
    case 'liter': return value / LITERS_PER_FT3;
    case 'dryQuart': return value / DRY_QUARTS_PER_FT3;
    case 'gallon': return value * FT3_PER_GALLON;
    case 'lb':
    case 'kg':
      return 0;
  }
}

export function ft3ToYd3(value: number): number { return value / FT3_PER_YD3; }
export function ft3ToLiters(value: number): number { return value * LITERS_PER_FT3; }
export function ft3ToDryQuarts(value: number): number { return value * DRY_QUARTS_PER_FT3; }
export function ft3ToGallons(value: number): number { return value * GALLONS_PER_FT3; }

export interface VolumeResult {
  baseVolumeFt3: number;
  finalVolumeFt3: number;
  volumeYd3: number;
  volumeLiters: number;
  volumeDryQuarts: number;
  volumeGallons: number;
  warnings: CalculatorWarning[];
}

export function makeVolumeResult(baseVolumeFt3: number, finalVolumeFt3 = baseVolumeFt3, warnings: CalculatorWarning[] = []): VolumeResult {
  return {
    baseVolumeFt3,
    finalVolumeFt3,
    volumeYd3: ft3ToYd3(finalVolumeFt3),
    volumeLiters: ft3ToLiters(finalVolumeFt3),
    volumeDryQuarts: ft3ToDryQuarts(finalVolumeFt3),
    volumeGallons: ft3ToGallons(finalVolumeFt3),
    warnings,
  };
}
