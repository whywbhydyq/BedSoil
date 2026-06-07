import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdSlot } from '@/components/AdSlot';
import { Calculator } from '@/components/Calculator';
import { JsonLd } from '@/components/JsonLd';
import { Methodology } from '@/components/Methodology';
import { ContentQualityPanel } from '@/components/ContentQualityPanel';
import { PageInsights } from '@/components/PageInsights';
import { SoilPlanningDiagram } from '@/components/SoilPlanningDiagram';
import { Disclaimer } from '@/components/Disclaimer';
import { FAQ } from '@/components/FAQ';
import { RelatedLinks } from '@/components/RelatedLinks';
import { AffiliateSlot } from '@/components/AffiliateSlot';
import { PlanningSources } from '@/components/PlanningSources';
import { ProgrammaticPlanningPanel } from '@/components/ProgrammaticPlanningPanel';
import { TopicClusterPanel } from '@/components/TopicClusterPanel';
import { FlowPathPanel } from '@/components/FlowPathPanel';
import { SxoIntentPanel } from '@/components/SxoIntentPanel';
import { ImageSeoPanel } from '@/components/ImageSeoPanel';
import { VisualTaskPanel } from '@/components/VisualTaskPanel';
import { CompetitorComparisonPage } from '@/components/CompetitorComparisonPage';
import { GeoCitationPanel } from '@/components/GeoCitationPanel';
import { allPages, pageMetadata } from '@/lib/data/pages';
import { contentQualityForPage } from '@/lib/data/contentQuality';
import { fourByEightDepthCopy, fourByEightDepthOutputsForSlug } from '@/lib/data/pageContent';
import { pageStructuredData } from '@/lib/seo/jsonLd';
import { comparisonPageForSlug } from '@/lib/data/competitorPages';



function presetIntro(page: { title: string; initial?: string; formula?: string; example?: string }) {
  const mode = page.initial ?? 'raised';
  const modeLabels: Record<string, string> = {
    raised: 'raised bed dimensions',
    bags: 'soil volume to bag count',
    bulk: 'bagged soil versus bulk delivery',
    mix: 'soil mix component split',
    containers: 'container or grow-bag volume',
    spacing: 'square-foot planting layout',
    topoff: 'annual top-off material',
    depth: 'crop depth suitability',
    cost: 'raised bed project cost',
    multi: 'multiple beds and containers',
    shapes: 'non-rectangular raised bed volume',
  };
  return {
    modeLabel: modeLabels[mode] ?? 'calculator preset',
    task: `This page opens the calculator for ${modeLabels[mode] ?? 'this preset'} so the result is generated from editable inputs, not a static article.`,
    formula: page.formula ?? 'The calculator uses the formula shown by the active tool mode.',
    example: page.example ?? 'Change the inputs to produce an updated example result.',
  };
}

function mistakesFor(initial?: string, slug?: string) {
  if (slug?.includes('tomato')) return ['Treating one-per-square-foot tomato spacing as universal; growth habit and support change spacing needs.', 'Ignoring full-sun, watering, and soil-test context before choosing a planting plan.', 'Using eggshells or Epsom salts as default tomato fixes instead of checking soil and moisture.'];
  if (slug?.includes('carrot')) return ['Planting carrots without thinning; root crops need room to develop.', 'Using shallow, compacted, rocky, or heavy soil for long carrot varieties.', 'Starting carrots in pots instead of direct seeding where the roots will grow.'];
  if (slug?.includes('depth')) return ['Treating the depth result as local agronomic advice.', 'Ignoring whether the bed sits on native soil or a hard surface.', 'Forgetting that variety, irrigation, soil looseness, and drainage affect usable root depth.'];
  switch (initial) {
    case 'bags':
      return ['Using pounds or kilograms as if they were volume labels.', 'Forgetting that bag count rounds up.', 'Mixing dry quarts, gallons, liters, and cubic feet without conversion.'];
    case 'bulk':
      return ['Ignoring delivery minimums and overbuy volume.', 'Comparing bag price without adding delivery or pickup cost.', 'Ordering exactly the calculated volume with no settling allowance.'];
    case 'mix':
      return ['Treating a ratio calculator as a universal soil recipe.', 'Letting custom percentages total something other than 100%.', 'Using compost-heavy mixes without considering local soil test results.'];
    case 'containers':
      return ['Assuming the labeled gallon size equals the exact filled volume.', 'Packing media tightly and reducing useful root space.', 'Using dense garden soil in containers that need lighter potting mix.'];
    case 'spacing':
      return ['Treating square-foot counts as a yield guarantee.', 'Ignoring variety size, trellis plan, and harvest style.', 'Planting by grid count without checking seed packet spacing.'];
    case 'depth':
      return ['Treating depth status as local agronomic advice.', 'Ignoring crop variety, water access, and soil looseness.', 'Using shallow beds for long root crops without checking variety length.'];
    case 'topoff':
      return ['Adding top-off material without measuring the current soil drop.', 'Using compost-only top-off every season without soil testing.', 'Forgetting mulch and soil amendments are separate planning decisions.'];
    default:
      return ['Measuring outside bed dimensions when the inside fill dimensions are smaller.', 'Forgetting freeboard when soil should sit below the rim.', 'Buying bags without checking the package volume label.'];
  }
}

export function generateStaticParams() {
  return allPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = allPages.find((candidate) => candidate.slug === slug);
  if (!page) return {};
  return pageMetadata(page);
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = allPages.find((candidate) => candidate.slug === slug);
  if (!page) {
    notFound();
    throw new Error(`Unknown BedSoil page: ${slug}`);
  }
  const intro = presetIntro(page);
  const contentBrief = contentQualityForPage(page);
  const fourByEightOutputs = fourByEightDepthOutputsForSlug(page.slug);
  const comparisonPage = page.comparison ? comparisonPageForSlug(page.comparison) : undefined;

  if (comparisonPage) {
    return (
      <main id="main-content" className="page two-column">
        <div>
          <section className="hero">
            <p className="eyebrow">Fair calculator comparison</p>
            <h1>{comparisonPage.h1}</h1>
            <p>{comparisonPage.description}</p>
            <div className="button-row">
              <a className="pill primary" href={comparisonPage.primaryCtaHref}>{comparisonPage.primaryCta}</a>
              {comparisonPage.secondaryCta && comparisonPage.secondaryCtaHref ? <a className="pill" href={comparisonPage.secondaryCtaHref}>{comparisonPage.secondaryCta}</a> : null}
            </div>
          </section>
          <JsonLd data={pageStructuredData(page)} />
          <CompetitorComparisonPage page={comparisonPage} />
          <GeoCitationPanel page={page} title="AI citation guide for this comparison" />
          <ProgrammaticPlanningPanel page={page} />
          <FlowPathPanel page={page} title="Comparison-to-calculator flow" />
          <Disclaimer />
          <RelatedLinks slugs={page.related ?? ['raised-bed-soil-calculator', 'soil-bags-calculator']} />
        </div>
        <aside>
          <AdSlot placement="sidebar" />
        </aside>
      </main>
    );
  }

  if (page.legal) {
    return (
      <main id="main-content" className="page">
        <section className="hero">
          <p className="eyebrow">BedSoil</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </section>
        <JsonLd data={pageStructuredData(page)} />
        <section className="content-card">
          {page.legal.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
        <RelatedLinks slugs={['raised-bed-soil-calculator', 'soil-bags-calculator', 'raised-bed-soil-mix-calculator']} />
      </main>
    );
  }

  return (
    <main id="main-content" className="page two-column">
      <div>
        <section className="hero">
          <p className="eyebrow">Raised Bed Soil & Planting Calculator</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </section>
        <JsonLd data={pageStructuredData(page)} />

        <section className="content-card preset-summary">
          <h2>Preset loaded: {intro.modeLabel}</h2>
          <p>{intro.task}</p>
          <ul>
            <li><b>Formula:</b> {intro.formula}</li>
            <li><b>Example:</b> {intro.example}</li>
            <li><b>Next step:</b> copy the shopping list, print the result, or adjust the assumptions before buying materials.</li>
          </ul>
        </section>

        <VisualTaskPanel page={page} title="Above-the-fold task path for this calculator" />

        <Calculator initial={page.initial} presetSlug={page.slug} />

        <div className="below-fold-stack">
          <ContentQualityPanel brief={contentBrief} />
          <GeoCitationPanel page={page} title="AI citation guide for this calculator" />
          <SxoIntentPanel page={page} title="Search experience fit for this calculator" />
          <SoilPlanningDiagram title={page.title} />
          <ImageSeoPanel title={page.title} />
          <PageInsights page={page} />
          <ProgrammaticPlanningPanel page={page} />
          <TopicClusterPanel page={page} />
          <FlowPathPanel page={page} title="Search-to-result flow for this page" />

        {fourByEightOutputs.length > 0 ? (
          <section className="content-card depth-output-summary">
            <h2>{fourByEightOutputs.length === 1 ? `4×8 bed at ${fourByEightOutputs[0].depthInches} inches: specific output` : '4×8 depth output summary'}</h2>
            <p>These summaries use the current BedSoil default of one 4×8 bed, 0 in freeboard, 10% settling allowance, and 2 ft³ bags. Change the calculator inputs above for your exact bag size, price, number of beds, freeboard, or settling assumption.</p>
            <div className="data-table-wrap">
              <table className="data-table">
                <thead><tr><th>Depth</th><th>Before settling</th><th>With 10% settling</th><th>2 ft³ bags</th><th>Planning note</th></tr></thead>
                <tbody>
                  {fourByEightOutputs.map((row) => (
                    <tr key={row.depthInches}>
                      <td>{row.slug === page.slug ? `${row.depthInches} in` : <Link href={`/${row.slug}`}>{row.depthInches} in</Link>}</td>
                      <td>{row.baseFt3.toFixed(2)} ft³</td>
                      <td>{row.finalFt3.toFixed(2)} ft³ / {row.yd3.toFixed(2)} yd³</td>
                      <td>{row.twoFtBags}</td>
                      <td>{row.fitNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="muted-card">Quick copy: {fourByEightOutputs.map(fourByEightDepthCopy).join(' ')}</p>
          </section>
        ) : null}

        <section className="content-card">
          <h2>How to use</h2>
          <ol>
            <li>Confirm the preset values that loaded for this page.</li>
            <li>Change any bed, bag, bulk, mix, container, spacing, top-off, or depth input that differs from your project.</li>
            <li>Review soil volume, bags, cost, mix breakdown, warnings, and the shopping list.</li>
            <li>Copy the shopping list or print the result before buying materials.</li>
          </ol>
          <h2>Formula</h2>
          <p>{page.formula}</p>
          <h2>Example output</h2>
          <p>{page.example}</p>
          <h2>Common mistakes</h2>
          <ul>{mistakesFor(page.initial, page.slug).map((mistake) => <li key={mistake}>{mistake}</li>)}</ul>
          <h2>Common sizes and presets</h2>
          <p>Includes 4×8 presets at 6, 8, 10, 12, 18, and 24 inches, common soil bag sizes, grow bag groups, and 4×4 / 4×8 square-foot grids.</p>
          <h2>Practical notes</h2>
          <ul>{page.notes?.map((note) => <li key={note}>{note}</li>)}</ul>
        </section>

        <Methodology />
        <PlanningSources slug={page.slug} initial={page.initial} />
        <AffiliateSlot />
        {page.slug.includes('checklist') ? <section className="content-card"><h2>Seasonal checklist</h2><ul><li>Measure current soil surface below the bed rim.</li><li>Estimate 1, 2, or 3 inches of top-off material before buying bags.</li><li>Check whether crops need deeper soil before planting.</li><li>Use compost and mulch as planning estimates, not a region-specific calendar.</li><li>Print or copy the shopping list before visiting a garden center.</li></ul></section> : null}
        <FAQ />
        <Disclaimer />
          <RelatedLinks slugs={page.related ?? ['raised-bed-soil-calculator', 'soil-bags-calculator']} />
        </div>
      </div>
      <aside>
        <AdSlot placement="sidebar" />
      </aside>
    </main>
  );
}
