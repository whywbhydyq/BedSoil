import type { PageDefinition } from '@/lib/data/pages';
import { sxoProfileForPage, sitewideSxoSummary } from '@/lib/data/sxo';

export function SxoIntentPanel({ page, title = 'Search experience fit' }: { page?: PageDefinition; title?: string }) {
  const profile = sxoProfileForPage(page);
  const summary = sitewideSxoSummary();
  const totalGapScore = profile.gapDimensions.reduce((sum, item) => sum + item.score, 0);
  const totalGapMax = profile.gapDimensions.reduce((sum, item) => sum + item.max, 0);

  return (
    <section className="content-card sxo-card">
      <p className="eyebrow">SXO alignment</p>
      <div className="sxo-header-row">
        <div>
          <h2>{title}</h2>
          <p>{profile.aboveFoldAnswer}</p>
        </div>
        <div className="sxo-score" aria-label={`SXO alignment score ${profile.score} out of 100`}>
          <b>{profile.score}</b>
          <span>/100 SXO</span>
        </div>
      </div>

      <div className="sxo-fit-grid">
        <div>
          <h3>Target keyword</h3>
          <p>{profile.keyword}</p>
        </div>
        <div>
          <h3>Page-type fit</h3>
          <p><b>{profile.verdict}</b>: {profile.targetPageType}</p>
        </div>
        <div>
          <h3>SERP expectation</h3>
          <p>{profile.serpExpectedPageType}</p>
        </div>
        <div>
          <h3>Dominant intent</h3>
          <p>{profile.dominantIntent}</p>
        </div>
      </div>

      <div className="sxo-serp-grid">
        {profile.serpEvidence.map((evidence) => (
          <article key={`${evidence.sourceType}-${evidence.observedPattern}`}>
            <h3>{evidence.sourceType}</h3>
            <p>{evidence.observedPattern}</p>
            <small>{evidence.implication}</small>
          </article>
        ))}
      </div>

      <div className="sxo-asset-grid">
        <div>
          <h3>Expected assets on this page</h3>
          <ul>{profile.expectedAssets.map((asset) => <li key={asset}>{asset}</li>)}</ul>
        </div>
        <div>
          <h3>Completion path</h3>
          <ol className="sxo-completion-list">
            {profile.completionPath.map((step) => (
              <li key={step.label}>
                <b>{step.label}</b>
                <span>{step.action}</span>
                <small>{step.successSignal}</small>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="sxo-check-grid">
        {profile.contentChecks.map((check) => (
          <div key={check.label}>
            <span className={`sxo-check-status status-${check.status.toLowerCase()}`}>{check.status}</span>
            <h3>{check.label}</h3>
            <p>{check.detail}</p>
          </div>
        ))}
      </div>

      <details className="sxo-detail-block">
        <summary>User stories, persona scores, and gap score</summary>
        <div className="sxo-story-grid">
          {profile.userStories.map((story) => (
            <article key={story.persona}>
              <h3>{story.persona}</h3>
              <p>{story.story}</p>
              <small>{story.sourceSignal}</small>
            </article>
          ))}
        </div>
        <div className="sxo-persona-grid">
          {profile.personas.map((persona) => (
            <article key={persona.id}>
              <h3>{persona.label}</h3>
              <p>{persona.need}</p>
              <ul>
                <li><b>10-second check:</b> {persona.tenSecondCheck}</li>
                <li><b>Trust need:</b> {persona.trustNeed}</li>
                <li><b>Next action:</b> {persona.nextAction}</li>
              </ul>
              <div className="sxo-persona-score" aria-label={`${persona.label} score ${persona.score} out of 100`}>
                <span>Relevance {persona.relevance}</span>
                <span>Clarity {persona.clarity}</span>
                <span>Trust {persona.trust}</span>
                <span>Action {persona.action}</span>
              </div>
              <p className="muted-card">Recommendation: {persona.recommendation}</p>
            </article>
          ))}
        </div>
        <div className="sxo-gap-grid" aria-label={`SXO gap score ${totalGapScore} out of ${totalGapMax}`}>
          {profile.gapDimensions.map((dimension) => (
            <div key={dimension.label}>
              <span>{dimension.label}</span>
              <strong>{dimension.score}/{dimension.max}</strong>
              <small>{dimension.rationale}</small>
            </div>
          ))}
        </div>
      </details>

      {!page ? <p className="muted-card">Sitewide SXO snapshot: {summary.calculatorPages} calculator pages, {summary.modeCount} calculator modes, average SXO alignment {summary.averageScore}/100, dominant page type {summary.dominantPageType}.</p> : null}
    </section>
  );
}
