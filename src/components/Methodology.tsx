import { DEFAULT_LAST_MODIFIED } from '@/lib/seo/pageDates';

const methodRows = [
  ['Volume math', 'Raised bed and container volume uses geometric formulas, then converts cubic feet into cubic yards, liters, dry quarts, gallons, and bag counts.'],
  ['Bag estimates', 'Bag counts round up because partial bags cannot usually be purchased. Weight-only bag labels are not converted without a product density.'],
  ['Planning assumptions', 'Settling, freeboard, mix ratios, crop spacing, crop depth, and container fill lines are user-editable planning assumptions, not local agronomic advice.'],
  ['Source boundary', 'Gardening notes are cross-checked against Extension-style references, product labels, seed packets, and soil-test context where available.'],
] as const;

export function Methodology({ variant = 'calculator' }: { variant?: 'home' | 'calculator' }) {
  return (
    <section className="content-card methodology-card">
      <h2>{variant === 'home' ? 'How BedSoil calculates soil estimates' : 'Method, review, and limits'}</h2>
      <p>BedSoil separates deterministic volume math from gardening assumptions so the calculator can stay editable, auditable, and conservative before purchase decisions.</p>
      <div className="method-grid">
        {methodRows.map(([label, copy]) => (
          <div key={label} className="method-item">
            <strong>{label}</strong>
            <p>{copy}</p>
          </div>
        ))}
      </div>
      <p className="muted-card">Last reviewed: {DEFAULT_LAST_MODIFIED}. Formula and source updates are applied manually by YmirTool. Always verify local prices, supplier minimums, product labels, drainage, and site conditions before buying soil or planting.</p>
    </section>
  );
}
