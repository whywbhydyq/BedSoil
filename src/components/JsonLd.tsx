import { serializeJsonLd, type JsonLdValue } from '@/lib/seo/jsonLd';

export function JsonLd({ data }: { data: JsonLdValue }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
