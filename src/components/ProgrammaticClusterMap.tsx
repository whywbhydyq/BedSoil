import Link from 'next/link';
import { homepageProgrammaticClusters, programmaticAnchorLabel, programmaticPublishedPages } from '@/lib/data/programmatic';

export function ProgrammaticClusterMap() {
  const clusters = homepageProgrammaticClusters();
  const pageCount = programmaticPublishedPages().length;

  return (
    <section className="content-card programmatic-card">
      <p className="eyebrow">Programmatic page map</p>
      <h2>Choose the right soil-planning path</h2>
      <p>BedSoil keeps the generated page set small and structured: each indexable calculator or comparison URL belongs to a visible cluster, has a self-canonical page, and links to related pages by planning task rather than by faceted parameters.</p>
      <div className="programmatic-summary-row">
        <span><b>{pageCount}</b> indexable generated pages</span>
        <span><b>{clusters.length}</b> visible clusters</span>
        <span><b>&lt;100</b> pages before review warning</span>
      </div>
      <div className="cluster-grid">
        {clusters.map((cluster) => (
          <article className="cluster-card" key={cluster.id}>
            <h3><Link href={`/${cluster.hubSlug}`}>{cluster.label}</Link></h3>
            <p>{cluster.description}</p>
            <p className="muted-card">{cluster.pages.length} related pages in this controlled set.</p>
            <div className="mini-link-row">
              {cluster.pages.slice(0, 4).map((slug) => <Link key={slug} href={`/${slug}`}>{programmaticAnchorLabel(slug)}</Link>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
