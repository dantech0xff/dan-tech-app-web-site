import type { Metadata } from "next";
import { site } from "@/content/site";
import type { SitePath } from "./routes";

export const HOME_TITLE = "Dan Tech Indiv. — Apps make life more convenient";

/** Lets search results use large image previews and full snippets. Only pages built with `pageMetadata` get it, so the 404 page keeps its noindex. */
const ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
};

type ShareImage = { url: string; width: number; height: number; alt: string };

const SHARE_IMAGE: ShareImage = { url: "/assets/dantech-mark.png", width: 512, height: 512, alt: "Dan Tech" };

type PageMetadataInput = {
  /** Omit for the home page, which uses the full default title. */
  title?: string;
  description: string;
  path: SitePath;
  /** Share-card picture of a page about one product; the studio mark when omitted. */
  image?: ShareImage;
};

/**
 * Title, description, canonical URL and share cards for one page. A page's
 * `openGraph`/`twitter` objects replace the root layout's wholesale, so the
 * shared fields are set here every time.
 */
export function pageMetadata({ title, description, path, image = SHARE_IMAGE }: PageMetadataInput): Metadata {
  const shareTitle = title ? `${title} · ${site.name}` : HOME_TITLE;
  return {
    ...(title ? { title } : {}),
    description,
    robots: ROBOTS,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      url: path,
      title: shareTitle,
      description,
      images: [image],
    },
    twitter: { card: "summary", creator: "@dan_0xff", title: shareTitle, description },
  };
}
