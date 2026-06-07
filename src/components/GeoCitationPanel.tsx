import type { PageDefinition } from '@/lib/data/pages';
import { geoPlatformScores, geoProfileForPage } from '@/lib/data/geo';

export function GeoCitationPanel({ page, title = 'AI search citation guide' }: { page?: PageDefinition; title?: string }) {
  const profile = geoProfileForPage(page);
  return (
    <section className="content-card geo-panel" aria-labelledby="geo-citation-heading">
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">GEO / AI citation readiness</p>
          <h2 id="geo-citation-heading">{title}</h2>
        </div>
        <span className="score-badge">{profile.score}/100</span>
      </div>

      <div className="geo-answer-block">
        <h3>Self-contained answer block</h3>
        <p>{profile.answerBlock}</p>
      </div>

      <div className="geo-grid">
        <div>
          <h3>Key facts to cite</h3>
          <ul>{profile.keyFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
        </div>
        <div>
          <h3>Source boundaries</h3>
          <ul>{profile.sourceBoundaries.map((boundary) => <li key={boundary}>{boundary}</li>)}</ul>
        </div>
      </div>

      <details className="geo-details">
        <summary>AI crawler, platform, and citation details</summary>
        <div className="geo-grid geo-grid-three">
          <div>
            <h3>Citation instructions</h3>
            <ul>{profile.citationInstructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ul>
          </div>
          <div>
            <h3>Crawler access status</h3>
            <ul>{profile.aiCrawlerStatus.map((status) => <li key={status}>{status}</li>)}</ul>
          </div>
          <div>
            <h3>Brand mention targets</h3>
            <ul>{profile.externalMentionTargets.map((target) => <li key={target}>{target}</li>)}</ul>
          </div>
        </div>
        <div className="data-table-wrap geo-platform-table">
          <table className="data-table">
            <thead><tr><th>AI search surface</th><th>Readiness</th><th>Why it matters</th></tr></thead>
            <tbody>
              {geoPlatformScores.map((row) => (
                <tr key={row.platform}>
                  <td>{row.platform}</td>
                  <td>{row.score}/100</td>
                  <td>{row.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
