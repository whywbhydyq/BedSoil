import Link from 'next/link';
import { slugToTitle } from '@/lib/utils/format';

export function RelatedLinks({ slugs }: { slugs: string[] }) {
  return (
    <section className="content-card">
      <h2>Related calculators</h2>
      <div className="link-grid">
        {slugs.map((slug) => <Link className="pill" key={slug} href={`/${slug}`}>{slugToTitle(slug)}</Link>)}
      </div>
    </section>
  );
}
