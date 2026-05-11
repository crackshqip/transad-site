import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Eyebrow from "@/app/components/Eyebrow";
import SiteNav from "@/app/components/SiteNav";
import Footer from "@/app/components/Footer";
import { SITE_NAME, SITE_URL, OG_IMAGE } from "@/app/seo";

type Bucket = {
  title: string;
  description: string;
  services: string[];
};

type DetailRow = {
  title: string;
  body: string;
};

/** /de/germany is German-only. We don't expose hreflang for /en/germany
 *  because that route doesn't exist — the EN toggle redirects to /en. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "de") return {};

  const title = "Marketing für Deutschland — Transad";
  const description =
    "Digitales Marketing für deutsche Unternehmen — Local SEO, Paid Advertising, E-Commerce und DSGVO-konforme Strategien für den deutschsprachigen Markt.";
  const url = `${SITE_URL}/de/germany`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { de: url, "x-default": url },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url,
      title,
      description,
      locale: "de_DE",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export default async function GermanyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // German-only page. Any other locale (including /en) is a 404 —
  // the LangSwitcher knows to send EN visitors to /en instead.
  if (locale !== "de") notFound();
  setRequestLocale(locale);

  const t = await getTranslations("germany");
  const buckets = t.raw("buckets") as Bucket[];
  const detailRows = t.raw("detail.rows") as DetailRow[];

  return (
    <>
      <SiteNav />
      <main>
        <section className="page-intro container">
          <Eyebrow accent>{t("eyebrow")}</Eyebrow>
          <h1 className="display">{t("headline")}</h1>
          <p className="lead">{t("subhead")}</p>
        </section>

        <section className="container gmy-intro">
          <p>{t("intro")}</p>
        </section>

        <section className="container">
          <div className="gmy-buckets">
            {buckets.map((b, i) => (
              <article className="gmy-bucket" key={i}>
                <span className="gmy-bucket-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="gmy-bucket-title">{b.title}</h2>
                <p className="gmy-bucket-desc">{b.description}</p>
                <ul className="gmy-bucket-pills">
                  {b.services.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="container gmy-detail">
          <Eyebrow accent>{t("detail.eyebrow")}</Eyebrow>
          <h2 className="gmy-detail-headline">{t("detail.headline")}</h2>
          <div className="gmy-rows">
            {detailRows.map((row, i) => (
              <div className="gmy-row" key={i}>
                <span className="gmy-row-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="gmy-row-body">
                  <h3 className="gmy-row-title">{row.title}</h3>
                  <p className="gmy-row-desc">{row.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container">
          <div className="gmy-dsgvo">
            <Eyebrow accent>{t("dsgvo.eyebrow")}</Eyebrow>
            <h2 className="gmy-dsgvo-headline">{t("dsgvo.headline")}</h2>
            <p className="gmy-dsgvo-body">{t("dsgvo.body")}</p>
          </div>
        </section>

        <section className="container">
          <div className="gmy-cta">
            <h2 className="gmy-cta-headline">{t("cta.headline")}</h2>
            <p className="gmy-cta-subhead">{t("cta.subhead")}</p>
            <div className="gmy-cta-actions">
              <Link className="btn btn-primary btn-lg" href="/de#contact">
                <span>{t("cta.buttonPrimary")}</span>
                <span className="arrow" aria-hidden="true">→</span>
              </Link>
              <a className="gmy-cta-email" href={`mailto:${t("cta.email")}`}>
                {t("cta.email")}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
