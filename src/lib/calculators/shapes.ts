import { LengthUnit, lengthToFeet, makeVolumeResult } from './units';
import { warn } from './warnings';

export interface RoundRaisedBedInput {
  diameter: number;
  depth: number;
  unit: LengthUnit;
  depthUnit: LengthUnit;
  numberOfBeds: number;
  settlingAllowancePercent: number;
}

export interface LShapedRaisedBedInput {
  outerLength: number;
  outerWidth: number;
  cutoutLength: number;
  cutoutWidth: number;
  depth: number;
  unit: LengthUnit;
  depthUnit: LengthUnit;
  numberOfBeds: number;
  settlingAllowancePercent: number;
}

export interface UShapedRaisedBedInput {
  outerLength: number;
  outerWidth: number;
  innerLength: number;
  innerWidth: number;
  depth: number;
  unit: LengthUnit;
  depthUnit: LengthUnit;
  numberOfBeds: number;
  settlingAllowancePercent: number;
}

function applySettling(baseVolumeFt3: number, settlingAllowancePercent: number): number {
  return baseVolumeFt3 * (1 + Math.max(0, settlingAllowancePercent || 0) / 100);
}

function shapeCount(value: number): number {
  return Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));
}

export function calculateRoundRaisedBedVolume(input: RoundRaisedBedInput) {
  const diameterFt = lengthToFeet(input.diameter, input.unit);
  const depthFt = lengthToFeet(input.depth, input.depthUnit);
  const radiusFt = Math.max(0, diameterFt) / 2;
  const count = shapeCount(input.numberOfBeds);
  const base = Math.PI * radiusFt * radiusFt * Math.max(0, depthFt) * count;
  return makeVolumeResult(base, applySettling(base, input.settlingAllowancePercent), [warn('round-bed-estimate', 'Round raised bed volume is calculated as a cylinder planning estimate.', 'info')]);
}

export function calculateLShapedRaisedBedVolume(input: LShapedRaisedBedInput) {
  const outerLengthFt = lengthToFeet(input.outerLength, input.unit);
  const outerWidthFt = lengthToFeet(input.outerWidth, input.unit);
  const cutoutLengthFt = lengthToFeet(input.cutoutLength, input.unit);
  const cutoutWidthFt = lengthToFeet(input.cutoutWidth, input.unit);
  const depthFt = lengthToFeet(input.depth, input.depthUnit);
  const surfaceFt2 = Math.max(0, outerLengthFt * outerWidthFt - cutoutLengthFt * cutoutWidthFt);
  const count = shapeCount(input.numberOfBeds);
  const base = surfaceFt2 * Math.max(0, depthFt) * count;
  return makeVolumeResult(base, applySettling(base, input.settlingAllowancePercent), [warn('l-shape-approximation', 'L-shaped bed volume subtracts one rectangular cutout from an outer rectangle.', 'info')]);
}

export function calculateUShapedRaisedBedVolume(input: UShapedRaisedBedInput) {
  const outerLengthFt = lengthToFeet(input.outerLength, input.unit);
  const outerWidthFt = lengthToFeet(input.outerWidth, input.unit);
  const innerLengthFt = lengthToFeet(input.innerLength, input.unit);
  const innerWidthFt = lengthToFeet(input.innerWidth, input.unit);
  const depthFt = lengthToFeet(input.depth, input.depthUnit);
  const surfaceFt2 = Math.max(0, outerLengthFt * outerWidthFt - innerLengthFt * innerWidthFt);
  const count = shapeCount(input.numberOfBeds);
  const base = surfaceFt2 * Math.max(0, depthFt) * count;
  return makeVolumeResult(base, applySettling(base, input.settlingAllowancePercent), [warn('u-shape-approximation', 'U-shaped bed volume subtracts the inner empty rectangle from the outer rectangle.', 'info')]);
}
