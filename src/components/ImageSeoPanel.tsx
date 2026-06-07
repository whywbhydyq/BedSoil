import { IMAGE_SEO_CHECKLIST, PREVIEW_FALLBACK_SRCSET, PRIMARY_OG_IMAGE, RESPONSIVE_PREVIEW_SOURCES, previewAltForTitle } from '@/lib/data/imageSeo';

export function ImageSeoPanel({ title = 'Raised Bed Soil Calculator' }: { title?: string }) {
  const alt = previewAltForTitle(title);

  return (
    <section className="content-card image-seo-panel" aria-labelledby="image-seo-heading">
      <div>
        <p className="eyebrow">Image SEO</p>
        <h2 id="image-seo-heading">Visual preview and crawlable image signals</h2>
        <p>
          BedSoil exposes a crawlable planning diagram, a social preview image, responsive WebP/AVIF variants, and image metadata signals that match the visible calculator task.
        </p>
      </div>
      <picture>
        {RESPONSIVE_PREVIEW_SOURCES.map((source) => (
          <source key={source.type} srcSet={source.srcSet} type={source.type} />
        ))}
        <img
          src="/og-bedsoil.png"
          srcSet={PREVIEW_FALLBACK_SRCSET}
          sizes="(max-width: 760px) 100vw, 520px"
          width={PRIMARY_OG_IMAGE.width}
          height={PRIMARY_OG_IMAGE.height}
          loading="lazy"
          decoding="async"
          alt={alt}
        />
      </picture>
      <ul className="compact-list">
        {IMAGE_SEO_CHECKLIST.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}
