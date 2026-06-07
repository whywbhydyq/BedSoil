import Link from 'next/link';
import type { PageDefinition } from '@/lib/data/pages';
import { programmaticProfileForPage } from '@/lib/data/programmatic';

export function ProgrammaticPlanningPanel({ page }: { page: PageDefinition }) {
  const profile = programmaticProfileForPage(page);

  return (
    <section className="content-card programmatic-card">
      <p className="eyebrow">Programmatic quality gate</p>
      <h2>Why this page is not just a swapped template</h2>
      <p>{profile.cluster.description}</p>
      <div className="programmatic-grid">
        <div>
          <h3>Page cluster</h3>
          <p><b>{profile.cluster.label}</b></p>
          <p className="muted-card">Route type: {profile.routeType}. Template family: {profile.templateFamily}.</p>
          <p className="muted-card">Data source: {profile.dataSource}</p>
        </div>
        <div>
          <h3>Indexing rule</h3>
          <p>{profile.indexPolicy}</p>
          <p className={profile.qualityGate.status === 'pass' ? 'status-note status-good' : 'status-note status-review'}>{profile.qualityGate.label}</p>
        </div>
      </div>
      <div className="quality-meter">
        <span>Estimated unique content coverage</span>
        <b>{profile.uniquenessEstimate}%</b>
        <small>{profile.qualityGate.details}</small>
      </div>
      <h3>Unique inputs on this page</h3>
      <ul className="compact-list">
        {profile.uniqueAttributes.map((attribute) => <li key={attribute}>{attribute}</li>)}
      </ul>
      <h3>Rollout guardrail</h3>
      <p className="muted-card">{profile.rolloutPolicy}</p>
      <h3>Automated next-step links</h3>
      <div className="programmatic-link-list">
        {profile.related.map((link) => (
          <Link key={link.slug} href={`/${link.slug}`}>
            <span>{link.anchor}</span>
            <small>{link.reason}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}
