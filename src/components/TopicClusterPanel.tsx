import Link from 'next/link';
import type { PageDefinition } from '@/lib/data/pages';
import { clusterDisplayPage, topicClusterForPage, topicClusterLinksForPage } from '@/lib/data/topicClusters';

export function TopicClusterPanel({ page }: { page: PageDefinition }) {
  const cluster = topicClusterForPage(page);
  if (!cluster) return null;
  const pillar = clusterDisplayPage(cluster.pillarSlug);
  const links = topicClusterLinksForPage(page);
  const isPillar = page.slug === cluster.pillarSlug;

  return (
    <section className="content-card topic-cluster-card">
      <p className="eyebrow">Topic cluster path</p>
      <h2>{isPillar ? 'Pillar page for this calculator cluster' : 'Where this page fits in the cluster'}</h2>
      <div className="topic-cluster-layout">
        <div>
          <h3>{cluster.name}</h3>
          <p>{cluster.summary}</p>
          <p className="muted-card"><b>Pillar keyword:</b> {cluster.pillarKeyword}</p>
          <p className="muted-card"><b>Differentiator:</b> {cluster.differentiator}</p>
        </div>
        <div className="topic-cluster-note">
          <h3>Hub guidance</h3>
          <p>{cluster.recommendedHubCopy}</p>
          {!isPillar ? <p><Link href={pillar.url}>Return to the {pillar.title} hub</Link></p> : null}
        </div>
      </div>
      <h3>Internal link matrix for this page</h3>
      <div className="topic-link-list">
        {links.map((link) => {
          const target = clusterDisplayPage(link.to);
          return (
            <Link key={`${link.type}-${link.to}`} href={target.url}>
              <span>{link.anchor}</span>
              <small>{link.type.replaceAll('-', ' ')} · {link.placement}</small>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
