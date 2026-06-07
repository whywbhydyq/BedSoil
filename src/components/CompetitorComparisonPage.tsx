import Link from 'next/link';
import type { CompetitorComparisonPage as CompetitorComparisonPageData, CompetitorProfile } from '@/lib/data/competitorPages';
import { COMPETITOR_REVIEW_DATE, competitorProfilesForPage } from '@/lib/data/competitorPages';

function valueFor(profile: CompetitorProfile, page: CompetitorComparisonPageData, row: CompetitorComparisonPageData['matrix'][number]) {
  const value = row[profile.id];
  if (value) return value;
  return page.pageType === 'roundup' ? 'Not part of this comparison row.' : 'Not publicly verified from the source snapshot used for this comparison.';
}

export function CompetitorComparisonPage({ page }: { page: CompetitorComparisonPageData }) {
  const profiles = competitorProfilesForPage(page);

  return (
    <>
      <section className="content-card comparison-disclosure">
        <h2>Comparison scope and disclosure</h2>
        <p>{page.sourceDisclosure}</p>
        <p>This is a fair-use comparison page. BedSoil does not claim partnership, endorsement, pricing control, or feature access for any competitor listed here.</p>
        <p><b>Review date:</b> {COMPETITOR_REVIEW_DATE}. Public competitor pages can change; verify live pages before making purchase or migration decisions.</p>
      </section>

      <section className="content-card comparison-summary-card">
        <h2>Quick verdict</h2>
        <p>{page.summary}</p>
        <p className="callout"><b>Recommendation:</b> {page.verdict}</p>
        <div className="button-row">
          <Link className="pill primary" href={page.primaryCtaHref}>{page.primaryCta}</Link>
          {page.secondaryCta && page.secondaryCtaHref ? <Link className="pill" href={page.secondaryCtaHref}>{page.secondaryCta}</Link> : null}
        </div>
      </section>

      <section className="content-card">
        <h2>Feature matrix</h2>
        <p className="muted-card">Cells only include claims that are visible in BedSoil or supported by public competitor page evidence. Unknown items are marked as not verified instead of guessed.</p>
        <div className="data-table-wrap">
          <table className="data-table comparison-table">
            <thead>
              <tr>
                <th>Criterion</th>
                <th>BedSoil</th>
                {profiles.map((profile) => <th key={profile.id}>{profile.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {page.matrix.map((row) => (
                <tr key={row.criterion}>
                  <th scope="row">{row.criterion}</th>
                  <td>{row.bedsoil}</td>
                  {profiles.map((profile) => <td key={`${row.criterion}-${profile.id}`}>{valueFor(profile, page, row)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="content-card">
        <h2>Best-fit use cases</h2>
        <div className="comparison-card-grid">
          {page.bestFor.map((item) => (
            <article className="comparison-mini-card" key={item.label}>
              <h3>{item.label}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-card">
        <h2>Competitor source notes</h2>
        <div className="comparison-source-grid">
          {profiles.map((profile) => (
            <article className="comparison-source-card" key={profile.id}>
              <h3>{profile.name}</h3>
              <p>{profile.publicPositioning}</p>
              <h4>Publicly visible strengths</h4>
              <ul>{profile.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
              <h4>Limits not guessed</h4>
              <ul>{profile.verifiedLimits.map((item) => <li key={item}>{item}</li>)}</ul>
              <h4>Source basis</h4>
              <ul>{profile.sourceNotes.map((item) => <li key={item}>{item}</li>)}</ul>
              <p><a href={profile.url} rel="nofollow noopener noreferrer" target="_blank">Review public source page</a></p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-card">
        <h2>Internal next steps</h2>
        <p>Use these BedSoil calculators when the comparison shows that your decision is about inputs, package labels, supplier minimums, or next-step planning.</p>
        <div className="link-grid">
          {page.relatedCalculators.map((slug) => <Link className="pill" href={`/${slug}`} key={slug}>{slug.replace(/-/g, ' ')}</Link>)}
        </div>
      </section>
    </>
  );
}
