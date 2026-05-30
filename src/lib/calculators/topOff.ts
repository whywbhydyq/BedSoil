import { LengthUnit, lengthToFeet, makeVolumeResult } from './units';

export interface AnnualTopOffInput {
  length: number;
  width: number;
  topOffDepth: number;
  lengthUnit: LengthUnit;
  widthUnit: LengthUnit;
  topOffDepthUnit: LengthUnit;
  numberOfBeds: number;
}

export function calculateAnnualTopOff(input: AnnualTopOffInput) {
  const volumeFt3 = lengthToFeet(input.length, input.lengthUnit)
    * lengthToFeet(input.width, input.widthUnit)
    * lengthToFeet(input.topOffDepth, input.topOffDepthUnit)
    * Math.max(0, Math.floor(Number.isFinite(input.numberOfBeds) ? input.numberOfBeds : 0));
  return makeVolumeResult(volumeFt3);
}

export interface TopOffMaterialsResult {
  topOffVolumeFt3: number;
  compostFt3: number;
  soilFt3: number;
  optionalMulchFt3: number;
}

export function calculateTopOffMaterials(topOffVolumeFt3: number, compostPercent = 100, optionalMulchDepthEquivalentPercent = 0): TopOffMaterialsResult {
  const safeVolume = Math.max(0, Number.isFinite(topOffVolumeFt3) ? topOffVolumeFt3 : 0);
  const compostShare = Math.min(100, Math.max(0, compostPercent)) / 100;
  const mulchShare = Math.min(100, Math.max(0, optionalMulchDepthEquivalentPercent)) / 100;
  return {
    topOffVolumeFt3: safeVolume,
    compostFt3: safeVolume * compostShare,
    soilFt3: safeVolume * (1 - compostShare),
    optionalMulchFt3: safeVolume * mulchShare,
  };
}
