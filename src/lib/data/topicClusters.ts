import { calculatorPages, type PageDefinition } from '@/lib/data/pages';
import { slugToTitle } from '@/lib/utils/format';

export type ClusterIntent = 'informational' | 'commercial' | 'transactional' | 'mixed';

export type TopicClusterSpoke = {
  slug: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  intent: ClusterIntent;
  template: 'calculator' | 'comparison' | 'how-to' | 'checklist' | 'explainer';
  linkAnchor: string;
  role: string;
};

export type TopicCluster = {
  id: string;
  name: string;
  pillarSlug: string;
  pillarKeyword: string;
  intent: ClusterIntent;
  summary: string;
  serpPattern: string;
  differentiator: string;
  recommendedHubCopy: string;
  spokes: TopicClusterSpoke[];
  adjacentClusterIds: string[];
};

export type ClusterLink = {
  from: string;
  to: string;
  type: 'pillar-to-spoke' | 'spoke-to-pillar' | 'sibling' | 'cross-cluster';
  anchor: string;
  placement: 'body' | 'hub-card' | 'next-step';
};

const pageMap = new Map(calculatorPages.map((page) => [page.slug, page]));


export const CLUSTER_SEED_KEYWORDS = [
  'raised bed soil calculator',
  'how much soil for 4x8 raised bed',
  '4x8 raised bed soil calculator',
  'how many bags of soil for raised bed',
  'soil bags calculator',
  '40 qt soil bag calculator',
  'cubic feet to soil bags calculator',
  'bulk soil vs bags calculator',
  'raised bed soil cost calculator',
  'cubic yards of soil for raised beds',
  'cheapest way to fill raised beds',
  'raised bed soil mix calculator',
  'compost topsoil mix calculator',
  'Mel’s Mix calculator',
  'how much compost for raised bed',
  'topsoil compost ratio raised bed',
  'container soil calculator',
  'grow bag soil calculator',
  '10 gallon grow bag soil calculator',
  'planter soil volume calculator',
  'square foot garden spacing calculator',
  '4x8 raised bed planting layout',
  'how many tomato plants in 4x8 raised bed',
  'raised bed depth calculator',
  'raised bed depth for tomatoes',
  'raised bed depth for carrots',
  'annual raised bed top off calculator',
  'spring raised bed checklist',
  'fall raised bed soil checklist',
  'round raised bed soil calculator',
  'L shaped raised bed soil calculator',
  'U shaped raised bed soil calculator',
  'multiple raised bed soil calculator',
  '3x6 raised bed soil calculator',
  '8x4 raised bed soil calculator',
  'liters to cubic feet soil calculator',
] as const;

export const SERP_CLUSTER_EVIDENCE = [
  'Calculator SERPs overlap across raised-bed volume, bag count, and retail estimator pages, so fixed-size volume pages should link directly into bag and bulk-buying clusters.',
  '4×8 soil queries repeatedly mix exact-answer examples with generic raised-bed calculators, supporting a 4×8 depth series instead of a single catch-all paragraph.',
  'Soil mix and compost SERPs overlap with calculators and gardening guides, so mix pages must route back to volume calculators and keep soil-test caveats visible.',
  'Spacing and depth SERPs are more guide-like, but BedSoil can keep these pages because each still opens an editable calculator and links back to volume/bag planning.',
  'Container and grow-bag searches use gallon, liter, pot, and package-label language; they belong beside bag conversion rather than inside only the raised-bed footprint cluster.',
] as const;

export const TOPIC_CLUSTERS: TopicCluster[] = [
  {
    id: 'raised-bed-soil-volume',
    name: 'Raised bed soil volume calculators',
    pillarSlug: 'raised-bed-soil-calculator',
    pillarKeyword: 'raised bed soil calculator',
    intent: 'mixed',
    summary: 'Core volume-estimation cluster for gardeners who know the bed footprint and need cubic feet, cubic yards, liters, bags, and a shopping list.',
    serpPattern: 'SERP samples for raised-bed soil queries repeatedly show calculator pages, garden-center tools, and explanatory 4×8 examples competing together.',
    differentiator: 'BedSoil keeps editable calculator inputs on every spoke and exposes formula, assumptions, settling allowance, and bag conversion instead of only a static chart.',
    recommendedHubCopy: 'Start with the main raised bed calculator, then move to a fixed footprint, depth, shape, or multi-bed spoke when the project is more specific.',
    adjacentClusterIds: ['soil-bag-buying', 'bulk-cost-planning', 'soil-mix-amendments'],
    spokes: [
      { slug: '4x8-raised-bed-soil-calculator', primaryKeyword: '4x8 raised bed soil calculator', secondaryKeywords: ['how much soil for 4x8 raised bed', '4 by 8 raised bed soil'], intent: 'informational', template: 'calculator', linkAnchor: '4×8 raised bed soil calculator', role: 'Most common fixed-size spoke and secondary hub for the 4×8 depth series.' },
      { slug: '4x4-raised-bed-soil-calculator', primaryKeyword: '4x4 raised bed soil calculator', secondaryKeywords: ['soil for 4x4 raised bed', '4 by 4 raised bed volume'], intent: 'informational', template: 'calculator', linkAnchor: '4×4 raised bed soil calculator', role: 'Compact bed footprint spoke for square-foot gardeners.' },
      { slug: '4x6-raised-bed-soil-calculator', primaryKeyword: '4x6 raised bed soil calculator', secondaryKeywords: ['soil for 4x6 raised bed'], intent: 'informational', template: 'calculator', linkAnchor: '4×6 raised bed soil calculator', role: 'Medium rectangular footprint spoke.' },
      { slug: '3x6-raised-bed-soil-calculator', primaryKeyword: '3x6 raised bed soil calculator', secondaryKeywords: ['soil for 3x6 raised bed', '3 by 6 raised bed soil'], intent: 'informational', template: 'calculator', linkAnchor: '3×6 raised bed soil calculator', role: 'Common compact rectangular bed spoke that matches competitor examples and smaller patio projects.' },
      { slug: '2x8-raised-bed-soil-calculator', primaryKeyword: '2x8 raised bed soil calculator', secondaryKeywords: ['soil for 2x8 raised bed'], intent: 'informational', template: 'calculator', linkAnchor: '2×8 raised bed soil calculator', role: 'Narrow bed footprint spoke.' },
      { slug: '8x4-raised-bed-soil-calculator', primaryKeyword: '8x4 raised bed soil calculator', secondaryKeywords: ['8 by 4 raised bed soil', '4x8 raised bed reversed dimensions'], intent: 'informational', template: 'calculator', linkAnchor: '8×4 raised bed soil calculator', role: 'Dimension-order variant spoke that catches users who search length before width without creating a separate formula.' },
      { slug: 'raised-bed-cubic-feet-calculator', primaryKeyword: 'raised bed cubic feet calculator', secondaryKeywords: ['cubic feet for raised bed soil'], intent: 'informational', template: 'explainer', linkAnchor: 'raised bed cubic feet calculator', role: 'Unit-focused volume explanation spoke.' },
      { slug: 'multiple-raised-bed-soil-calculator', primaryKeyword: 'multiple raised bed soil calculator', secondaryKeywords: ['soil for multiple raised beds'], intent: 'informational', template: 'calculator', linkAnchor: 'multiple raised bed soil calculator', role: 'Aggregation spoke for multi-bed projects.' },
      { slug: 'round-raised-bed-soil-calculator', primaryKeyword: 'round raised bed soil calculator', secondaryKeywords: ['circular raised bed soil volume'], intent: 'informational', template: 'calculator', linkAnchor: 'round raised bed soil calculator', role: 'Shape-variant spoke for cylinder volume.' },
      { slug: 'l-shaped-raised-bed-soil-calculator', primaryKeyword: 'L shaped raised bed soil calculator', secondaryKeywords: ['L shaped garden bed soil volume'], intent: 'informational', template: 'calculator', linkAnchor: 'L-shaped raised bed soil calculator', role: 'Shape-variant spoke for section subtraction.' },
      { slug: 'u-shaped-raised-bed-soil-calculator', primaryKeyword: 'U shaped raised bed soil calculator', secondaryKeywords: ['U shaped garden bed soil volume'], intent: 'informational', template: 'calculator', linkAnchor: 'U-shaped raised bed soil calculator', role: 'Shape-variant spoke for multi-section beds.' },
    ],
  },
  {
    id: '4x8-depth-series',
    name: '4×8 raised bed depth series',
    pillarSlug: '4x8-raised-bed-soil-calculator',
    pillarKeyword: '4x8 raised bed soil calculator',
    intent: 'informational',
    summary: 'Depth-specific answer cluster for the dominant 4×8 footprint, covering 6, 8, 10, 12, 18, and 24 inch fill depths.',
    serpPattern: 'SERP samples for 4×8 soil needs often surface fixed-depth examples, bag estimates, and general raised-bed calculators in the same result set.',
    differentiator: 'Each spoke hard-codes a different depth assumption and compares it with the same 4×8 footprint, making the series useful without creating arbitrary facets.',
    recommendedHubCopy: 'Use the 4×8 hub when the footprint is fixed and choose a depth spoke when the searcher already knows the target soil depth.',
    adjacentClusterIds: ['soil-bag-buying', 'planting-depth-spacing'],
    spokes: [
      { slug: '4x8-raised-bed-6-inches-soil', primaryKeyword: '4x8 raised bed 6 inches soil', secondaryKeywords: ['soil for 4x8 bed 6 inches deep'], intent: 'informational', template: 'calculator', linkAnchor: '4×8 bed at 6 inches', role: 'Shallow-fill spoke.' },
      { slug: '4x8-raised-bed-8-inches-soil', primaryKeyword: '4x8 raised bed 8 inches soil', secondaryKeywords: ['soil for 4x8 bed 8 inches deep'], intent: 'informational', template: 'calculator', linkAnchor: '4×8 bed at 8 inches', role: 'Intermediate shallow-fill spoke.' },
      { slug: '4x8-raised-bed-10-inches-soil', primaryKeyword: '4x8 raised bed 10 inches soil', secondaryKeywords: ['soil for 4x8 bed 10 inches deep'], intent: 'informational', template: 'calculator', linkAnchor: '4×8 bed at 10 inches', role: 'Near-standard vegetable-fill spoke.' },
      { slug: '4x8-raised-bed-12-inches-soil', primaryKeyword: '4x8 raised bed 12 inches soil', secondaryKeywords: ['how much soil for 4x8 raised bed 12 inches'], intent: 'informational', template: 'calculator', linkAnchor: '4×8 bed at 12 inches', role: 'Standard 32 ft³ reference spoke.' },
      { slug: '4x8-raised-bed-18-inches-soil', primaryKeyword: '4x8 raised bed 18 inches soil', secondaryKeywords: ['soil for 4x8 bed 18 inches deep'], intent: 'commercial', template: 'calculator', linkAnchor: '4×8 bed at 18 inches', role: 'Higher-volume buying spoke.' },
      { slug: '4x8-raised-bed-24-inches-soil', primaryKeyword: '4x8 raised bed 24 inches soil', secondaryKeywords: ['soil for 4x8 bed 24 inches deep'], intent: 'commercial', template: 'calculator', linkAnchor: '4×8 bed at 24 inches', role: 'Deep bed and bulk-order spoke.' },
      { slug: 'how-much-soil-for-4x8-raised-bed', primaryKeyword: 'how much soil for 4x8 raised bed', secondaryKeywords: ['4x8 raised bed soil amount'], intent: 'informational', template: 'explainer', linkAnchor: 'how much soil for a 4×8 raised bed', role: 'Question-form entry point that routes to depth calculators.' },
    ],
  },
  {
    id: 'soil-bag-buying',
    name: 'Soil bag conversion and buying',
    pillarSlug: 'soil-bags-calculator',
    pillarKeyword: 'soil bags calculator',
    intent: 'commercial',
    summary: 'Buying-intent cluster for converting required soil volume into rounded-up bag counts across common package sizes and units.',
    serpPattern: 'Bag-count queries overlap with general soil calculators, 4×8 examples, retail calculators, and package-size explanations.',
    differentiator: 'BedSoil separates true volume-labeled packages from weight-only bags and keeps leftover volume visible after rounding up.',
    recommendedHubCopy: 'Use this cluster after a volume has been calculated, or when the searcher starts from a bag label such as 40 qt or 2 ft³.',
    adjacentClusterIds: ['raised-bed-soil-volume', 'bulk-cost-planning'],
    spokes: [
      { slug: '40-qt-soil-bag-calculator', primaryKeyword: '40 qt soil bag calculator', secondaryKeywords: ['40 quart bag soil calculator'], intent: 'commercial', template: 'calculator', linkAnchor: '40 qt soil bag calculator', role: 'Package-size spoke for common dry-quart bags.' },
      { slug: '1-cubic-foot-soil-bag-calculator', primaryKeyword: '1 cubic foot soil bag calculator', secondaryKeywords: ['1 cu ft soil bags needed'], intent: 'commercial', template: 'calculator', linkAnchor: '1 cubic foot soil bag calculator', role: 'Package-size spoke for small bags.' },
      { slug: '1-5-cubic-foot-soil-bag-calculator', primaryKeyword: '1.5 cubic foot soil bag calculator', secondaryKeywords: ['1.5 cu ft soil bags needed'], intent: 'commercial', template: 'calculator', linkAnchor: '1.5 cubic foot soil bag calculator', role: 'Package-size spoke for mid-size bags.' },
      { slug: '2-cubic-foot-soil-bag-calculator', primaryKeyword: '2 cubic foot soil bag calculator', secondaryKeywords: ['2 cu ft soil bags needed'], intent: 'commercial', template: 'calculator', linkAnchor: '2 cubic foot soil bag calculator', role: 'Package-size spoke for standard larger bags.' },
      { slug: 'cubic-feet-to-soil-bags-calculator', primaryKeyword: 'cubic feet to soil bags calculator', secondaryKeywords: ['convert cubic feet to soil bags'], intent: 'informational', template: 'calculator', linkAnchor: 'cubic feet to soil bags calculator', role: 'Unit conversion spoke.' },
      { slug: 'liters-to-soil-bags-calculator', primaryKeyword: 'liters to soil bags calculator', secondaryKeywords: ['liters to bags of soil'], intent: 'informational', template: 'calculator', linkAnchor: 'liters to soil bags calculator', role: 'Metric package conversion spoke.' },
      { slug: 'liters-to-cubic-feet-soil-calculator', primaryKeyword: 'liters to cubic feet soil calculator', secondaryKeywords: ['liters to cubic feet soil', 'metric soil volume conversion'], intent: 'informational', template: 'calculator', linkAnchor: 'liters to cubic feet soil calculator', role: 'Metric-to-US unit bridge that supports international bag labels before bag rounding.' },
      { slug: 'how-many-bags-of-soil-for-raised-bed', primaryKeyword: 'how many bags of soil for raised bed', secondaryKeywords: ['bags of soil needed for raised bed'], intent: 'commercial', template: 'explainer', linkAnchor: 'how many bags of soil for a raised bed', role: 'Question-form buying spoke.' },
      { slug: 'how-many-40-lb-bags-of-soil-do-i-need', primaryKeyword: 'how many 40 lb bags of soil do I need', secondaryKeywords: ['40 lb bags of soil conversion'], intent: 'commercial', template: 'explainer', linkAnchor: '40 lb bag warning and estimate', role: 'Weight-label caveat spoke.' },
    ],
  },
  {
    id: 'bulk-cost-planning',
    name: 'Bulk soil and cost planning',
    pillarSlug: 'bulk-soil-vs-bags-calculator',
    pillarKeyword: 'bulk soil vs bags calculator',
    intent: 'commercial',
    summary: 'Commercial decision cluster for choosing bagged soil, cubic-yard delivery, pickup, or hybrid ordering based on volume and cost assumptions.',
    serpPattern: 'Bulk and cost searches overlap with soil volume calculators, retail calculators, and cubic-yard conversion pages.',
    differentiator: 'BedSoil makes delivery fee, supplier minimum, pickup cost, and overbuy volume explicit instead of reducing the decision to unit price alone.',
    recommendedHubCopy: 'Use this cluster when the required volume is known and the next decision is bagged purchase versus bulk delivery or pickup.',
    adjacentClusterIds: ['soil-bag-buying', 'soil-mix-amendments'],
    spokes: [
      { slug: 'raised-bed-cost-calculator', primaryKeyword: 'raised bed cost calculator', secondaryKeywords: ['raised bed soil cost calculator'], intent: 'commercial', template: 'calculator', linkAnchor: 'raised bed cost calculator', role: 'Project-level cost spoke.' },
      { slug: 'raised-bed-soil-cost-calculator', primaryKeyword: 'raised bed soil cost calculator', secondaryKeywords: ['cost to fill raised bed with soil'], intent: 'commercial', template: 'calculator', linkAnchor: 'raised bed soil cost calculator', role: 'Soil-only cost spoke.' },
      { slug: 'raised-bed-cost-estimator', primaryKeyword: 'raised bed cost estimator', secondaryKeywords: ['estimate raised garden bed cost'], intent: 'commercial', template: 'calculator', linkAnchor: 'raised bed cost estimator', role: 'Higher-level estimator spoke.' },
      { slug: 'cheapest-way-to-fill-raised-beds', primaryKeyword: 'cheapest way to fill raised beds', secondaryKeywords: ['cheap raised bed soil fill'], intent: 'commercial', template: 'comparison', linkAnchor: 'cheapest way to fill raised beds', role: 'Cost-saving comparison spoke.' },
      { slug: 'how-much-bulk-soil-for-raised-beds', primaryKeyword: 'how much bulk soil for raised beds', secondaryKeywords: ['bulk soil for raised bed calculator'], intent: 'commercial', template: 'calculator', linkAnchor: 'bulk soil for raised beds', role: 'Bulk volume buying spoke.' },
      { slug: 'cubic-yards-of-soil-for-raised-beds', primaryKeyword: 'cubic yards of soil for raised beds', secondaryKeywords: ['yards of soil for raised beds'], intent: 'informational', template: 'explainer', linkAnchor: 'cubic yards of soil for raised beds', role: 'Cubic-yard conversion spoke.' },
      { slug: 'cubic-yards-to-soil-bags-calculator', primaryKeyword: 'cubic yards to soil bags calculator', secondaryKeywords: ['yards to bags of soil'], intent: 'commercial', template: 'calculator', linkAnchor: 'cubic yards to soil bags calculator', role: 'Bulk-to-bag bridge spoke.' },
    ],
  },
  {
    id: 'soil-mix-amendments',
    name: 'Soil mix and amendments',
    pillarSlug: 'raised-bed-soil-mix-calculator',
    pillarKeyword: 'raised bed soil mix calculator',
    intent: 'informational',
    summary: 'Mix-ratio cluster for splitting total volume into topsoil, compost, potting mix, Mel’s Mix style inputs, and seasonal compost top-off.',
    serpPattern: 'Mix ratio searches overlap with raised-bed soil calculators, compost calculators, and square-foot gardening mix pages.',
    differentiator: 'BedSoil calculates component volumes from the user’s total volume while keeping ratio guidance separate from soil-test or agronomy advice.',
    recommendedHubCopy: 'Use this cluster after the volume is known and before buying components or deciding whether a compost-heavy top-off is appropriate.',
    adjacentClusterIds: ['raised-bed-soil-volume', 'seasonal-maintenance', 'bulk-cost-planning'],
    spokes: [
      { slug: 'compost-topsoil-mix-calculator', primaryKeyword: 'compost topsoil mix calculator', secondaryKeywords: ['topsoil compost mix calculator'], intent: 'informational', template: 'calculator', linkAnchor: 'compost and topsoil mix calculator', role: 'Two-component ratio spoke.' },
      { slug: 'mels-mix-calculator', primaryKeyword: 'Mel’s Mix calculator', secondaryKeywords: ['square foot gardening soil mix calculator'], intent: 'informational', template: 'calculator', linkAnchor: 'Mel’s Mix calculator', role: 'Square-foot gardening mix spoke.' },
      { slug: 'how-much-compost-for-raised-bed', primaryKeyword: 'how much compost for raised bed', secondaryKeywords: ['compost for raised bed calculator'], intent: 'informational', template: 'explainer', linkAnchor: 'how much compost for a raised bed', role: 'Compost amount question spoke.' },
      { slug: 'topsoil-compost-ratio-raised-bed', primaryKeyword: 'topsoil compost ratio raised bed', secondaryKeywords: ['raised bed topsoil compost ratio'], intent: 'informational', template: 'explainer', linkAnchor: 'topsoil compost ratio for raised beds', role: 'Ratio explanation spoke.' },
      { slug: 'annual-raised-bed-top-off-calculator', primaryKeyword: 'annual raised bed top off calculator', secondaryKeywords: ['top off raised bed soil'], intent: 'informational', template: 'calculator', linkAnchor: 'annual raised bed top-off calculator', role: 'Maintenance bridge spoke.' },
    ],
  },
  {
    id: 'planting-depth-spacing',
    name: 'Planting depth and spacing',
    pillarSlug: 'square-foot-garden-spacing-calculator',
    pillarKeyword: 'square foot garden spacing calculator',
    intent: 'informational',
    summary: 'Plant-fit cluster for turning bed area into planting squares and checking whether depth is adequate for common crop groups.',
    serpPattern: 'Spacing searches overlap with square-foot garden guides, plant count calculators, and crop-specific raised-bed layout pages.',
    differentiator: 'BedSoil connects spacing counts to soil depth and volume calculators so the planning path does not stop at plant count.',
    recommendedHubCopy: 'Use this cluster when the user has a bed size and wants to know how many plants fit before verifying soil depth and volume.',
    adjacentClusterIds: ['4x8-depth-series', 'raised-bed-soil-volume'],
    spokes: [
      { slug: '4x8-raised-bed-planting-layout', primaryKeyword: '4x8 raised bed planting layout', secondaryKeywords: ['4x8 square foot garden layout'], intent: 'informational', template: 'calculator', linkAnchor: '4×8 raised bed planting layout', role: 'Fixed-footprint layout spoke.' },
      { slug: 'how-many-tomato-plants-in-4x8-raised-bed', primaryKeyword: 'how many tomato plants in 4x8 raised bed', secondaryKeywords: ['tomato plants 4x8 raised bed'], intent: 'informational', template: 'explainer', linkAnchor: 'tomato plants in a 4×8 raised bed', role: 'Crop-specific plant-count spoke.' },
      { slug: 'tomato-spacing-raised-bed', primaryKeyword: 'tomato spacing raised bed', secondaryKeywords: ['tomato spacing in raised beds'], intent: 'informational', template: 'explainer', linkAnchor: 'tomato spacing in raised beds', role: 'Tomato spacing spoke.' },
      { slug: 'pepper-spacing-raised-bed', primaryKeyword: 'pepper spacing raised bed', secondaryKeywords: ['pepper plants in raised bed'], intent: 'informational', template: 'explainer', linkAnchor: 'pepper spacing in raised beds', role: 'Pepper spacing spoke.' },
      { slug: 'lettuce-spacing-square-foot-garden', primaryKeyword: 'lettuce spacing square foot garden', secondaryKeywords: ['lettuce square foot spacing'], intent: 'informational', template: 'explainer', linkAnchor: 'lettuce square-foot spacing', role: 'Leafy green spacing spoke.' },
      { slug: 'carrot-spacing-square-foot-garden', primaryKeyword: 'carrot spacing square foot garden', secondaryKeywords: ['carrot square foot spacing'], intent: 'informational', template: 'explainer', linkAnchor: 'carrot square-foot spacing', role: 'Root crop spacing spoke.' },
      { slug: 'cucumber-spacing-raised-bed', primaryKeyword: 'cucumber spacing raised bed', secondaryKeywords: ['cucumbers in raised bed spacing'], intent: 'informational', template: 'explainer', linkAnchor: 'cucumber spacing in raised beds', role: 'Vining crop spacing spoke.' },
      { slug: 'basil-spacing-square-foot-garden', primaryKeyword: 'basil spacing square foot garden', secondaryKeywords: ['basil square foot spacing'], intent: 'informational', template: 'explainer', linkAnchor: 'basil square-foot spacing', role: 'Herb spacing spoke.' },
      { slug: 'raised-bed-depth-calculator', primaryKeyword: 'raised bed depth calculator', secondaryKeywords: ['how deep should raised beds be'], intent: 'informational', template: 'calculator', linkAnchor: 'raised bed depth calculator', role: 'Depth-validation bridge spoke.' },
      { slug: 'raised-bed-depth-for-tomatoes', primaryKeyword: 'raised bed depth for tomatoes', secondaryKeywords: ['how deep raised bed for tomatoes'], intent: 'informational', template: 'explainer', linkAnchor: 'raised bed depth for tomatoes', role: 'Crop-depth spoke.' },
      { slug: 'raised-bed-depth-for-carrots', primaryKeyword: 'raised bed depth for carrots', secondaryKeywords: ['how deep raised bed for carrots'], intent: 'informational', template: 'explainer', linkAnchor: 'raised bed depth for carrots', role: 'Root-crop depth spoke.' },
    ],
  },
  {
    id: 'container-grow-bag-volume',
    name: 'Container and grow bag volume',
    pillarSlug: 'container-soil-calculator',
    pillarKeyword: 'container soil calculator',
    intent: 'informational',
    summary: 'Container-volume cluster for pot dimensions, grow-bag gallon labels, buckets, planters, and multi-pot buying calculations.',
    serpPattern: 'Container soil searches overlap with general soil calculators but often require gallons, liters, pot diameter, and fill-line caveats.',
    differentiator: 'BedSoil separates bed soil from container potting mix assumptions and supports gallon-labeled grow bags plus dimensional planters.',
    recommendedHubCopy: 'Use this cluster when the container shape or gallon label matters more than a rectangular raised-bed footprint.',
    adjacentClusterIds: ['soil-bag-buying', 'soil-mix-amendments'],
    spokes: [
      { slug: 'grow-bag-soil-calculator', primaryKeyword: 'grow bag soil calculator', secondaryKeywords: ['grow bag gallons to soil'], intent: 'informational', template: 'calculator', linkAnchor: 'grow bag soil calculator', role: 'Grow-bag hub spoke.' },
      { slug: '10-gallon-grow-bag-soil-calculator', primaryKeyword: '10 gallon grow bag soil calculator', secondaryKeywords: ['soil for 10 gallon grow bag'], intent: 'commercial', template: 'calculator', linkAnchor: '10 gallon grow bag soil calculator', role: '10 gallon package spoke.' },
      { slug: '20-gallon-grow-bag-soil-calculator', primaryKeyword: '20 gallon grow bag soil calculator', secondaryKeywords: ['soil for 20 gallon grow bag'], intent: 'commercial', template: 'calculator', linkAnchor: '20 gallon grow bag soil calculator', role: '20 gallon package spoke.' },
      { slug: '5-gallon-bucket-soil-calculator', primaryKeyword: '5 gallon bucket soil calculator', secondaryKeywords: ['soil for 5 gallon bucket'], intent: 'informational', template: 'calculator', linkAnchor: '5 gallon bucket soil calculator', role: 'Bucket conversion spoke.' },
      { slug: 'planter-soil-volume-calculator', primaryKeyword: 'planter soil volume calculator', secondaryKeywords: ['rectangular planter soil calculator'], intent: 'informational', template: 'calculator', linkAnchor: 'planter soil volume calculator', role: 'Dimensional planter spoke.' },
      { slug: 'how-much-soil-for-45-six-inch-pots', primaryKeyword: 'how much soil for 45 six inch pots', secondaryKeywords: ['soil for 6 inch pots'], intent: 'commercial', template: 'calculator', linkAnchor: 'soil for 45 six-inch pots', role: 'Multi-pot buying spoke.' },
    ],
  },
  {
    id: 'seasonal-maintenance',
    name: 'Seasonal raised bed maintenance',
    pillarSlug: 'annual-raised-bed-top-off-calculator',
    pillarKeyword: 'raised bed top off calculator',
    intent: 'informational',
    summary: 'Maintenance cluster for measuring seasonal soil drop, top-off material, and spring/fall pre-planting checklists.',
    serpPattern: 'Maintenance queries are adjacent to compost amount, raised-bed depth, and checklist-style gardening searches rather than pure volume calculators.',
    differentiator: 'BedSoil ties checklist content to measurable top-off depth so the user can convert seasonal observations into material quantities.',
    recommendedHubCopy: 'Use this cluster when the bed already exists and the user is preparing for the next planting cycle.',
    adjacentClusterIds: ['soil-mix-amendments', 'planting-depth-spacing'],
    spokes: [
      { slug: 'spring-raised-bed-checklist', primaryKeyword: 'spring raised bed checklist', secondaryKeywords: ['spring raised bed soil checklist'], intent: 'informational', template: 'checklist', linkAnchor: 'spring raised bed checklist', role: 'Spring preparation spoke.' },
      { slug: 'fall-raised-bed-soil-checklist', primaryKeyword: 'fall raised bed soil checklist', secondaryKeywords: ['fall raised bed maintenance'], intent: 'informational', template: 'checklist', linkAnchor: 'fall raised bed soil checklist', role: 'Fall maintenance spoke.' },
      { slug: 'how-much-compost-for-raised-bed', primaryKeyword: 'how much compost for raised bed', secondaryKeywords: ['compost top off raised bed'], intent: 'informational', template: 'explainer', linkAnchor: 'compost for raised beds', role: 'Compost bridge spoke.' },
      { slug: 'raised-bed-depth-calculator', primaryKeyword: 'raised bed depth calculator', secondaryKeywords: ['check raised bed depth before planting'], intent: 'informational', template: 'calculator', linkAnchor: 'raised bed depth calculator', role: 'Depth verification bridge spoke.' },
    ],
  },
];

function resolvePage(slug: string): PageDefinition | undefined {
  return pageMap.get(slug);
}

function topicSlugs(cluster: TopicCluster) {
  return [cluster.pillarSlug, ...cluster.spokes.map((spoke) => spoke.slug)];
}

export function topicClusterForPage(page: PageDefinition): TopicCluster | undefined {
  return TOPIC_CLUSTERS.find((cluster) => topicSlugs(cluster).includes(page.slug));
}

export function topicClusterPageCount(cluster: TopicCluster): number {
  return topicSlugs(cluster).filter((slug) => pageMap.has(slug)).length;
}

export function clusterSpokesForPage(page: PageDefinition): TopicClusterSpoke[] {
  const cluster = topicClusterForPage(page);
  if (!cluster) return [];
  return cluster.spokes.filter((spoke) => pageMap.has(spoke.slug));
}

export function topicClusterLinksForPage(page: PageDefinition, limit = 8): ClusterLink[] {
  const cluster = topicClusterForPage(page);
  if (!cluster) return [];
  const isPillar = page.slug === cluster.pillarSlug;
  const currentSpokeIndex = cluster.spokes.findIndex((spoke) => spoke.slug === page.slug);
  const links: ClusterLink[] = [];

  if (isPillar) {
    links.push(...cluster.spokes
      .filter((spoke) => pageMap.has(spoke.slug))
      .slice(0, limit)
      .map((spoke) => ({
        from: page.slug,
        to: spoke.slug,
        type: 'pillar-to-spoke' as const,
        anchor: spoke.linkAnchor,
        placement: 'hub-card' as const,
      })));
  } else {
    links.push({
      from: page.slug,
      to: cluster.pillarSlug,
      type: 'spoke-to-pillar',
      anchor: cluster.pillarKeyword,
      placement: 'body',
    });

    const siblingSpokes = cluster.spokes
      .filter((spoke) => spoke.slug !== page.slug && pageMap.has(spoke.slug));
    const rotated = currentSpokeIndex > -1
      ? [...siblingSpokes.slice(Math.max(0, currentSpokeIndex - 2)), ...siblingSpokes.slice(0, Math.max(0, currentSpokeIndex - 2))]
      : siblingSpokes;
    links.push(...rotated.slice(0, 4).map((spoke) => ({
      from: page.slug,
      to: spoke.slug,
      type: 'sibling' as const,
      anchor: spoke.linkAnchor,
      placement: 'body' as const,
    })));
  }

  const crossClusterLinks = cluster.adjacentClusterIds
    .map((id) => TOPIC_CLUSTERS.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is TopicCluster => Boolean(candidate))
    .map((targetCluster) => ({
      from: page.slug,
      to: targetCluster.pillarSlug,
      type: 'cross-cluster' as const,
      anchor: targetCluster.pillarKeyword,
      placement: 'next-step' as const,
    }))
    .filter((link) => link.to !== page.slug && pageMap.has(link.to));

  return [...links, ...crossClusterLinks].slice(0, limit);
}

export function allClusterLinks(): ClusterLink[] {
  return TOPIC_CLUSTERS.flatMap((cluster) => {
    const pillarToSpokes = cluster.spokes
      .filter((spoke) => pageMap.has(spoke.slug))
      .flatMap((spoke) => [
        { from: cluster.pillarSlug, to: spoke.slug, type: 'pillar-to-spoke' as const, anchor: spoke.linkAnchor, placement: 'hub-card' as const },
        { from: spoke.slug, to: cluster.pillarSlug, type: 'spoke-to-pillar' as const, anchor: cluster.pillarKeyword, placement: 'body' as const },
      ]);
    const crossLinks = cluster.adjacentClusterIds
      .map((id) => TOPIC_CLUSTERS.find((candidate) => candidate.id === id))
      .filter((candidate): candidate is TopicCluster => Boolean(candidate))
      .map((targetCluster) => ({
        from: cluster.pillarSlug,
        to: targetCluster.pillarSlug,
        type: 'cross-cluster' as const,
        anchor: targetCluster.pillarKeyword,
        placement: 'next-step' as const,
      }))
      .filter((link) => pageMap.has(link.from) && pageMap.has(link.to));
    return [...pillarToSpokes, ...crossLinks];
  });
}

export function topicClusterCoverage() {
  const memberships = TOPIC_CLUSTERS.flatMap((cluster) => topicSlugs(cluster).map((slug) => ({ slug, clusterId: cluster.id })));
  const linkedSlugs = new Set(memberships.map((membership) => membership.slug));
  const calculatorSlugs = calculatorPages.filter((page) => !page.legal).map((page) => page.slug);
  const orphanCalculatorSlugs = calculatorSlugs.filter((slug) => !linkedSlugs.has(slug));
  const duplicateMembershipSlugs = [...linkedSlugs]
    .filter((slug) => memberships.filter((membership) => membership.slug === slug).length > 1)
    .filter((slug) => pageMap.has(slug));
  const minimumIncomingLinksMet = orphanCalculatorSlugs.length === 0;

  return {
    totalClusters: TOPIC_CLUSTERS.length,
    totalClusteredPages: new Set([...linkedSlugs].filter((slug) => pageMap.has(slug))).size,
    totalCalculatorPages: calculatorSlugs.length,
    orphanCalculatorSlugs,
    duplicateMembershipSlugs,
    minimumIncomingLinksMet,
    totalMatrixLinks: allClusterLinks().length,
    seedKeywordCount: CLUSTER_SEED_KEYWORDS.length,
    serpEvidenceCount: SERP_CLUSTER_EVIDENCE.length,
  };
}

export function clusterDisplayPage(slug: string) {
  const page = resolvePage(slug);
  return {
    slug,
    title: page?.title ?? slugToTitle(slug),
    url: `/${slug}`,
  };
}
