import Link from 'next/link';
import { CLUSTER_SEED_KEYWORDS, SERP_CLUSTER_EVIDENCE, TOPIC_CLUSTERS, clusterDisplayPage, topicClusterCoverage } from '@/lib/data/topicClusters';

export function TopicClusterArchitecture() {
  const coverage = topicClusterCoverage();

  return (
    <section className="content-card topic-cluster-card">
      <p className="eyebrow">Semantic topic clusters</p>
      <h2>Hub-and-spoke calculator architecture</h2>
      <p>BedSoil groups calculator pages by search intent: volume first, then bag buying, bulk cost, mix ratios, planting fit, containers, and seasonal maintenance. Each hub links to its spokes, and every spoke routes back to a hub plus adjacent next-step clusters.</p>
      <div className="cluster-stats-grid">
        <div><b>{coverage.totalClusters}</b><span>topic clusters</span></div>
        <div><b>{coverage.totalClusteredPages}/{coverage.totalCalculatorPages}</b><span>calculator pages clustered</span></div>
        <div><b>{coverage.totalMatrixLinks}</b><span>planned matrix links</span></div>
        <div><b>{coverage.seedKeywordCount}</b><span>seed variants reviewed</span></div>
      </div>
      <div className="cluster-evidence-grid">
        <div className="topic-cluster-note">
          <h3>SERP-overlap assumptions</h3>
          <ul>{SERP_CLUSTER_EVIDENCE.slice(0, 3).map((evidence) => <li key={evidence}>{evidence}</li>)}</ul>
        </div>
        <div className="topic-cluster-note">
          <h3>Quality gate</h3>
          <ul>
            <li>{coverage.orphanCalculatorSlugs.length === 0 ? 'No calculator pages are outside the topic cluster map.' : `${coverage.orphanCalculatorSlugs.length} calculator pages need cluster assignment.`}</li>
            <li>{coverage.minimumIncomingLinksMet ? 'Every calculator page has at least one planned hub or spoke path.' : 'Some pages still need incoming hub links.'}</li>
            <li>{coverage.duplicateMembershipSlugs.length} bridge pages intentionally appear in more than one cluster.</li>
          </ul>
        </div>
      </div>
      <details className="cluster-keyword-details">
        <summary>Seed keyword set used for clustering</summary>
        <div className="mini-link-row keyword-chip-row">
          {CLUSTER_SEED_KEYWORDS.map((keyword) => <span key={keyword}>{keyword}</span>)}
        </div>
      </details>
      <div className="topic-cluster-grid">
        {TOPIC_CLUSTERS.map((cluster) => {
          const pillar = clusterDisplayPage(cluster.pillarSlug);
          return (
            <article key={cluster.id} className="topic-cluster-item">
              <h3><Link href={pillar.url}>{cluster.name}</Link></h3>
              <p>{cluster.summary}</p>
              <p className="muted-card"><b>Pillar:</b> {cluster.pillarKeyword}. <b>Intent:</b> {cluster.intent}.</p>
              <div className="mini-link-row">
                {cluster.spokes.slice(0, 4).map((spoke) => <Link key={spoke.slug} href={`/${spoke.slug}`}>{spoke.linkAnchor}</Link>)}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
