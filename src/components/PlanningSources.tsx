import { pageSourceSummary, sourceIdsForPage, sourcesByIds, SOURCE_LIBRARY } from '@/lib/data/sources';

export function PlanningSources({ slug = '', initial }: { slug?: string; initial?: string }) {
  const primarySources = sourcesByIds(sourceIdsForPage(slug, initial));
  const visibleSources = primarySources.slice(0, 9);
  const hiddenCount = Math.max(0, SOURCE_LIBRARY.length - visibleSources.length);

  return (
    <section className="content-card source-card">
      <h2>Planning assumptions and sources</h2>
      <p>{pageSourceSummary(slug, initial)}</p>
      <p>BedSoil keeps deterministic volume math separate from gardening assumptions. Cubic-foot, cubic-yard, liter, quart, gallon, and bag-count calculations come from your inputs; crop spacing, crop depth, mix ratio, and container advice are planning aids that need product labels, seed packets, local Extension guidance, and soil-test context.</p>
      <ul>
        {visibleSources.map((source) => (
          <li key={source.id}>
            <a href={source.href} rel="noopener noreferrer" target="_blank">{source.label}</a> <span className="source-tier">{source.tier}</span>: {source.note}
          </li>
        ))}
      </ul>
      <details className="source-library-detail">
        <summary>Source library coverage</summary>
        <p>The project source library now contains {SOURCE_LIBRARY.length} curated references. This page shows the sources most relevant to the active calculator mode; {hiddenCount} additional references cover SERP patterns, containers, compost, soil testing, amendments, and related crop assumptions.</p>
      </details>
      <p className="muted-card">Always check product labels, seed packets, local extension guidance, soil tests, delivery minimums, drainage, and site conditions before purchasing materials or planting.</p>
    </section>
  );
}
