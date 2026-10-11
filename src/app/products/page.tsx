import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { AcademySection } from "@/components/products/academy-section";
import { DuolySection } from "@/components/products/duoly-section";
import { EarlierWorkSection } from "@/components/products/earlier-work-section";
import { KimTaiSection } from "@/components/products/kim-tai-section";
import styles from "@/components/products/products.module.css";
import { SiteLink } from "@/components/site-link";
import { pageMetadata } from "@/lib/metadata";
import { productAnchors, routes } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  title: "Products",
  description:
    "Duoly in Love, Kim Tài · Tick Vàng Online and Dan Tech Academy — three products built end-to-end by one person.",
  path: routes.products,
});

const CHIPS = [
  { label: "Duoly in Love", anchor: productAnchors.duoly, icon: "/assets/duoly-icon.png", cover: false },
  { label: "Kim Tài", anchor: productAnchors.kimTai, icon: "/assets/kimtai-icon.png", cover: false },
  { label: "Dan Tech Academy", anchor: productAnchors.academy, icon: "/assets/academy-logo.png", cover: true },
];

export default function ProductsPage() {
  return (
    <main>
      <PageHero
        compact
        narrowTitle
        title="Three products, built end-to-end by one person."
        lead="Two consumer apps on the stores and a school on the web. Each one earns its place by solving a single everyday problem well."
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
      <AcademySection />
      <EarlierWorkSection />
    </main>
  );
}
