import type { PageDefinition } from '@/lib/data/pages';
import { visualProfileForPage } from '@/lib/data/visual';

export function VisualTaskPanel({ page, title = 'Above-the-fold task path' }: { page?: PageDefinition; title?: string }) {
  const profile = visualProfileForPage(page);

  return (
    <section className="content-card visual-task-card" aria-label="Visual task path and mobile readiness">
      <div className="visual-task-header">
        <div>
          <p className="eyebrow">Visual UX check</p>
          <h2>{title}</h2>
          <p>{profile.foldPromise}</p>
        </div>
        <div className="visual-score" aria-label={`Visual readiness score ${profile.score} out of 100`}>
          <b>{profile.score}</b>
          <span>/100 visual</span>
        </div>
      </div>

      <div className="visual-fold-grid visual-fold-grid-compact">
        <div>
          <h3>Primary action</h3>
          <p>{profile.primaryAction}</p>
          <a className="pill primary visual-anchor-cta" href="#calculator">Open calculator inputs</a>
        </div>
        <div>
          <h3>Result cue</h3>
          <p>{profile.resultCue}</p>
        </div>
      </div>

      <details className="visual-check-details">
        <summary>Show visual task path, trust cue, and viewport checks</summary>
        <div className="visual-path-strip" aria-label="Visual task sequence">
          {profile.priorities.map((item, index) => (
            <div key={item.label}>
              <span>{index + 1}</span>
              <strong>{item.label}</strong>
              <small>{item.detail}</small>
            </div>
          ))}
        </div>
        <div className="visual-trust-cue">
          <h3>Trust cue</h3>
          <p>{profile.trustCue}</p>
        </div>
        <ul className="visual-check-list">
          {profile.viewportChecks.map((check) => (
            <li key={check.label}>
              <b>{check.label}</b>
              <span className={`status-note ${check.status === 'pass' ? 'status-good' : 'status-review'}`}>{check.status}</span>
              <p>{check.detail}</p>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
