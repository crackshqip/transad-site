import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import Eyebrow from "@/app/components/Eyebrow";
import SiteNav from "@/app/components/SiteNav";
import Footer from "@/app/components/Footer";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/app/seo";

const PACKAGE_IDS = ["starter", "growth", "scale"] as const;
type PackageId = (typeof PACKAGE_IDS)[number];
const FEATURED: PackageId = "growth";

const SEO_BY_LOCALE: Record<string, { title: string; description: string }> = {
  en: {
    title: "Pricing — Transad packages from €799/month",
    description:
      "Three packages, one outcome. Starter, Growth, and Scale — transparent monthly pricing for SMEs and ambitious brands. From €799/month.",
  },
  de: {
    title: "Preise — Transad Pakete ab €799/Monat",
    description:
      "Drei Pakete, ein Ziel. Starter, Growth und Scale — transparente Monatspreise für KMU und ambitionierte Marken. Ab €799/Monat.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return buildMetadata({ locale, path: "/pricing", ...SEO_BY_LOCALE[locale] });
}

type Category = { title: string; items: string[] };

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("pricing");

  return (
    <>
      <SiteNav />
      <main>
        <section className="page-intro container">
          <Eyebrow number={1} accent>
            {t("eyebrow")}
          </Eyebrow>
          <h1 className="display">
            {t.rich("headline", { em: (chunks) => <em>{chunks}</em> })}
          </h1>
          <p className="lead">{t("lead")}</p>
        </section>

        <section className="container">
          <div className="pricing-grid">
            {PACKAGE_IDS.map((id) => {
              const isFeatured = id === FEATURED;
              const categories = t.raw(`packages.${id}.categories`) as Category[];
              return (
                <article
                  key={id}
                  className={`pkg${isFeatured ? " pkg-featured" : ""}`}
                  aria-label={t(`packages.${id}.eyebrow`)}
                >
                  <span className="pkg-eyebrow">
                    {t(`packages.${id}.eyebrow`)}
                  </span>
                  <h2 className="pkg-title">
                    {t.rich(`packages.${id}.title`, {
                      em: (chunks) => <em>{chunks}</em>,
                    })}
                  </h2>
                  <p className="pkg-desc">{t(`packages.${id}.description`)}</p>

                  <div className="pkg-price">
                    <span className="pkg-price-amount">
                      {t(`packages.${id}.price`)}
                    </span>
                    <span className="per">{t("perMonth")}</span>
                  </div>
                  <div className="pkg-terms">{t(`packages.${id}.terms`)}</div>

                  <div className="pkg-ideal">
                    <span className="lbl">{t("idealForLabel")}</span>
                    <p>{t(`packages.${id}.idealFor`)}</p>
                  </div>

                  {categories.map((cat) => (
                    <div className="pkg-category" key={cat.title}>
                      <h3>{cat.title}</h3>
                      <ul>
                        {cat.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </article>
              );
            })}
          </div>
        </section>

        <section className="container">
          <div className="cta-strip">
            <h3>{t("cta.title")}</h3>
            <Link className="btn btn-primary btn-lg" href={`/${locale}#contact`}>
              <span>{t("cta.button")}</span>
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
