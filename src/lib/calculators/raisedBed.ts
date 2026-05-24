import { LengthUnit, lengthToFeet, makeVolumeResult } from './units';
import { warn } from './warnings';

export interface RaisedBedInput {
  shape?: 'rectangle' | 'square';
  length: number;
  width: number;
  depth: number;
  lengthUnit: LengthUnit;
  widthUnit: LengthUnit;
  depthUnit: LengthUnit;
  numberOfBeds: number;
  freeboard: number;
  freeboardUnit: LengthUnit;
  settlingAllowancePercent: number;
}

export function calculateRaisedBedVolume(input: RaisedBedInput) {
  const warnings = [];
  const lengthFt = lengthToFeet(input.length, input.lengthUnit);
  const widthFt = lengthToFeet(input.width, input.widthUnit);
  const depthFt = lengthToFeet(input.depth, input.depthUnit);
  const freeboardFt = lengthToFeet(input.freeboard, input.freeboardUnit);

  if (input.depthUnit === 'ft' && input.depth > 3) warnings.push(warn('depth-ft-unusually-high', 'Depth is entered in feet and looks unusually deep. Did you mean inches?'));
  if (input.depthUnit === 'in' && input.depth > 36) warnings.push(warn('depth-in-unusually-high', 'Depth is over 36 inches. Check the unit.'));
  if (input.settlingAllowancePercent > 30) warnings.push(warn('settling-high', 'Settling allowance above 30% is unusual; most estimates use 10–15%.'));
  if (input.length <= 0 || input.width <= 0 || input.depth <= 0) warnings.push(warn('missing-dimensions', 'Enter a length, width, and depth greater than zero to calculate soil volume.', 'critical'));

  const numberOfBeds = Math.max(1, Math.floor(input.numberOfBeds || 1));
  const effectiveDepthFt = Math.max(depthFt - freeboardFt, 0);
  const baseVolumeFt3 = Math.max(0, lengthFt) * Math.max(0, widthFt) * effectiveDepthFt * numberOfBeds;
  const finalVolumeFt3 = baseVolumeFt3 * (1 + Math.max(0, input.settlingAllowancePercent || 0) / 100);

  return makeVolumeResult(baseVolumeFt3, finalVolumeFt3, warnings);
}
