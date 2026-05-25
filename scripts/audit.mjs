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
const calculatorSource = fs.readFileSync(path.join(root, 'src/components/Calculator.tsx'), 'utf8');
function duplicates(items) {
  const map = new Map();
  items.forEach((item, index) => {
    const list = map.get(item) ?? [];
    list.push(slugs[index] ?? String(index));
    map.set(item, list);
  });
  return [...map.entries()].filter(([, list]) => list.length > 1);
}

assert(slugs.length === new Set(slugs).size, 'Duplicate slug found in src/lib/data/pages.ts');
assert(duplicates(titles).length === 0, `Duplicate title found: ${JSON.stringify(duplicates(titles))}`);
assert(duplicates(descriptions).length === 0, `Duplicate description found: ${JSON.stringify(duplicates(descriptions))}`);
const missing = requiredSlugs.filter((slug) => !slugs.includes(slug));
assert(missing.length === 0, `Missing required demand-document slug(s): ${missing.join(', ')}`);
assert(!slugs.includes('4x8-planting-layout'), 'Removed alias /4x8-planting-layout should not return as a duplicate thin page');
assert(calculatorSource.includes('const [settling, setSettling] = useState(10)'), 'Calculator default settling allowance should be 10%');
assert(calculatorSource.includes('[0, 10, 15].map'), 'Calculator should expose 0%, 10%, and 15% settling presets');
assert(calculatorSource.includes('bulkFulfillmentMode') && calculatorSource.includes('truckAvailability'), 'Bulk vs bags should expose delivery/pickup and truck availability controls');
assert(calculatorSource.includes('canEstimateBags ? activeBagResult.bagsNeeded') && calculatorSource.includes('Volume needed'), 'Weight-only bag labels should not display a misleading 0 bags result');

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
console.log(`BedSoil audit passed: ${slugs.length} slugs, ${requiredSlugs.length} required pages, unique title/description, no runtime placeholders, Vercel ignoreCommand present.`);
