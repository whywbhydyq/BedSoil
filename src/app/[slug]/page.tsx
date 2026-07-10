import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calculator } from '@/components/Calculator';
import { Disclaimer } from '@/components/Disclaimer';
import { FAQ } from '@/components/FAQ';
import { RelatedLinks } from '@/components/RelatedLinks';
import { PlanningSources } from '@/components/PlanningSources';
import { allPages, pageMetadata } from '@/lib/data/pages';
import { fourByEightDepthCopy, fourByEightDepthOutputsForSlug } from '@/lib/data/pageContent';
import { isIndexableSlug } from '@/lib/publicPolicy';
import { SITE_URL } from '@/lib/site';

function calculatorStructuredData(page: { title: string; description: string; slug: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: page.title,
    description: page.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    url: `${SITE_URL}/${page.slug}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

function presetIntro(page: { initial?: string; formula?: string; example?: string }) {
  const mode = page.initial ?? 'raised';
  const labels: Record<string, string> = {
    raised: 'raised bed dimensions', bags: 'soil volume to bag count', bulk: 'bagged soil versus bulk delivery',
    mix: 'soil mix component split', containers: 'container or grow-bag volume', spacing: 'square-foot planting layout',
    topoff: 'annual top-off material', depth: 'crop depth suitability', cost: 'raised bed project cost',
    multi: 'multiple beds and containers', shapes: 'non-rectangular raised bed volume',
  };
  return {
    modeLabel: labels[mode] ?? 'calculator preset',
    formula: page.formula ?? 'The active calculator shows the formula used for the selected mode.',
    example: page.example ?? 'Change the inputs to calculate a result for your project.',
  };
}

function mistakesFor(initial?: string, slug?: string) {
  if (slug?.includes('tomato')) return ['Applying one tomato spacing rule to every variety and support system.', 'Ignoring sunlight, irrigation, airflow, and local growing conditions.', 'Treating a plant-count estimate as a yield guarantee.'];
  if (slug?.includes('carrot')) return ['Using a shallow or compacted bed for a long-root variety.', 'Skipping thinning and expecting every seedling to size correctly.', 'Ignoring stones and clods that can deform roots.'];
  switch (initial) {
    case 'bags': return ['Using pounds as a volume measurement.', 'Forgetting that bag count must round up.', 'Mixing liters, dry quarts, gallons, and cubic feet without conversion.'];
    case 'bulk': return ['Ignoring delivery minimums and delivery fees.', 'Comparing prices without accounting for overbuy.', 'Ordering the exact calculated amount with no allowance for settling.'];
    case 'mix': return ['Treating a ratio calculator as a universal soil recipe.', 'Entering custom percentages that do not total 100%.', 'Skipping soil-test and drainage considerations.'];
    case 'containers': return ['Assuming the labeled gallon size equals exact filled volume.', 'Packing media so tightly that useful volume changes.', 'Using dense garden soil where a lighter container mix is needed.'];
    case 'spacing': return ['Treating grid counts as a yield guarantee.', 'Ignoring mature plant size and trellis layout.', 'Skipping the seed packet or local guidance.'];
    case 'depth': return ['Treating the result as local agronomic advice.', 'Ignoring whether the bed sits on native soil or a hard surface.', 'Forgetting that variety and soil looseness affect root depth.'];
    case 'topoff': return ['Adding material without measuring the actual soil drop.', 'Using compost-only top-off every year without soil testing.', 'Confusing top-off material with mulch.'];
    default: return ['Measuring outside dimensions instead of inside fill dimensions.', 'Forgetting freeboard below the bed rim.', 'Buying bags without checking the package volume.'];
  }
}

export function generateStaticParams() {
  return allPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = allPages.find((candidate) => candidate.slug === slug);
  return page ? pageMetadata(page) : {};
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = allPages.find((candidate) => candidate.slug === slug);
  if (!page) notFound();

  if (page.legal) {
    return <main className="page"><section className="hero"><p className="eyebrow">BedSoil</p><h1>{page.title}</h1><p>{page.description}</p></section><section className="content-card">{page.legal.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section><RelatedLinks slugs={['raised-bed-soil-calculator', 'soil-bags-calculator', 'raised-bed-soil-mix-calculator']} /></main>;
  }

  const indexable = isIndexableSlug(page.slug);
  const intro = presetIntro(page);
  const depthOutputs = fourByEightDepthOutputsForSlug(page.slug);
  const mistakes = mistakesFor(page.initial, page.slug);

  return (
    <main className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorStructuredData(page)) }} />
      <Calculator initial={page.initial} presetSlug={page.slug} />

      <section className="hero tool-page-intro">
        <p className="eyebrow">Raised Bed Soil & Planting Calculator</p>
        <h1>{page.title}</h1>
        <p>{page.description}</p>
      </section>

      <section className="content-card preset-summary">
        <h2>Preset: {intro.modeLabel}</h2>
        <p><b>Formula:</b> {intro.formula}</p>
        <p><b>Worked example:</b> {intro.example}</p>
        <p>Adjust the live inputs above before copying the shopping list, printing the result, or buying material.</p>
      </section>

      {depthOutputs.length > 0 ? (
        <section className="content-card depth-output-summary">
          <h2>{depthOutputs.length === 1 ? `4×8 bed at ${depthOutputs[0].depthInches} inches` : '4×8 depth comparison'}</h2>
          <p>These rows use one 4×8 bed, 0 in freeboard, 10% settling allowance, and 2 ft³ bags. Change the live calculator for other assumptions.</p>
          <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Depth</th><th>Before settling</th><th>With 10%</th><th>2 ft³ bags</th><th>Planning note</th></tr></thead><tbody>{depthOutputs.map((row) => <tr key={row.depthInches}><td>{row.slug === page.slug ? `${row.depthInches} in` : <Link href={`/${row.slug}`}>{row.depthInches} in</Link>}</td><td>{row.baseFt3.toFixed(2)} ft³</td><td>{row.finalFt3.toFixed(2)} ft³ / {row.yd3.toFixed(2)} yd³</td><td>{row.twoFtBags}</td><td>{row.fitNote}</td></tr>)}</tbody></table></div>
          <p className="muted-card">Quick copy: {depthOutputs.map(fourByEightDepthCopy).join(' ')}</p>
        </section>
      ) : null}

      <section className="content-card">
        {indexable ? <><h2>How to use this calculator</h2><ol><li>Confirm the preset and unit labels.</li><li>Replace every default that differs from your bed, container, bag, price, or planting plan.</li><li>Review volume, bag count, cost, warnings, and rounding.</li><li>Check package labels and local conditions before purchasing or planting.</li></ol></> : null}
        <h2>What to verify</h2>
        <ul>{mistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul>
        {page.notes?.length ? <><h2>Page-specific notes</h2><ul>{page.notes.map((note) => <li key={note}>{note}</li>)}</ul></> : null}
      </section>

      {indexable ? <><PlanningSources slug={page.slug} initial={page.initial} /><FAQ /><Disclaimer /></> : <Disclaimer />}
      <RelatedLinks slugs={page.related ?? ['raised-bed-soil-calculator', 'soil-bags-calculator']} />
    </main>
  );
}
