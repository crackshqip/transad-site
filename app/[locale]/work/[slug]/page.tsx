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

type Item = { slug: string; title: string; outcome: string; tag: string; year: number };

// Re-use the EN list to enumerate valid slugs at build time. The page itself
// reads the active-locale title for display.
import enMessages from "@/messages/en.json";
const VALID_SLUGS = (enMessages.workPage.items as Item[]).map((i) => i.slug);

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    VALID_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  if (!VALID_SLUGS.includes(slug)) return {};

  const t = await getTranslations({ locale, namespace: "workPage" });
  const items = t.raw("items") as Item[];
  const item = items.find((i) => i.slug === slug);
  if (!item) return {};

  const titleByLocale: Record<string, string> = {
    en: `${item.title} — Transad`,
    de: `${item.title} — Transad`,
  };
  return buildMetadata({
    locale,
    path: `/work/${slug}`,
    title: titleByLocale[locale],
    description: item.outcome,
  });
}

export default async function CaseStudyPlaceholder({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  if (!VALID_SLUGS.includes(slug)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("workPage");
  const items = t.raw("items") as Item[];
  const item = items.find((i) => i.slug === slug)!;

  return (
    <>
      <SiteNav />
      <main>
        <section className="page-intro container">
          <Eyebrow accent>{item.tag} · {item.year}</Eyebrow>
          <h1 className="display">{item.title}</h1>
          <p className="lead">{item.outcome}</p>
        </section>

        <section className="container">
          <div className="case-placeholder">
            <h2>{t("casePlaceholder.headline")}</h2>
            <p>{t("casePlaceholder.lead")}</p>
            <Link className="btn btn-text" href={`/${locale}/work`}>
              <span>← {t("casePlaceholder.back")}</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
