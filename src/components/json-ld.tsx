import { toJsonLd } from "@/lib/structured-data";

/** Structured data for search engines, written into the static HTML when the page is built. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(data) }} />;
}
