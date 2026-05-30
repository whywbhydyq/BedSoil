export type SourceEntry = {
  id: string;
  tier: 'A' | 'B' | 'C' | 'D';
  topic: string;
  label: string;
  href: string;
  note: string;
};

export const SOURCE_LIBRARY: SourceEntry[] = [
  { id: 'S01', tier: 'A', topic: 'SERP task model', label: "Old Farmer's Almanac Soil Calculator", href: 'https://www.almanac.com/tool/soil-calculator', note: 'Competitor pattern: raised bed or pot dimensions produce a soil quantity estimate.' },
  { id: 'S02', tier: 'A', topic: 'SERP task model', label: "Gardener's Supply Co. Garden Soil Calculator", href: 'https://www.gardeners.com/blogs/vegetable-gardening-articles/soil-calculator', note: 'Competitor pattern: shape and dimensions produce cubic feet, cubic yards, or quart outputs.' },
  { id: 'S03', tier: 'A', topic: 'SERP task model', label: "Lowe's Mulch and Soil Calculator", href: 'https://www.lowes.com/n/calculators/mulch-and-soil-calculator', note: 'Retail estimator pattern; supports clear planning-tool boundary language.' },
  { id: 'S04', tier: 'A', topic: 'SERP task model', label: 'Kellogg Garden Organics Soil Calculator', href: 'https://kellogggarden.com/soil-calculator/', note: 'Project type, dimensions, depth, and bag selection pattern for soil estimates.' },
  { id: 'S05', tier: 'A', topic: 'Raised beds and containers', label: 'USDA National Agricultural Library: Raised Beds & Container Gardening', href: 'https://www.nal.usda.gov/plant-production-gardening/raised-beds-containers', note: 'Trust hub for raised beds, containers, growing media, water, light, and related resources.' },
  { id: 'S06', tier: 'A', topic: 'Raised bed placement', label: 'University of Minnesota Extension: Raised bed gardens', href: 'https://extension.umn.edu/planting-and-growing-guides/raised-bed-gardens', note: 'Raised bed placement, water access, sunlight, access, fill, and soil-mix considerations.' },
  { id: 'S07', tier: 'A', topic: 'Raised bed fill and depth', label: 'University of Maryland Extension: Soil to Fill Raised Beds', href: 'https://extension.umd.edu/resource/soil-fill-raised-beds', note: 'Raised bed fill scenarios, hard-surface depth guidance, topsoil limits, soil testing, and lead caution.' },
  { id: 'S08', tier: 'A', topic: 'Raised bed preparation', label: 'University of Maryland Extension: Growing Vegetables in Raised Beds', href: 'https://extension.umd.edu/resource/growing-vegetables-raised-beds', note: 'Raised bed preparation, compost/topsoil mixes, minimum media depth, and bed-management guidance.' },
  { id: 'S09', tier: 'A', topic: 'Compost and bulk volume', label: 'Oregon State Extension: How to use compost in gardens and landscapes', href: 'https://extension.oregonstate.edu/catalog/em-9308-how-use-compost-gardens-landscapes', note: 'Compost bag sizes, bulk cubic yards, 27 ft³ per yd³, and annual compost planning ranges.' },
  { id: 'S10', tier: 'A', topic: 'Top-off and settling', label: 'University of Illinois Extension: Refreshing raised bed soil', href: 'https://extension.illinois.edu/news-releases/refreshing-raised-bed-soil-generates-exceptional-results', note: 'Settling is normal in raised beds; annual topdressing can help maintain soil level.' },
  { id: 'S11', tier: 'A', topic: 'Organic matter and amendments', label: 'University of Maryland Extension: Organic Matter and Soil Amendments', href: 'https://extension.umd.edu/resource/organic-matter-and-soil-amendments', note: 'Organic matter benefits and cautions; volume ratios are planning estimates, not lab measurements.' },
  { id: 'S12', tier: 'A', topic: 'Soil density and compaction', label: 'University of Minnesota Extension: Soil compaction', href: 'https://extension.umn.edu/soil-management-and-health/soil-compaction', note: 'Bulk density depends on pore space, texture, and compaction; weight-only bag labels cannot be converted exactly to volume.' },
  { id: 'S13', tier: 'A', topic: 'Container gardening basics', label: 'University of Maryland Extension: Growing Vegetables in Containers and Salad Tables', href: 'https://extension.umd.edu/resource/growing-vegetables-containers-and-salad-tables', note: 'Container media volume, drainage, watering, crop variety, seed-packet spacing, and container-size considerations.' },
  { id: 'S14', tier: 'A', topic: 'Container media', label: 'University of Maryland Extension: Growing Media (Potting Soil) for Containers', href: 'https://extension.umd.edu/resource/growing-media-potting-soil-containers', note: 'Container media guidance; dense topsoil/garden soil is not the default for containers.' },
  { id: 'S15', tier: 'A', topic: 'Container media', label: 'Oregon State Extension: Container gardening without yard space', href: 'https://extension.oregonstate.edu/news/container-gardening-grow-vegetables-even-without-yard-space', note: 'Use lightweight potting soil for containers; avoid heavy garden soil or topsoil in typical pots.' },
  { id: 'S16', tier: 'A', topic: 'Container drainage and fill line', label: 'Oregon State Extension: Container gardening basics', href: 'https://extension.oregonstate.edu/catalog/em-9544-container-gardening-basics', note: 'Container drainage, potting soil structure, and fill-line/watering reservoir considerations.' },
  { id: 'S17', tier: 'A', topic: 'Grow bag assumptions', label: 'University of Maryland Extension: Container volume examples', href: 'https://extension.umd.edu/resource/growing-vegetables-containers-and-salad-tables', note: 'Grow bag and container volume examples; actual fill varies with shape, folding, and fill line.' },
  { id: 'S18', tier: 'A', topic: 'Soil testing', label: 'University of Maryland Extension: Soil Testing and Soil Testing Labs', href: 'https://extension.umd.edu/resource/soil-testing-and-soil-testing-labs', note: 'Soil tests provide pH, nutrient, organic-matter, and recommendation context; vegetable gardens should consider lead testing.' },
  { id: 'S19', tier: 'A', topic: 'Soil sampling', label: 'Oregon State Extension: Collecting Soil Samples for Farms and Gardens', href: 'https://extension.oregonstate.edu/catalog/ec-628-guide-collecting-soil-samples-farms-gardens', note: 'Raised bed samples should represent where plants grow, not paths or unrelated soil.' },
  { id: 'S20', tier: 'A', topic: 'Lead and urban gardens', label: 'University of Maryland Extension: Lead in Garden Soils', href: 'https://extension.umd.edu/resource/lead-garden-soils', note: 'Lead testing and urban/old-home garden safety boundary for edible crops.' },
  { id: 'S21', tier: 'A', topic: 'Soil test interpretation', label: 'Oregon State Extension: How do I test my garden soil?', href: 'https://extension.oregonstate.edu/catalog/em-9685-how-do-i-test-my-garden-soil', note: 'Lab soil tests are more useful for pH, nutrients, organic matter, and problem solving than informal home-kit assumptions.' },
  { id: 'S22', tier: 'A', topic: 'Unit conversion', label: 'NIST: Approximate Conversions from U.S. Customary Measures to Metric', href: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion/approximate-conversions-us-customary-measures-metric', note: 'Source provenance for U.S. customary and metric unit conversion factors.' },
  { id: 'S23', tier: 'A', topic: 'Cubic yard conversion', label: 'Oregon State Extension: Cubic yard compost reference', href: 'https://extension.oregonstate.edu/catalog/em-9308-how-use-compost-gardens-landscapes', note: 'Direct support for 1 yd³ = 27 ft³ bulk-compost and bulk-soil planning.' },
  { id: 'S24', tier: 'A', topic: 'Square-foot gardening', label: 'University of Illinois Extension: Square Foot Gardening', href: 'https://extension.illinois.edu/blogs/flowers-fruits-and-frass/2016-02-23-square-foot-gardening', note: 'Square-foot gardening uses compact raised beds divided into 1-ft² sections; plant for mature size and avoid bed compaction.' },
  { id: 'S25', tier: 'B', topic: "Mel's Mix", label: "Square Foot Gardening Foundation: Mel's Mix Resources", href: 'https://squarefootgardening.org/mels-mix-resources/', note: "Mel's Mix source for equal-volume style estimates; use as a method label, not a universal Extension prescription." },
  { id: 'S26', tier: 'A', topic: 'Tomato spacing and depth', label: 'University of Maryland Extension: Growing Tomatoes in a Home Garden', href: 'https://extension.umd.edu/resource/growing-tomatoes-home-garden', note: 'Tomato spacing depends on growth habit and support; supports conservative square-foot tomato warnings.' },
  { id: 'S27', tier: 'A', topic: 'Tomatoes and soil testing', label: 'University of Minnesota Extension: Growing tomatoes in home gardens', href: 'https://extension.umn.edu/vegetables/growing-tomatoes', note: 'Tomato pH, soil testing, nitrogen caution, and general tomato growing boundaries.' },
  { id: 'S28', tier: 'A', topic: 'Carrot spacing and depth', label: 'University of Minnesota Extension: Growing carrots and parsnips', href: 'https://extension.umn.edu/vegetables/growing-carrots-and-parsnips', note: 'Carrots need direct seeding, thinning room, moisture, and loose depth; root quality is variety and soil dependent.' },
  { id: 'S29', tier: 'A', topic: 'Carrot varieties and spacing', label: 'University of Maryland Extension: Growing Carrots in a Home Garden', href: 'https://extension.umd.edu/resource/growing-carrots-home-garden', note: 'Carrot varieties differ in root length; dense wide-row planting still requires thinning and variety awareness.' },
  { id: 'S30', tier: 'A', topic: 'Seed depth', label: 'University of Minnesota Extension: Starting seeds indoors', href: 'https://extension.umn.edu/planting-and-growing-guides/starting-seeds-indoors', note: 'Seed depth should follow package directions; fallback rules are only general guidance.' },
  { id: 'S31', tier: 'A', topic: 'Seed packet spacing and depth', label: 'University of Maryland Extension: Container seed spacing reminder', href: 'https://extension.umd.edu/resource/growing-vegetables-containers-and-salad-tables', note: 'For containers and raised-bed planning, follow seed packet spacing, depth, and timing for the crop.' },
  { id: 'S32', tier: 'A', topic: 'Radish depth', label: 'University of Minnesota Extension: Growing radishes in home gardens', href: 'https://extension.umn.edu/vegetables/growing-radishes', note: 'Radish beds should be loosened for short roots, with more depth for long types such as daikon.' },
  { id: 'S33', tier: 'A', topic: 'Vegetable planning and raised beds', label: 'Oregon State Extension: Vegetable Gardening in Oregon', href: 'https://extension.oregonstate.edu/catalog/pub/ec-871-vegetable-gardening-oregon', note: 'Raised beds can improve drainage and keep foot traffic out of growing beds; local climate still matters.' },
  { id: 'S34', tier: 'A', topic: 'Compost caution', label: 'University of Minnesota Extension: Too much compost and manure', href: 'https://extension.umn.edu/nutrient-management-specialty-crops/correct-too-much-compost-and-manure', note: 'Too much compost or manure can create nutrient and salt issues; compost-heavy mixes need caution.' },
  { id: 'S35', tier: 'A', topic: 'Common amendment myths', label: 'University of Minnesota Extension: Coffee grounds, eggshells and Epsom salts', href: 'https://extension.umn.edu/manage-soil-nutrients/coffee-grounds-eggshells-epsom-salts', note: 'Do not recommend Epsom salts or eggshells as default fixes; soil-test context matters.' },
  { id: 'S36', tier: 'A', topic: 'Soil test reports', label: 'University of Maryland Extension: Understanding Your Soil Test Report', href: 'https://extension.umd.edu/resource/understanding-your-soil-test-report', note: 'Soil reports show pH, phosphorus, potassium, magnesium, calcium, organic matter, and lab recommendations; calculators should not replace lab interpretation.' },
  { id: 'S37', tier: 'A', topic: 'Container volume and soil density', label: 'University of Maryland Extension: Growing Vegetables in Containers', href: 'https://extension.umd.edu/resource/growing-vegetables-containers', note: 'Container volume and plant-size guidance; notes that dense garden soil can restrict air and water movement in containers.' },
  { id: 'S38', tier: 'A', topic: 'Container size planning', label: 'University of Maryland Extension: Types of Containers for Growing Vegetables', href: 'https://extension.umd.edu/resource/types-containers-growing-vegetables', note: 'Minimum container volume and depth ranges for large, medium, and shallow crops; useful for container page boundaries.' },
  { id: 'S39', tier: 'A', topic: 'Raised bed material planning', label: 'Oregon State Extension: Raised bed gardening', href: 'https://extension.oregonstate.edu/sites/extd8/files/catalog/auto/FS270.pdf', note: 'Raised beds often require substantial soil or organic material, making local availability, bulk mixes, and cost comparisons important.' },
];

const SOURCE_MAP = new Map(SOURCE_LIBRARY.map((source) => [source.id, source]));

export function sourceById(id: string) {
  return SOURCE_MAP.get(id);
}

export function sourcesByIds(ids: string[]) {
  return ids.map((id) => sourceById(id)).filter((source): source is SourceEntry => Boolean(source));
}

function uniqueSourceIds(...groups: string[][]): string[] {
  const ids = new Set<string>();
  for (const group of groups) {
    for (const id of group) ids.add(id);
  }
  return [...ids];
}

export function sourceIdsForPage(slug = '', initial?: string): string[] {
  const primary: string[] = [];
  const supporting: string[] = [];
  const context = ['S05', 'S06', 'S07', 'S18', 'S22', 'S36'];

  if (!slug && !initial) primary.push('S01', 'S02', 'S03', 'S04', 'S06', 'S07', 'S22', 'S36');
  if (slug.includes('tomato')) primary.push('S26', 'S27', 'S35');
  if (slug.includes('carrot')) primary.push('S28', 'S29', 'S30');
  if (slug.includes('radish')) primary.push('S32');
  if (slug.includes('depth') || initial === 'depth') primary.push('S07', 'S26', 'S28', 'S29', 'S30', 'S32');
  if (slug.includes('spacing') || slug.includes('planting-layout') || slug.includes('tomato-plants') || initial === 'spacing') primary.push('S24', 'S26', 'S28', 'S29', 'S30', 'S31');
  if (slug.includes('container') || slug.includes('grow-bag') || slug.includes('planter') || slug.includes('six-inch-pots') || slug.includes('potting') || initial === 'containers') primary.push('S13', 'S14', 'S15', 'S16', 'S17', 'S31', 'S37', 'S38');
  if (slug.includes('mix') || slug.includes('compost') || slug.includes('topsoil') || initial === 'mix') primary.push('S07', 'S08', 'S09', 'S11', 'S25', 'S34', 'S35');
  if (slug.includes('bag') || initial === 'bags') primary.push('S09', 'S12', 'S22', 'S23');
  if (slug.includes('bulk') || initial === 'bulk') primary.push('S09', 'S12', 'S22', 'S23');
  if (slug.includes('top-off') || slug.includes('topoff') || slug.includes('checklist') || initial === 'topoff') primary.push('S09', 'S10', 'S11', 'S18');
  if (slug.includes('4x8') || slug.includes('raised-bed') || initial === 'raised') primary.push('S07', 'S08', 'S23', 'S39');
  if (slug.includes('6-inches') || slug.includes('8-inches') || slug.includes('10-inches') || slug.includes('12-inches') || slug.includes('18-inches') || slug.includes('24-inches')) primary.push('S07', 'S18', 'S20', 'S36', 'S39');

  supporting.push(...context);
  return uniqueSourceIds(primary, supporting);
}

export function pageSourceSummary(slug = '', initial?: string) {
  if (!slug && !initial) return 'Homepage sources show why BedSoil should behave like a task-first calculator: users compare dimensions, bag labels, cubic yards, and local growing assumptions before buying soil.';
  if (slug.includes('tomato')) return 'Tomato spacing and depth outputs are shown as conservative planning estimates because Extension guidance varies by growth habit, support, and cultivar.';
  if (slug.includes('carrot')) return 'Carrot spacing and depth outputs are planning estimates because variety length, thinning, soil looseness, moisture, and compaction affect real results.';
  if (slug.includes('spacing') || initial === 'spacing') return 'Spacing pages use square-foot grid math plus crop-specific assumptions; always verify seed packet spacing and mature plant size.';
  if (slug.includes('depth') || initial === 'depth') return 'Depth pages compare your input to conservative crop-depth assumptions; they are not local agronomic recommendations.';
  if (slug.includes('container') || slug.includes('grow-bag') || slug.includes('planter') || slug.includes('six-inch-pots') || slug.includes('potting') || initial === 'containers') return 'Container pages use volume math, but real fill depends on pot shape, drainage, media texture, and fill line.';
  if (slug.includes('mix') || initial === 'mix') return 'Mix pages split volume by ratio; they do not prescribe a universal soil recipe for every region.';
  if (slug.includes('bag') || initial === 'bags') return 'Bag pages require a package volume label; weight-only labels cannot be converted to volume without product density.';
  if (slug.includes('bulk') || initial === 'bulk') return 'Bulk pages use cubic-yard math and local price inputs; supplier minimums and delivery fees must be checked before ordering.';
  return 'Raised-bed pages use deterministic volume math plus planning assumptions for settling, freeboard, bag labels, and local growing conditions.';
}
