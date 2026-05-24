import { LengthUnit, FT3_PER_GALLON, lengthToFeet, makeVolumeResult } from './units';
import { warn } from './warnings';

export interface GrowBagInput { gallons: number; quantity: number; }
export interface RoundPotInput { diameter: number; height: number; unit: LengthUnit; quantity: number; }
export interface TaperedPotInput { topDiameter: number; bottomDiameter: number; height: number; unit: LengthUnit; quantity: number; }
export interface RectangularPlanterInput { length: number; width: number; depth: number; unit: LengthUnit; quantity: number; }

function qty(value: number): number { return Math.max(1, Math.floor(value || 1)); }

export function calculateGrowBagVolume(input: GrowBagInput) {
  const volumeFt3 = Math.max(0, input.gallons) * FT3_PER_GALLON * qty(input.quantity);
  return makeVolumeResult(volumeFt3, volumeFt3, [warn('grow-bag-nominal', 'Grow bag listed capacity and real filled volume can vary by brand, fabric shape, compaction, and fill level.', 'info')]);
}

export function calculateRoundPotVolume(input: RoundPotInput) {
  const radiusFt = lengthToFeet(input.diameter, input.unit) / 2;
  const heightFt = lengthToFeet(input.height, input.unit);
  return makeVolumeResult(Math.PI * radiusFt * radiusFt * heightFt * qty(input.quantity));
}

export function calculateTaperedPotVolume(input: TaperedPotInput) {
  const topRadiusFt = lengthToFeet(input.topDiameter, input.unit) / 2;
  const bottomRadiusFt = lengthToFeet(input.bottomDiameter, input.unit) / 2;
  const heightFt = lengthToFeet(input.height, input.unit);
  const volumeFt3 = (Math.PI * heightFt / 3) * (topRadiusFt ** 2 + topRadiusFt * bottomRadiusFt + bottomRadiusFt ** 2) * qty(input.quantity);
  return makeVolumeResult(volumeFt3);
}

export function calculateRectangularPlanterVolume(input: RectangularPlanterInput) {
  const volumeFt3 = lengthToFeet(input.length, input.unit) * lengthToFeet(input.width, input.unit) * lengthToFeet(input.depth, input.unit) * qty(input.quantity);
  return makeVolumeResult(volumeFt3);
}
