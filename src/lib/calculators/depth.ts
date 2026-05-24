import { CROPS } from './spacing';

export interface DepthSuitabilityResult {
  status: 'good' | 'borderline' | 'notIdeal';
  message: string;
  recommendedDepthRange?: [number, number];
}

export function checkDepthSuitability(depthInches: number, cropId: string): DepthSuitabilityResult {
  const crop = CROPS.find((candidate) => candidate.id === cropId);

  if (!crop) {
    if (depthInches >= 12) return { status: 'good', message: 'This depth is generally workable for many raised bed crops.' };
    if (depthInches >= 6) return { status: 'borderline', message: 'This can work for shallow greens and herbs, but deeper beds are more flexible.' };
    return { status: 'notIdeal', message: 'This is shallow for most raised bed crops.' };
  }

  const minimum = crop.minDepthInches ?? 6;
  const ideal = crop.idealDepthInches;

  if (ideal && depthInches >= ideal[0]) {
    return { status: 'good', message: `${crop.name} is generally suitable at this depth as a planning estimate.`, recommendedDepthRange: ideal };
  }

  if (depthInches >= minimum) {
    return { status: 'borderline', message: `${crop.name} may work, but a deeper bed is usually safer.`, recommendedDepthRange: ideal };
  }

  return { status: 'notIdeal', message: `${crop.name} usually needs more depth than this.`, recommendedDepthRange: ideal };
}
