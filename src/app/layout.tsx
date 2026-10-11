import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, IBM_Plex_Mono } from "next/font/google";
import { ScrollOnNavigate } from "@/components/scroll-on-navigate";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/content/site";
import { HOME_TITLE } from "@/lib/metadata";
import "./globals.css";

// Self-hosted at build time. globals.css references the families by name rather
// than through these variables: the variables append next/font's Arial-based
// fallback face, which would draw glyphs the fonts lack (→ ↗ ★) differently
// from the design's plain system fallbacks.
const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-be-vietnam-pro",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

// Pages override description, canonical URL and share cards via pageMetadata().
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: HOME_TITLE, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
};

export const viewport: Viewport = {
  themeColor: "#16161A",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${beVietnamPro.variable} ${ibmPlexMono.variable}`}>
      <head>
        {/* Icon subset declared in globals.css; icons appear above the fold. */}
        <link rel="preload" href="/fonts/material-symbols-outlined.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <ScrollOnNavigate />
      </body>
    </html>
  );
}
