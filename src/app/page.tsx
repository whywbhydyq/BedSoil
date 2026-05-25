import Link from 'next/link';
import { Calculator } from '@/components/Calculator';
import { Disclaimer } from '@/components/Disclaimer';
import { FAQ } from '@/components/FAQ';
import { RelatedLinks } from '@/components/RelatedLinks';
import { AffiliateSlot } from '@/components/AffiliateSlot';

const homeStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BedSoil - Raised Bed Soil Calculator',
  description: 'Free raised bed soil, bag, bulk, mix, container, top-off, depth, and square-foot planting calculators.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
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

      <section className="hero">
        <p className="eyebrow">Raised Bed Soil & Planting Planner</p>
        <h1>Raised Bed Soil Calculator</h1>
        <p>Calculate soil volume, bags, bulk cost, compost mix, annual top-off, container volume, depth fit, and square foot planting space before buying materials.</p>
        <div className="button-row">
          <a className="pill primary" href="#calculator">Start calculating</a>
          <Link className="pill" href="/4x8-raised-bed-soil-calculator">4×8 calculator</Link>
        </div>
      </section>

      <Calculator />

      <section className="content-card">
        <h2>Formula</h2>
        <p>Raised bed volume = length × width × effective depth × number of beds × settling allowance. Soil bag count = ceil(required cubic feet ÷ bag cubic feet).</p>
        <h2>Example calculation</h2>
        <p>A 4 ft × 8 ft × 12 in raised bed equals 32 ft³, or 1.19 yd³. Two beds with 10% settling need 70.4 ft³, or 2.61 yd³.</p>
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
      <AffiliateSlot />
      <FAQ />
      <Disclaimer />
    </main>
  );
}
