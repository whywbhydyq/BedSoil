import { notFound } from 'next/navigation';
import { AdSlot } from '@/components/AdSlot';
import { Calculator } from '@/components/Calculator';
import { Disclaimer } from '@/components/Disclaimer';
import { FAQ } from '@/components/FAQ';
import { RelatedLinks } from '@/components/RelatedLinks';
import { AffiliateSlot } from '@/components/AffiliateSlot';
import { allPages, pageMetadata } from '@/lib/data/pages';

function calculatorStructuredData(page: { title: string; description: string; slug: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: page.title,
    description: page.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    url: `/${page.slug}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
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
  if (!page) notFound();

  if (page.legal) {
    return (
      <main className="page">
        <section className="hero">
          <p className="eyebrow">BedSoil</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </section>
        <section className="content-card">
          {page.legal.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
        <RelatedLinks slugs={['raised-bed-soil-calculator', 'soil-bags-calculator', 'raised-bed-soil-mix-calculator']} />
      </main>
    );
  }

  return (
    <main className="page two-column">
      <div>
        <section className="hero">
          <p className="eyebrow">Raised Bed Soil & Planting Calculator</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorStructuredData(page)) }} />

        <Calculator initial={page.initial} presetSlug={page.slug} />

        <section className="content-card">
          <h2>How to use</h2>
          <ol>
            <li>Enter the relevant bed, bag, bulk, mix, container, spacing, top-off, or depth inputs.</li>
            <li>Review soil volume, bags, cost, mix breakdown, warnings, and the shopping list.</li>
            <li>Copy the shopping list or print the result before buying materials.</li>
          </ol>
          <h2>Formula</h2>
          <p>{page.formula}</p>
          <h2>Example calculation</h2>
          <p>{page.example}</p>
          <h2>Common sizes and presets</h2>
          <p>Includes 4×8 presets at 6, 8, 10, 12, 18, and 24 inches, common soil bag sizes, grow bag groups, and 4×4 / 4×8 square-foot grids.</p>
          <h2>Practical notes</h2>
          <ul>{page.notes?.map((note) => <li key={note}>{note}</li>)}</ul>
        </section>

        <AffiliateSlot />
        {page.slug.includes('checklist') ? <section className="content-card"><h2>Seasonal checklist</h2><ul><li>Measure current soil surface below the bed rim.</li><li>Estimate 1, 2, or 3 inches of top-off material before buying bags.</li><li>Check whether crops need deeper soil before planting.</li><li>Use compost and mulch as planning estimates, not a region-specific calendar.</li><li>Print or copy the shopping list before visiting a garden center.</li></ul></section> : null}
        <FAQ />
        <Disclaimer />
        <RelatedLinks slugs={page.related ?? ['raised-bed-soil-calculator', 'soil-bags-calculator']} />
      </div>
      <aside>
        <AdSlot placement="sidebar" />
      </aside>
    </main>
  );
}
