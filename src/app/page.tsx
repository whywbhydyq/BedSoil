import type { Metadata } from 'next';
import Link from 'next/link';
import { Calculator } from '@/components/Calculator';
import { Disclaimer } from '@/components/Disclaimer';
import { FAQ } from '@/components/FAQ';
import { RelatedLinks } from '@/components/RelatedLinks';
import { PlanningSources } from '@/components/PlanningSources';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Raised Bed Soil Calculator - Soil Volume, Bags & Shopping List',
  description: 'Enter raised bed length, width, depth, and bag size to estimate cubic feet, cubic yards, liters, bags, bulk cost, and a copyable shopping list.',
  alternates: {
    canonical: '/',
  },
};

const homeStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BedSoil - Raised Bed Soil Calculator',
  description: 'Free raised bed soil, bag, bulk, mix, container, top-off, depth, and square-foot planting calculators.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  url: SITE_URL,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  potentialAction: {
    '@type': 'UseAction',
    target: `${SITE_URL}/#calculator`,
  },
};

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
];

export default function Home() {
  return (
    <main className="page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }} />

      <Calculator />

      <section className="hero compact-hero tool-page-intro">
        <p className="eyebrow">Raised Bed Soil & Planting Planner</p>
        <h1>Raised Bed Soil Calculator</h1>
        <p>Enter bed size and bag size to estimate soil volume, bags, bulk order size, cost, and a copyable shopping list before buying materials.</p>
        <div className="button-row">
          <a className="pill primary" href="#calculator">Use the calculator</a>
          <Link className="pill" href="/4x8-raised-bed-soil-calculator">Load 4×8 presets</Link>
          <Link className="pill" href="/soil-bags-calculator">Convert volume to bags</Link>
        </div>
      </section>

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
      </section>

      <RelatedLinks slugs={related} />
      <PlanningSources />
      <FAQ />
      <Disclaimer />
    </main>
  );
}
