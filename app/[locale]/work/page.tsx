import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import Eyebrow from "@/app/components/Eyebrow";
import SiteNav from "@/app/components/SiteNav";
import Footer from "@/app/components/Footer";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/app/seo";

const SEO_BY_LOCALE: Record<string, { title: string; description: string }> = {
  en: {
    title: "Work — Transad",
    description:
      "Selected projects across identity, packaging, campaigns, and digital systems.",
  },
  de: {
    title: "Arbeiten — Transad",
    description:
      "Ausgewählte Projekte aus Identität, Verpackung, Kampagnen und digitalen Systemen.",
  },
};

type Item = { slug: string; title: string; outcome: string; tag: string; year: number };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return buildMetadata({ locale, path: "/work", ...SEO_BY_LOCALE[locale] });
}

export default async function WorkIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("workPage");
  const items = t.raw("items") as Item[];

  return (
    <>
      <SiteNav />
      <main>
        <section className="page-intro container">
          <Eyebrow number={3}>{t("eyebrow")}</Eyebrow>
          <h1 className="display">{t("headline")}</h1>
          <p className="lead">{t("lead")}</p>
        </section>

        <section className="container">
          <div className="work-grid">
            {items.map((item) => (
              <Link
                key={item.slug}
                href={`/${locale}/work/${item.slug}`}
                className="work-card"
              >
                <div className="work-card-photo">
                  <Image
                    src={`/images/work/${item.slug}.jpg`}
                    alt={item.title}
                    width={1600}
                    height={1200}
                    sizes="(max-width: 720px) 100vw, 50vw"
                  />
                </div>
                <div className="work-card-meta">
                  <h2 className="work-card-title">{item.title}</h2>
                  <span className="work-card-year">{item.year}</span>
                  <p className="work-card-outcome">{item.outcome}</p>
                </div>
                <span className="work-card-tag">{item.tag}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="container">
          <div className="cta-strip">
            <h2>{t("cta.title")}</h2>
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
