import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { DuolySection } from "@/components/products/duoly-section";
import { EarlierWorkSection } from "@/components/products/earlier-work-section";
import { KimTaiSection } from "@/components/products/kim-tai-section";
import styles from "@/components/products/products.module.css";
import { SiteLink } from "@/components/site-link";
import { pageDescriptions } from "@/content/pages";
import { pageMetadata } from "@/lib/metadata";
import { productAnchors, routes } from "@/lib/routes";
import { breadcrumbs, productsGraph } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "Products",
  description: pageDescriptions[routes.products],
  path: routes.products,
});

const CHIPS = [
  { label: "Duoly in Love", anchor: productAnchors.duoly, icon: "/assets/duoly-icon.png", cover: false },
  { label: "Kim Tài", anchor: productAnchors.kimTai, icon: "/assets/kimtai-icon.png", cover: false },
];

export default function ProductsPage() {
  return (
    <main>
      <JsonLd data={breadcrumbs(routes.products)} />
      <JsonLd data={productsGraph()} />
      <PageHero
        compact
        narrowTitle
        title="Every app, built end-to-end by one person."
        lead="Consumer apps on Google Play and the App Store. Each one earns its place by solving a single everyday problem well."
      >
        <div className={styles.chips}>
          {CHIPS.map((chip) => (
            <SiteLink key={chip.anchor} href={routes.products} anchor={chip.anchor} className={styles.chip}>
              <img
                src={chip.icon}
                alt=""
                width={28}
                height={28}
                className={chip.cover ? `${styles.chipIcon} ${styles.cover}` : styles.chipIcon}
              />
              {chip.label}
            </SiteLink>
          ))}
          <SiteLink
            href={routes.products}
            anchor={productAnchors.earlier}
            className={`${styles.chip} ${styles.textOnly}`}
          >
            Earlier work
          </SiteLink>
        </div>
      </PageHero>
      <DuolySection />
      <KimTaiSection />
      <EarlierWorkSection />
    </main>
  );
}
