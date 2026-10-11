import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { routes } from "@/lib/routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(routes).map((path) => ({
    url: new URL(path, site.url).toString(),
    changeFrequency: "monthly",
    priority: path === routes.home ? 1 : 0.7,
  }));
}
