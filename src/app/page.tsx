import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator } from '@/components/Calculator';
import { JsonLd } from '@/components/JsonLd';
import { Methodology } from '@/components/Methodology';
import { ContentQualityPanel } from '@/components/ContentQualityPanel';
import { SoilPlanningDiagram } from '@/components/SoilPlanningDiagram';
import { Disclaimer } from '@/components/Disclaimer';
import { FAQ } from '@/components/FAQ';
import { RelatedLinks } from '@/components/RelatedLinks';
import { AffiliateSlot } from '@/components/AffiliateSlot';
import { PlanningSources } from '@/components/PlanningSources';
import { ProgrammaticClusterMap } from '@/components/ProgrammaticClusterMap';
import { TopicClusterArchitecture } from '@/components/TopicClusterArchitecture';
import { FlowPathPanel } from '@/components/FlowPathPanel';
import { SxoIntentPanel } from '@/components/SxoIntentPanel';
import { ImageSeoPanel } from '@/components/ImageSeoPanel';
import { VisualTaskPanel } from '@/components/VisualTaskPanel';
import { GeoCitationPanel } from '@/components/GeoCitationPanel';
import { SITE_PUBLISHER, SITE_URL } from '@/lib/site';
import { homepageContentQuality } from '@/lib/data/contentQuality';
import { homeStructuredData } from '@/lib/seo/jsonLd';
import { PRIMARY_OG_IMAGE } from '@/lib/data/imageSeo';
import { HOME_PAGE_DESCRIPTION, HOME_PAGE_OG_DESCRIPTION, HOME_PAGE_TITLE } from '@/lib/seo/homeMeta';

export const metadata: Metadata = {
  title: HOME_PAGE_TITLE,
  description: HOME_PAGE_DESCRIPTION,
  authors: [{ name: SITE_PUBLISHER, url: SITE_URL }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_OG_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: '/og-bedsoil.png', width: PRIMARY_OG_IMAGE.width, height: PRIMARY_OG_IMAGE.height, alt: PRIMARY_OG_IMAGE.alt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_PAGE_TITLE,
    description: HOME_PAGE_OG_DESCRIPTION,
    images: [{ url: '/og-bedsoil.png', alt: PRIMARY_OG_IMAGE.alt }],
  },
};

const homeContentBrief = homepageContentQuality();

const related = [
  'raised-bed-soil-calculator',
  '4x8-raised-bed-soil-calculator',
  'soil-bags-calculator',
  'bulk-soil-vs-bags-calculator',
  'raised-bed-soil-mix-calculator',
  'container-soil-calculator',
  'grow-bag-soil-calculator',
  'square-foot-garden-spacing-calculator',
  '4x8-raised-bed-planting-layout',
  'annual-raised-bed-top-off-calculator',
  'raised-bed-depth-calculator',
  'raised-bed-cost-estimator',
  'multiple-raised-bed-soil-calculator',
  'round-raised-bed-soil-calculator',
  'spring-raised-bed-checklist',
  'best-raised-bed-soil-calculators',
];

export default function Home() {
  return (
    <main id="main-content" className="page">
      <JsonLd data={homeStructuredData()} />

      <section className="hero compact-hero">
        <p className="eyebrow">Raised Bed Soil & Planting Planner</p>
        <h1>Raised Bed Soil Calculator</h1>
        <p>Enter bed size and bag size to estimate soil volume, bags, bulk order size, cost, and a copyable shopping list before buying materials.</p>
        <div className="button-row">
          <a className="pill primary" href="#calculator">Use the calculator</a>
          <Link className="pill" href="/4x8-raised-bed-soil-calculator">Load 4×8 presets</Link>
          <Link className="pill" href="/soil-bags-calculator">Convert volume to bags</Link>
        </div>
      </section>

      <VisualTaskPanel title="Above-the-fold task path for soil calculator searches" />

      <Calculator />

      <div className="below-fold-stack">
        <ContentQualityPanel brief={homeContentBrief} title="Quick answer, scope, and review notes" />
        <GeoCitationPanel title="AI citation guide for BedSoil" />
        <SxoIntentPanel title="Search experience fit for soil calculator queries" />

        <SoilPlanningDiagram title="Raised Bed Soil Calculator" />
        <ImageSeoPanel title="Raised Bed Soil Calculator" />

        <section className="content-card">
        <h2>Formula</h2>
        <p>Raised bed volume = length × width × effective depth × number of beds × settling allowance. Soil bag count = ceil(required cubic feet ÷ bag cubic feet).</p>
        <h2>Example calculation</h2>
        <p>A 4 ft × 8 ft × 12 in raised bed equals 32 ft³, or 1.19 yd³. Two beds with 10% settling need 70.4 ft³, or 2.61 yd³.</p>
        <h2>Default example</h2>
        <p>The calculator opens with a 4×8×12 in single-bed example, 10% settling, and a 2 ft³ bag size so users can understand the result immediately.</p>
      </section>



      <section className="content-card">
        <h2>Common raised bed sizes</h2>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead><tr><th>Bed size</th><th>12 in deep soil</th><th>Planting squares</th><th>Use case</th></tr></thead>
            <tbody>
              <tr><td>4×4</td><td>16 ft³</td><td>16</td><td>Compact square-foot garden</td></tr>
              <tr><td>4×6</td><td>24 ft³</td><td>24</td><td>Medium backyard bed</td></tr>
              <tr><td>4×8</td><td>32 ft³</td><td>32</td><td>Highest-value standard layout</td></tr>
              <tr><td>2×8</td><td>16 ft³</td><td>16</td><td>Narrow side-yard bed</td></tr>
              <tr><td>3×6</td><td>18 ft³</td><td>18</td><td>Reachable narrow bed</td></tr>
            </tbody>
          </table>
        </div>
      </section>

        <ProgrammaticClusterMap />
        <TopicClusterArchitecture />
        <FlowPathPanel title="Search-to-calculator flow" />
        <Methodology variant="home" />
        <RelatedLinks slugs={related} />
        <PlanningSources />
        <AffiliateSlot />
        <FAQ />
        <Disclaimer />
      </div>
    </main>
  );
}
