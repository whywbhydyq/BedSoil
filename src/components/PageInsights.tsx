import type { PageDefinition } from '@/lib/data/pages';
import { insightsForPage } from '@/lib/data/pageInsights';

export function PageInsights({ page }: { page: PageDefinition }) {
  const insights = insightsForPage(page);
  return (
    <section className="content-card page-insights">
      <h2>Planning notes for this calculator</h2>
      <div className="insight-grid">
        {insights.map((insight) => (
          <article key={insight.heading} className="insight-card">
            <h3>{insight.heading}</h3>
            <p>{insight.body}</p>
            <ul>
              {insight.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
