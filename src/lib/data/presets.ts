import type { SoilMixInput } from '@/lib/calculators/soilMix';

export const RAISED_BED_PRESETS = [6, 8, 10, 12, 18, 24] as const;

export const BAG_PRESETS = [
  { label: '40 dry qt', size: 40, unit: 'dryQuart' },
  { label: '1 cu ft', size: 1, unit: 'ft3' },
  { label: '1.5 cu ft', size: 1.5, unit: 'ft3' },
  { label: '2 cu ft', size: 2, unit: 'ft3' },
  { label: '3 cu ft', size: 3, unit: 'ft3' },
  { label: '50 L', size: 50, unit: 'liter' },
] as const;

export const SOIL_MIX_TEMPLATES = {
  basic: {
    templateId: 'basic',
    components: [
      { id: 'topsoil', name: 'Topsoil', ratioPercent: 60 },
      { id: 'compost', name: 'Compost', ratioPercent: 30 },
      { id: 'pottingMix', name: 'Potting mix', ratioPercent: 10 },
    ],
  },
  soilless: {
    templateId: 'soilless',
    components: [
      { id: 'compost', name: 'Compost', ratioPercent: 50 },
      { id: 'soillessMix', name: 'Soilless growing mix', ratioPercent: 50 },
    ],
  },
  melsMix: {
    templateId: 'melsMix',
    components: [
      { id: 'compost', name: 'Blended compost', ratioPercent: 33.33 },
      { id: 'coir', name: 'Peat moss or coco coir', ratioPercent: 33.33 },
      { id: 'vermiculite', name: 'Vermiculite or perlite', ratioPercent: 33.34 },
    ],
  },
  budgetFill: {
    templateId: 'budgetFill',
    components: [
      { id: 'lower', name: 'Lower filler material', ratioPercent: 40 },
      { id: 'topsoil', name: 'Topsoil', ratioPercent: 35 },
      { id: 'compost', name: 'Compost', ratioPercent: 25 },
    ],
  },
} satisfies Record<string, SoilMixInput>;
