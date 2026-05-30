import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pageFile = path.join(root, 'src/lib/data/pages.ts');
const pageSource = fs.readFileSync(pageFile, 'utf8');
const slugs = [...pageSource.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1]);
const titles = [...pageSource.matchAll(/title:\s*'([^']+)'/g)].map((match) => match[1]);
const descriptions = [...pageSource.matchAll(/description:\s*'([^']+)'/g)].map((match) => match[1]);

const requiredSlugs = [
  'raised-bed-soil-calculator',
  '4x8-raised-bed-soil-calculator',
  'how-much-soil-for-4x8-raised-bed',
  'how-many-bags-of-soil-for-raised-bed',
  '4x8-raised-bed-12-inches-soil',
  '4x8-raised-bed-10-inches-soil',
  '4x4-raised-bed-soil-calculator',
  '3x6-raised-bed-soil-calculator',
  '2x8-raised-bed-soil-calculator',
  'raised-bed-cubic-feet-calculator',
  'soil-bags-calculator',
  '40-qt-soil-bag-calculator',
  '1-5-cubic-foot-soil-bag-calculator',
  '2-cubic-foot-soil-bag-calculator',
  'cubic-feet-to-soil-bags-calculator',
  'cubic-yards-to-soil-bags-calculator',
  'liters-to-cubic-feet-soil-calculator',
  'how-many-40-lb-bags-of-soil-do-i-need',
  'bulk-soil-vs-bags-calculator',
  'raised-bed-soil-cost-calculator',
  'cheapest-way-to-fill-raised-beds',
  'how-much-bulk-soil-for-raised-beds',
  'cubic-yards-of-soil-for-raised-beds',
  'raised-bed-soil-mix-calculator',
  'compost-topsoil-mix-calculator',
  'mels-mix-calculator',
  'how-much-compost-for-raised-bed',
  'topsoil-compost-ratio-raised-bed',
  'container-soil-calculator',
  'planter-soil-volume-calculator',
  'grow-bag-soil-calculator',
  '10-gallon-grow-bag-soil-calculator',
  '20-gallon-grow-bag-soil-calculator',
  '5-gallon-bucket-soil-calculator',
  'how-much-soil-for-45-six-inch-pots',
  'square-foot-garden-spacing-calculator',
  '4x8-raised-bed-planting-layout',
  'how-many-tomato-plants-in-4x8-raised-bed',
  'tomato-spacing-raised-bed',
  'pepper-spacing-raised-bed',
  'carrot-spacing-square-foot-garden',
  'lettuce-spacing-square-foot-garden',
  'cucumber-spacing-raised-bed',
  'raised-bed-depth-for-tomatoes',
  'raised-bed-depth-for-carrots',
];

const runtimeFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (/\.(ts|tsx|js|jsx|css|json|txt)$/.test(entry.name)) runtimeFiles.push(fullPath);
  }
}
walk(path.join(root, 'src'));
walk(path.join(root, 'public'));
runtimeFiles.push(path.join(root, 'package.json'), path.join(root, 'vercel.json'));

const errors = [];
function assert(condition, message) {
  if (!condition) errors.push(message);
}
const homeSource = fs.readFileSync(path.join(root, 'src/app/page.tsx'), 'utf8');
const layoutSource = fs.readFileSync(path.join(root, 'src/app/layout.tsx'), 'utf8');
const calculatorSource = fs.readFileSync(path.join(root, 'src/components/Calculator.tsx'), 'utf8');
const sitemapSource = fs.readFileSync(path.join(root, 'src/app/sitemap.ts'), 'utf8');
const slugPageSource = fs.readFileSync(path.join(root, 'src/app/[slug]/page.tsx'), 'utf8');
const adSlotSource = fs.readFileSync(path.join(root, 'src/components/AdSlot.tsx'), 'utf8');
const unitsSource = fs.readFileSync(path.join(root, 'src/lib/calculators/units.ts'), 'utf8');
const spacingSource = fs.readFileSync(path.join(root, 'src/lib/calculators/spacing.ts'), 'utf8');
const containersSource = fs.readFileSync(path.join(root, 'src/lib/calculators/containers.ts'), 'utf8');
const nextConfigSource = fs.readFileSync(path.join(root, 'next.config.ts'), 'utf8');
const planningSourcesSource = fs.readFileSync(path.join(root, 'src/components/PlanningSources.tsx'), 'utf8');
const sourceLibrarySource = fs.readFileSync(path.join(root, 'src/lib/data/sources.ts'), 'utf8');
const pageContentSource = fs.readFileSync(path.join(root, 'src/lib/data/pageContent.ts'), 'utf8');
const costSource = fs.readFileSync(path.join(root, 'src/lib/calculators/cost.ts'), 'utf8');
const bagsSource = fs.readFileSync(path.join(root, 'src/lib/calculators/bags.ts'), 'utf8');
const soilMixSource = fs.readFileSync(path.join(root, 'src/lib/calculators/soilMix.ts'), 'utf8');
const bulkCostSource = fs.readFileSync(path.join(root, 'src/lib/calculators/bulkCost.ts'), 'utf8');
function duplicates(items) {
  const map = new Map();
  items.forEach((item, index) => {
    const list = map.get(item) ?? [];
    list.push(slugs[index] ?? String(index));
    map.set(item, list);
  });
  return [...map.entries()].filter(([, list]) => list.length > 1);
}

function quotedStrings(value) {
  return [...value.matchAll(/'([^']+)'/g)].map((match) => match[1]);
}

const sourceIds = [...sourceLibrarySource.matchAll(/id:\s*'([^']+)'/g)].map((match) => match[1]);
const referencedSourceIds = quotedStrings(
  [...sourceLibrarySource.matchAll(/(?:primary|supporting)\.push\(([^)]*)\)|const context = \[([^\]]*)\]/g)]
    .map((match) => match[1] ?? match[2] ?? '')
    .join(',')
).filter((id) => /^S\d+$/.test(id));
const relatedSlugs = [...pageSource.matchAll(/related:\s*\[([^\]]+)\]/g)]
  .flatMap((match) => quotedStrings(match[1]));


function relatedForSlug(slug) {
  const match = pageSource.match(new RegExp(String.raw`slug:\s*'${slug}'[\s\S]*?related:\s*\[([^\]]+)\]`));
  return match ? quotedStrings(match[1]) : [];
}

function homeRelatedSlugs() {
  const match = homeSource.match(/const related = \[([\s\S]*?)\];/);
  return match ? quotedStrings(match[1]) : [];
}


const fourByEightDepthSlugs = [
  '4x8-raised-bed-6-inches-soil',
  '4x8-raised-bed-8-inches-soil',
  '4x8-raised-bed-10-inches-soil',
  '4x8-raised-bed-12-inches-soil',
  '4x8-raised-bed-18-inches-soil',
  '4x8-raised-bed-24-inches-soil',
];


const shareNumericParams = [
  'ctop', 'ccomp', 'cpot',
  'g1gal', 'g1qty', 'g2gal', 'g2qty',
  'contL', 'contW', 'contD', 'bottomD', 'contQty',
  'costKit', 'costCompost', 'costMulch', 'costHardware', 'tax',
  'm2l', 'm2w', 'm2d', 'm2q', 'm3l', 'm3w', 'm3d', 'm3q',
  'shapeDepth',
];
const shareSelectGuards = [
  "const nextUnitPreset = params.get('up')",
  "const nextMix = params.get('mix')",
  "const nextContainerMode = params.get('container')",
  "setUnitPreset(nextUnitPreset)",
  "setMix(nextMix)",
  "setContainerMode(nextContainerMode)",
];

assert(slugs.length === new Set(slugs).size, 'Duplicate slug found in src/lib/data/pages.ts');
assert(relatedSlugs.every((slug) => slugs.includes(slug)), `Broken related link slug(s): ${relatedSlugs.filter((slug) => !slugs.includes(slug)).join(', ')}`);
assert(fourByEightDepthSlugs.every((slug) => pageSource.includes(`'${slug}'`)), 'Every 4x8 depth page should remain present');
assert(homeRelatedSlugs().every((slug) => slugs.includes(slug)), `Broken homepage related link slug(s): ${homeRelatedSlugs().filter((slug) => !slugs.includes(slug)).join(', ')}`);
assert(fourByEightDepthSlugs.every((slug) => relatedForSlug(slug).includes('4x8-raised-bed-soil-calculator')), 'Every 4x8 depth page should link back to the 4x8 hub');
assert(relatedForSlug('4x8-raised-bed-soil-calculator').filter((slug) => fourByEightDepthSlugs.includes(slug)).length === fourByEightDepthSlugs.length, '4x8 hub should link to every depth preset page');
assert(pageContentSource.includes('slug: fourByEightDepthSlug(depthInches)') && slugPageSource.includes('<Link href={`/${row.slug}`}>'), '4x8 depth summary rows should link to depth preset pages');
assert(duplicates(titles).length === 0, `Duplicate title found: ${JSON.stringify(duplicates(titles))}`);
assert(duplicates(descriptions).length === 0, `Duplicate description found: ${JSON.stringify(duplicates(descriptions))}`);
const missing = requiredSlugs.filter((slug) => !slugs.includes(slug));
assert(missing.length === 0, `Missing required demand-document slug(s): ${missing.join(', ')}`);
assert(!slugs.includes('4x8-planting-layout'), 'Removed alias /4x8-planting-layout should not return as a duplicate thin page');
assert(calculatorSource.includes('const [settling, setSettling] = useState(10)'), 'Calculator default settling allowance should be 10%');
assert(calculatorSource.includes('[0, 10, 15].map'), 'Calculator should expose 0%, 10%, and 15% settling presets');
assert(calculatorSource.includes('bulkFulfillmentMode') && calculatorSource.includes('truckAvailability'), 'Bulk vs bags should expose delivery/pickup and truck availability controls');
assert(calculatorSource.includes('canEstimateBags ? activeBagResult.bagsNeeded') && calculatorSource.includes('Volume needed'), 'Weight-only bag labels should not display a misleading 0 bags result');
assert(sitemapSource.includes('...allPages.map'), 'Sitemap should include every page from allPages, not a restricted slug subset');
assert(!sitemapSource.includes('indexedSlugs'), 'Sitemap should not use a restricted indexedSlugs whitelist');
assert(slugPageSource.includes('url: `${SITE_URL}/${page.slug}`'), 'Calculator JSON-LD should use absolute SITE_URL URLs');
assert(adSlotSource.includes("'result'") && calculatorSource.includes('<AdSlot placement="result" />'), 'Result-area ad placeholder should be implemented inside the calculator result panel');
assert(calculatorSource.includes('safeNonNegativeNumber') && calculatorSource.includes('setter(safeNonNegativeNumber(Number(raw)))'), 'Shared URL numeric parameters should be clamped to non-negative finite values');
assert(calculatorSource.includes('Current inputs produce 0 soil volume'), 'Calculator should explain zero-volume results when quantity or dimensions are zero');
assert(calculatorSource.includes('const activeBulkResult = useMemo(() => compareBulkVsBags(activeVolume.finalVolumeFt3') && !calculatorSource.includes('const bulkResult = useMemo(() => compareBulkVsBags(sourceVolume.finalVolumeFt3'), 'Bulk order and savings should be calculated from the current active volume, not a stale source volume');
assert(calculatorSource.includes("const isVolumeTask = tab !== 'spacing' && tab !== 'depth'"), 'Spacing and depth modes should be scoped as non-volume tasks');
assert(calculatorSource.includes('const scopedWarnings = isVolumeTask') && calculatorSource.includes("...(tab === 'cost' ? costResult.warnings : [])"), 'Warnings should be scoped so inactive bag/bulk/mix/cost warnings do not leak into spacing/depth tasks');
assert(calculatorSource.includes("tab === 'spacing' ? spacingShoppingList : tab === 'depth' ? depthShoppingList : volumeShoppingList"), 'Copy/download output should be task-specific for spacing and depth instead of exporting hidden soil-volume commerce data');
assert(calculatorSource.includes('task-result-cards') && calculatorSource.includes('volume-result-cards'), 'Result cards should show task-specific cards for spacing/depth and volume cards only for volume modes');
assert(calculatorSource.includes("tab === 'spacing' ? [") && calculatorSource.includes("tab === 'depth' ? [") && calculatorSource.includes('open cost tab for project-cost inputs'), 'CSV export should be task-specific and avoid irrelevant hidden volume/cost fields');
assert(calculatorSource.includes("const mixBreakdownVolume = tab === 'mix' ? sourceVolume : activeVolume") && calculatorSource.includes('Mix breakdown for active volume'), 'Mix breakdown should follow the current active result volume outside the mix tab, not a stale raised/manual source volume');
assert(calculatorSource.includes("const activeVolumeWarnings = tab === 'containers' ? containerResult.warnings") && calculatorSource.includes('needsRaisedVolumeInputs') && calculatorSource.includes('needsManualVolumeInput'), 'Warnings and validation should be scoped to the current calculator mode instead of always showing raised-bed messages');
assert(calculatorSource.includes('empty-preview') && calculatorSource.includes('Preview is capped at'), 'Square-foot preview should not show a fake 1×1 grid for zero dimensions and should disclose capped visual previews');
assert(calculatorSource.includes('soilCost: activeBagResult.totalCost ?? 0'), 'Project cost should use the active bag result so container, top-off, shape, and multi results export consistent cost estimates');
assert(calculatorSource.includes('const multiCombinedResult = useMemo(() => makeVolumeResult') && calculatorSource.includes("tab === 'multi' ? multiCombinedResult"), 'Multi mode should combine raised-bed rows and container rows for the focused result, bag count, CSV, and shareable shopping list');
assert(costSource.includes('count > 0 ? total / count : 0') && costSource.includes("warn('cost-bed-count-zero'"), 'Cost per bed should not silently divide by one when bed count is zero');
assert(bulkCostSource.includes("warn('bulk-zero-volume'") && bulkCostSource.includes('bulkOrderYd3: 0') && bulkCostSource.includes('serviceCost: 0'), 'Zero-volume bulk comparison should not suggest a minimum bulk order or charge delivery/pickup service cost');
assert(bulkCostSource.includes("recommendation: !bagResult.canEstimateBags ? 'notComparable'") && calculatorSource.includes('Need comparable inputs'), 'Weight-only bag labels should not produce a misleading bulk-vs-bags recommendation');
assert(bulkCostSource.includes('function safeNonNegative') && bulkCostSource.includes('safeMinimumOrderYards') && bulkCostSource.includes('safePricePerCubicYard') && bulkCostSource.includes('safeNonNegative(bagInput.bagPrice)'), 'Bulk comparison should sanitize non-finite price, delivery, pickup, minimum-order, and bag-price inputs');
assert(bagsSource.includes('const safeRequiredVolumeFt3 = safeNonNegative(requiredVolumeFt3)') && bagsSource.includes('safeBagPrice') && bagsSource.includes('!Number.isFinite(input.bagSize)'), 'Soil bag calculator should sanitize non-finite required volume, bag size, and bag price');
assert(soilMixSource.includes('function safeRatio') && soilMixSource.includes('mix-non-finite-ratio') && soilMixSource.includes('normalizedComponents.map'), 'Soil mix calculator should sanitize non-finite ratio inputs before computing component volumes');
assert(unitsSource.includes('safeNonNegativeNumber') && unitsSource.includes('baseVolumeFt3: safeBaseVolumeFt3'), 'Core volume helpers should clamp non-finite or negative volume outputs');
assert(containersSource.includes('Math.max(0, Math.floor(Number.isFinite(value) ? value : 0))'), 'Container quantity 0 should produce zero volume instead of a hidden one-container estimate');
assert(containersSource.includes('function safeNonNegative') && containersSource.includes('safeNonNegative(input.gallons)'), 'Grow-bag gallons should sanitize non-finite values before volume conversion');
assert(fs.readFileSync(path.join(root, 'src/lib/calculators/raisedBed.ts'), 'utf8').includes("warn('bed-count-zero'") && fs.readFileSync(path.join(root, 'src/lib/calculators/raisedBed.ts'), 'utf8').includes('Math.max(0, Math.floor(Number.isFinite(input.numberOfBeds) ? input.numberOfBeds : 0))'), 'Raised bed quantity 0 should produce zero volume with a clear warning');
assert(fs.readFileSync(path.join(root, 'src/lib/calculators/shapes.ts'), 'utf8').includes('function shapeCount') && fs.readFileSync(path.join(root, 'src/lib/calculators/shapes.ts'), 'utf8').includes('const count = shapeCount(input.numberOfBeds);'), 'Shape quantity 0 should produce zero volume instead of a hidden one-bed estimate');
assert(fs.readFileSync(path.join(root, 'src/lib/calculators/topOff.ts'), 'utf8').includes('Math.max(0, Math.floor(Number.isFinite(input.numberOfBeds) ? input.numberOfBeds : 0))'), 'Top-off quantity 0 should produce zero volume instead of a hidden one-bed estimate');
assert(spacingSource.includes('lengthSquares') && spacingSource.includes('widthSquares'), 'Square-foot spacing should clamp each dimension before multiplying');
assert(spacingSource.includes('Number.isFinite(input.customPlantsPerSquare)'), 'Square-foot custom plant density should sanitize non-finite values before multiplying');
assert(homeSource.includes('export const metadata') && homeSource.includes("canonical: '/'"), 'Homepage should define explicit metadata and canonical URL');
assert(homeSource.includes('url: SITE_URL') && homeSource.includes('potentialAction'), 'Homepage WebApplication JSON-LD should include SITE_URL and a calculator action target');
assert(homeSource.includes('Enter bed size and bag size') && homeSource.includes('Load 4×8 presets'), 'Homepage hero should promise the concrete bed-size-to-shopping-list task');
assert(calculatorSource.includes("(['raised', 'bags', 'bulk'] as const)") && calculatorSource.includes('More planners: mix, containers'), 'Homepage calculator should prioritize raised/bags/bulk while preserving more planners');
assert(calculatorSource.includes('Advanced assumptions: freeboard and settling'), 'Raised bed advanced assumptions should be collapsible instead of blocking the core input path');
assert(calculatorSource.includes('quick-action-row') && calculatorSource.includes('Primary result actions'), 'Primary result actions should appear immediately below the focused result summary');
assert(calculatorSource.includes('const raisedBedSourceControls') && calculatorSource.includes('embedded-source-panel'), 'Tabs that depend on raised bed source should expose editable bed dimensions instead of relying on hidden state');
assert((calculatorSource.match(/raisedBedSourceControls/g) ?? []).length >= 6, 'Raised bed source controls should be reused in bags, bulk, mix, cost, and multi modes');
assert(!calculatorSource.includes('Using the raised-bed dimensions from the main calculator'), 'Raised-bed source modes should not hide the dimensions behind a static note');
assert(slugPageSource.includes('Preset loaded:') && slugPageSource.includes('Common mistakes') && slugPageSource.includes('mistakesFor(page.initial, page.slug)'), 'Long-tail calculator pages should include preset-loaded, example, and common-mistake content');
assert(sourceLibrarySource.includes('University of Minnesota Extension') && sourceLibrarySource.includes('University of Maryland Extension') && sourceLibrarySource.includes('SOURCE_LIBRARY') && sourceLibrarySource.includes('S39'), 'Planning source library should include the curated Extension-style source set through S35');
assert(sourceIds.length === new Set(sourceIds).size, 'Duplicate source ID found in SOURCE_LIBRARY');
assert(referencedSourceIds.every((id) => sourceIds.includes(id)), `Unknown source ID reference(s): ${referencedSourceIds.filter((id) => !sourceIds.includes(id)).join(', ')}`);
assert(!sourceLibrarySource.includes("slug.includes('pot')"), 'Source routing should not use broad pot substring matching that can misclassify compost/topsoil content');
assert(sourceLibrarySource.includes("slug.includes('planter')") && sourceLibrarySource.includes("slug.includes('six-inch-pots')"), 'Container source summaries should cover planter and six-inch-pot long-tail pages without broad pot substring routing');
assert(sourceLibrarySource.includes('Understanding Your Soil Test Report') && sourceLibrarySource.includes('Growing Vegetables in Containers') && sourceLibrarySource.includes('Raised bed gardening'), 'Source library should include updated soil-test-report, container-volume, and raised-bed material-planning references from online research');
assert(sourceLibrarySource.includes("primary.push('S13', 'S14', 'S15', 'S16', 'S17', 'S31', 'S37', 'S38')"), 'Container pages should route to current container-volume and minimum-container-size sources');
assert(sourceLibrarySource.includes("primary.push('S07', 'S08', 'S23', 'S39')"), 'Raised-bed pages should route to raised-bed material planning sources');
assert(planningSourcesSource.includes('sourceIdsForPage') && planningSourcesSource.includes('Source library coverage'), 'Planning source component should render page-specific source groups instead of one uniform source list');
assert(planningSourcesSource.includes("slug = ''") && sourceLibrarySource.includes("sourceIdsForPage(slug = ''"), 'PlanningSources should allow homepage usage without crashing on an undefined slug');
assert(sourceLibrarySource.indexOf("if (!slug && !initial)") < sourceLibrarySource.indexOf("if (slug.includes('tomato'))"), 'Homepage source selection should define a dedicated source path before slug-specific checks');
assert(slugPageSource.includes('throw new Error(`Unknown BedSoil page: ${slug}`)'), 'Slug page should explicitly narrow unknown pages after notFound for static type safety');
assert(pageContentSource.includes('FOUR_BY_EIGHT_OUTPUTS') && slugPageSource.includes('depth-output-summary') && slugPageSource.includes('twoFtBags'), '4x8 depth pages should include concrete ft3, yd3, and 2-ft3 bag summaries');
assert(slugPageSource.indexOf('<Calculator initial={page.initial} presetSlug={page.slug} />') < slugPageSource.indexOf('depth-output-summary'), '4x8 depth output summary should sit below the calculator so preset pages do not block the tool path');
assert(spacingSource.includes('sourceNote?: string') && calculatorSource.includes('Source boundary:'), 'Spacing/depth result copy should expose source-boundary microcopy for crop assumptions');
assert(spacingSource.includes('basis: string') && spacingSource.includes('planning assumption'), 'Crop spacing data should expose the assumption basis rather than presenting crop counts as authoritative');
assert(layoutSource.includes("import type { ReactNode } from 'react';") && !layoutSource.includes('React.ReactNode'), 'Layout should import ReactNode explicitly instead of relying on the global React namespace');
assert(calculatorSource.includes('writeClipboardText') && calculatorSource.includes("document.execCommand('copy')"), 'Clipboard actions should include a fallback for restricted Clipboard API contexts');
assert(calculatorSource.includes('csvValue') && calculatorSource.includes('const csvRows'), 'CSV downloads should avoid locale-formatted comma numbers and quote CSV cells safely');
assert(shareNumericParams.every((key) => calculatorSource.includes(`['${key}', set`)), `Shared URL numeric restore missing setter(s): ${shareNumericParams.filter((key) => !calculatorSource.includes(`['${key}', set`)).join(', ')}`);
assert(shareNumericParams.every((key) => calculatorSource.includes(`${key}: String(`)), `Shared URL creation missing numeric param(s): ${shareNumericParams.filter((key) => !calculatorSource.includes(`${key}: String(`)).join(', ')}`);
assert(shareSelectGuards.every((needle) => calculatorSource.includes(needle)), `Shared URL select restore missing guard(s): ${shareSelectGuards.filter((needle) => !calculatorSource.includes(needle)).join(', ')}`);
assert(calculatorSource.includes('up: unitPreset') && calculatorSource.includes('container: containerMode') && calculatorSource.includes('mix,'), 'Shared URL should serialize unit preset, mix template, and container mode');
assert(calculatorSource.includes('const [shapeDepth, setShapeDepth] = useState(12)') && calculatorSource.includes('depth: shapeDepth') && calculatorSource.includes('value={shapeDepth} setValue={setShapeDepth}'), 'Shape planner should use an independent inch depth state so metric raised-bed depth cannot be misread as shape inches');
assert(calculatorSource.includes("setFreeboard(convertLengthInput(freeboard, depthUnit, 'cm'))") && calculatorSource.includes("setTopOffDepth(convertLengthInput(topOffDepth, depthUnit, 'cm'))") && calculatorSource.includes("setFreeboard(convertLengthInput(freeboard, depthUnit, 'in'))") && calculatorSource.includes("setTopOffDepth(convertLengthInput(topOffDepth, depthUnit, 'in'))"), 'Unit preset switching should convert freeboard and top-off depth along with bed depth');
assert(calculatorSource.includes("setUnitPreset('us'); setLength(4); setWidth(8); setDepth(presetDepth)") && calculatorSource.includes("if (fourByEightDepthMatch) { setUnitPreset('us')"), '4x8 preset buttons and pages should keep the displayed unit preset consistent with ft/in values');
assert(calculatorSource.includes("depthUnit === 'ft' ? [1 / 12, 2 / 12, 3 / 12]") && calculatorSource.includes("depthUnit === 'cm' ? [2.5, 5, 7.5]"), 'Top-off preset buttons should stay equivalent to 1/2/3 inches across depth units');
assert(nextConfigSource.includes('X-Content-Type-Options') && nextConfigSource.includes('Referrer-Policy') && nextConfigSource.includes('Permissions-Policy'), 'Basic security response headers should be configured');
assert(!fs.existsSync(path.join(root, 'tsconfig.tsbuildinfo')), 'tsconfig.tsbuildinfo should not be committed or packaged');
assert(fs.readFileSync(path.join(root, '.gitignore'), 'utf8').includes('*.tsbuildinfo'), '.gitignore should ignore TypeScript build info files');
const packageLock = fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8');
assert(!packageLock.includes('registry.npmmirror.com'), 'package-lock.json should not pin dependencies to registry.npmmirror.com');

for (const file of runtimeFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file);
  assert(!/meta\s+keywords|keywords\s*:/.test(source), `Runtime meta keywords reference found in ${rel}`);
  assert(!/coming soon|lorem ipsum|TODO|FIXME/i.test(source), `Placeholder text found in ${rel}`);
  assert(!/@\/lib\/calculators\/index/.test(source), `Bypass import of public calculator barrel found in ${rel}`);
}

const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
assert(vercel.ignoreCommand === 'node scripts/skip-old-vercel-builds.mjs', 'vercel.json ignoreCommand is missing or changed');
const ads = fs.readFileSync(path.join(root, 'public/ads.txt'), 'utf8');
assert(ads.includes('google.com, pub-1653188471819736, DIRECT, f08c47fec0942fa0'), 'ads.txt publisher line missing');

if (errors.length) {
  console.error('BedSoil audit failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`BedSoil audit passed: ${slugs.length} slugs, ${requiredSlugs.length} required pages, all-page sitemap, result ad slot, homepage task-fit optimization, clamped numeric inputs, unique title/description, safe source routing, visible-source-controls, clipboard/CSV/share-state/active-volume/mode-scoped-warnings/task-specific-exports/zero-quantity/unit-consistency/bulk-comparison/bag/mix/container/spacing hardening, no runtime placeholders, Vercel ignoreCommand present.`);
