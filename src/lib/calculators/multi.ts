import type { RectangularPlanterInput } from './containers';
import { calculateRectangularPlanterVolume } from './containers';
import type { RaisedBedInput } from './raisedBed';
import { calculateRaisedBedVolume } from './raisedBed';
import { makeVolumeResult } from './units';

export function calculateMultipleRaisedBedVolume(inputs: RaisedBedInput[]) {
  const results = inputs.map(calculateRaisedBedVolume);
  const base = results.reduce((sum, result) => sum + result.baseVolumeFt3, 0);
  const final = results.reduce((sum, result) => sum + result.finalVolumeFt3, 0);
  const warnings = results.flatMap((result) => result.warnings);
  return makeVolumeResult(base, final, warnings);
}

export function calculateMultipleRectangularContainerVolume(inputs: RectangularPlanterInput[]) {
  const results = inputs.map(calculateRectangularPlanterVolume);
  const base = results.reduce((sum, result) => sum + result.baseVolumeFt3, 0);
  const final = results.reduce((sum, result) => sum + result.finalVolumeFt3, 0);
  const warnings = results.flatMap((result) => result.warnings);
  return makeVolumeResult(base, final, warnings);
}
