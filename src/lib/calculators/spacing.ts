export interface CropSpacing {
  id: string;
  name: string;
  plantsPerSquareFoot: number | [number, number];
  minDepthInches?: number;
  idealDepthInches?: [number, number];
  notes: string;
  warning?: string;
}

export const CROPS: CropSpacing[] = [
  { id: 'tomato', name: 'Tomato', plantsPerSquareFoot: 1, minDepthInches: 12, idealDepthInches: [12, 24], notes: 'Use a cage or trellis.', warning: 'Large indeterminate tomato varieties may need more than one square foot.' },
  { id: 'pepper', name: 'Pepper', plantsPerSquareFoot: 1, minDepthInches: 10, idealDepthInches: [12, 18], notes: 'One plant per square foot is a conservative estimate.' },
  { id: 'cucumber', name: 'Cucumber', plantsPerSquareFoot: [1, 2], minDepthInches: 8, idealDepthInches: [10, 18], notes: 'Trellis support is recommended for tighter spacing.' },
  { id: 'lettuce', name: 'Lettuce', plantsPerSquareFoot: [2, 4], minDepthInches: 6, idealDepthInches: [6, 8], notes: 'Spacing depends on baby leaf versus full-head harvest.' },
  { id: 'spinach', name: 'Spinach', plantsPerSquareFoot: 9, minDepthInches: 6, idealDepthInches: [6, 8], notes: 'A common square-foot gardening estimate.' },
  { id: 'carrot', name: 'Carrot', plantsPerSquareFoot: [9, 16], minDepthInches: 8, idealDepthInches: [10, 12], notes: 'Short varieties need less depth than long varieties.' },
  { id: 'radish', name: 'Radish', plantsPerSquareFoot: 16, minDepthInches: 6, idealDepthInches: [6, 8], notes: 'A dense, short-cycle crop.' },
  { id: 'basil', name: 'Basil', plantsPerSquareFoot: [1, 4], minDepthInches: 6, idealDepthInches: [8, 12], notes: 'Spacing depends on harvest style.' },
  { id: 'beans', name: 'Beans', plantsPerSquareFoot: [4, 9], minDepthInches: 8, idealDepthInches: [8, 12], notes: 'Bush and pole beans differ.' },
  { id: 'kale', name: 'Kale', plantsPerSquareFoot: 1, minDepthInches: 8, idealDepthInches: [10, 12], notes: 'Large leaves need room.' },
];

export interface SquareFootSpacingInput {
  lengthFt: number;
  widthFt: number;
  cropId: string;
  customPlantsPerSquare?: number;
}

export function calculateSquareFootSpacing(input: SquareFootSpacingInput) {
  const totalSquares = Math.max(0, Math.floor(input.lengthFt) * Math.floor(input.widthFt));
  const crop = CROPS.find((candidate) => candidate.id === input.cropId);
  const plantsPerSquareFoot = input.customPlantsPerSquare ?? crop?.plantsPerSquareFoot ?? 1;
  const totalPlants = Array.isArray(plantsPerSquareFoot)
    ? [Math.floor(totalSquares * plantsPerSquareFoot[0]), Math.floor(totalSquares * plantsPerSquareFoot[1])] as [number, number]
    : Math.floor(totalSquares * plantsPerSquareFoot);

  return { totalSquares, crop, plantsPerSquareFoot, totalPlants, warning: crop?.warning };
}
