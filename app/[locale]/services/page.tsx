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

const SERVICE_IDS = ["social", "content", "advertising", "strategy"] as const;

const SEO_BY_LOCALE: Record<string, { title: string; description: string }> = {
  en: {
    title: "Services — Transad marketing & branding agency",
    description:
      "Four disciplines: social media marketing, content production, online advertising, and strategy & reporting. The Transad services overview.",
  },
  de: {
    title: "Leistungen — Transad Marketing & Branding",
    description:
      "Vier Disziplinen: Social Media Marketing, Content-Produktion, Online Advertising und Strategie & Reporting — die Transad-Leistungen im Überblick.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return buildMetadata({ locale, path: "/services", ...SEO_BY_LOCALE[locale] });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("servicesPage");

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

        {SERVICE_IDS.map((id, i) => {
          const deliverables = t.raw(`items.${id}.deliverables`) as string[];
          return (
            <section className="section container" key={id}>
              <Eyebrow number={i + 1}>{t(`items.${id}.title`)}</Eyebrow>
              <div className="service-block">
                <div>
                  <h2>
                    {t.rich(`items.${id}.headline`, {
                      em: (chunks) => <em>{chunks}</em>,
                    })}
                  </h2>
                  <p>{t(`items.${id}.body`)}</p>
                </div>
                <div>
                  <div className="deliverables-label">{t("deliverablesLabel")}</div>
                  <ul className="deliverables">
                    {deliverables.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          );
        })}

        <section className="container">
          <div className="cta-strip">
            <h3>{t("cta.title")}</h3>
            <Link className="btn btn-primary btn-lg" href={`/${locale}/pricing`}>
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
