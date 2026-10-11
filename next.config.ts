import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS/JS to `out/`.
  output: "export",
  // Emit `about/index.html` rather than `about.html` next to an `about/` payload
  // folder, so every static host (GitHub Pages, S3, Apache) resolves the URL.
  trailingSlash: true,
};

export default nextConfig;
