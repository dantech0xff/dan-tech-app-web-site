import type { Metadata } from "next";
import { site } from "@/content/site";
import type { SitePath } from "./routes";

export const HOME_TITLE = "Dan Tech Indiv. — Apps make life more convenient";

const SHARE_IMAGE = { url: "/assets/dantech-mark.png", width: 512, height: 512, alt: "Dan Tech" };

type PageMetadataInput = {
  /** Omit for the home page, which uses the full default title. */
  title?: string;
  description: string;
  path: SitePath;
};

/**
 * Title, description, canonical URL and share cards for one page. A page's
 * `openGraph`/`twitter` objects replace the root layout's wholesale, so the
 * shared fields are set here every time.
 */
export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const shareTitle = title ? `${title} · ${site.name}` : HOME_TITLE;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      url: path,
      title: shareTitle,
      description,
      images: [SHARE_IMAGE],
    },
    twitter: { card: "summary", creator: "@dan_0xff", title: shareTitle, description },
  };
}
