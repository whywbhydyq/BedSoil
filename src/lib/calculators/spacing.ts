export interface CropSpacing {
  id: string;
  name: string;
  plantsPerSquareFoot: number | [number, number];
  minDepthInches?: number;
  idealDepthInches?: [number, number];
  notes: string;
  basis: string;
  sourceNote?: string;
  warning?: string;
}

export const CROPS: CropSpacing[] = [
  { id: 'tomato', name: 'Tomato', plantsPerSquareFoot: 1, minDepthInches: 12, idealDepthInches: [12, 24], notes: 'Use a cage, trellis, or wider spacing for vigorous varieties.', basis: 'Conservative square-foot planning assumption; large varieties may need wider spacing.', sourceNote: 'UMD Extension lists tomato spacing by growth habit and support rather than one fixed grid, so this 1-per-sq-ft estimate should be treated as compact-planning only.', warning: 'Large indeterminate tomato varieties may need more than one square foot.' },
  { id: 'pepper', name: 'Pepper', plantsPerSquareFoot: 1, minDepthInches: 10, idealDepthInches: [12, 18], notes: 'One plant per square foot is a conservative compact-bed estimate.', basis: 'Conservative square-foot planning assumption for compact pepper plants.', sourceNote: 'Raised-bed depth recommendations vary by surface, soil mix, watering, and cultivar; check local Extension guidance and the plant tag.' },
  { id: 'cucumber', name: 'Cucumber', plantsPerSquareFoot: [1, 2], minDepthInches: 8, idealDepthInches: [10, 18], notes: 'Trellis support is recommended for tighter spacing.', basis: 'Range reflects tighter trellised planting versus roomier layouts.', sourceNote: 'Raised bed depth and spacing depend on whether cucumbers are trellised and whether the bed sits over native soil or a hard surface.' },
  { id: 'lettuce', name: 'Lettuce', plantsPerSquareFoot: [2, 4], minDepthInches: 6, idealDepthInches: [6, 8], notes: 'Spacing depends on baby leaf versus full-head harvest.', basis: 'Range reflects baby-leaf harvest versus larger head lettuce spacing.', sourceNote: 'Use seed-packet spacing for the harvest style: baby leaf, cut-and-come-again, or full heads.' },
  { id: 'spinach', name: 'Spinach', plantsPerSquareFoot: 9, minDepthInches: 6, idealDepthInches: [6, 8], notes: 'A dense leafy-green estimate; thin or harvest young as needed.', basis: 'Dense leafy-green planning estimate; thin or harvest young as needed.', sourceNote: 'Dense greens estimates should be checked against seed-packet spacing and desired harvest size.' },
  { id: 'carrot', name: 'Carrot', plantsPerSquareFoot: [9, 16], minDepthInches: 8, idealDepthInches: [10, 12], notes: 'Short varieties need less depth than long varieties; thin seedlings for root room.', basis: 'Range reflects shorter carrot varieties versus longer roots needing looser depth.', sourceNote: 'UMN Extension emphasizes direct seeding, thinning, moisture, and loose soil for carrots; UMD notes variety root length affects shallow-bed suitability.' },
  { id: 'radish', name: 'Radish', plantsPerSquareFoot: 16, minDepthInches: 6, idealDepthInches: [6, 8], notes: 'A dense, short-cycle crop; long daikon types need more depth.', basis: 'Dense short-cycle root crop planning estimate.', sourceNote: 'UMN Extension distinguishes ordinary radish depth from long types such as daikon, which need deeper loosened soil.' },
  { id: 'basil', name: 'Basil', plantsPerSquareFoot: [1, 4], minDepthInches: 6, idealDepthInches: [8, 12], notes: 'Spacing depends on harvest style.', basis: 'Range reflects single large basil plants versus repeated small harvests.', sourceNote: 'Herb spacing depends on whether you grow one large plant or repeated small harvests.' },
  { id: 'beans', name: 'Beans', plantsPerSquareFoot: [4, 9], minDepthInches: 8, idealDepthInches: [8, 12], notes: 'Bush and pole beans differ.', basis: 'Range reflects bush/pole bean habit and support differences.', sourceNote: 'Use the seed packet to distinguish bush, pole, trellised, and row spacing.' },
  { id: 'kale', name: 'Kale', plantsPerSquareFoot: 1, minDepthInches: 8, idealDepthInches: [10, 12], notes: 'Large leaves need room.', basis: 'Conservative leafy brassica planning estimate.', sourceNote: 'Leaf size, harvest stage, and variety affect spacing; use this as a compact-bed starting point.' },
];

export interface SquareFootSpacingInput {
  lengthFt: number;
  widthFt: number;
  cropId: string;
  customPlantsPerSquare?: number;
}

export function calculateSquareFootSpacing(input: SquareFootSpacingInput) {
  const lengthSquares = Math.max(0, Math.floor(Number.isFinite(input.lengthFt) ? input.lengthFt : 0));
  const widthSquares = Math.max(0, Math.floor(Number.isFinite(input.widthFt) ? input.widthFt : 0));
  const totalSquares = lengthSquares * widthSquares;
  const crop = CROPS.find((candidate) => candidate.id === input.cropId);
  const plantsPerSquareFoot = input.customPlantsPerSquare === undefined ? crop?.plantsPerSquareFoot ?? 1 : (Number.isFinite(input.customPlantsPerSquare) ? Math.max(0, input.customPlantsPerSquare) : 0);
  const totalPlants = Array.isArray(plantsPerSquareFoot)
    ? [Math.floor(totalSquares * plantsPerSquareFoot[0]), Math.floor(totalSquares * plantsPerSquareFoot[1])] as [number, number]
    : Math.floor(totalSquares * plantsPerSquareFoot);

  return { totalSquares, crop, plantsPerSquareFoot, totalPlants, warning: crop?.warning };
}
