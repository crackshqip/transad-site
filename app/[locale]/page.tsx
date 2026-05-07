import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import Eyebrow from "@/app/components/Eyebrow";
import SiteNav from "@/app/components/SiteNav";
import Footer from "@/app/components/Footer";
import ContactForm from "@/app/components/ContactForm";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/app/seo";

const SEO_BY_LOCALE: Record<string, { title: string; description: string }> = {
  en: {
    title: "Transad — Clarity, made visible.",
    description:
      "Transad is a minimal marketing and branding agency. We help modern businesses communicate with clarity, consistency, and visual impact.",
  },
  de: {
    title: "Transad — Klarheit, sichtbar gemacht.",
    description:
      "Transad ist eine minimalistische Agentur für Marketing und Branding. Wir helfen modernen Unternehmen, klar und konsistent zu kommunizieren.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return buildMetadata({ locale, path: "", ...SEO_BY_LOCALE[locale] });
}

const PROJECT_IDS = ["voss", "fieldnotes", "luma", "meridian", "obverse"] as const;
const PROJECT_YEARS: Record<(typeof PROJECT_IDS)[number], number> = {
  voss: 2026,
  fieldnotes: 2025,
  luma: 2025,
  meridian: 2024,
  obverse: 2024,
};

const SERVICE_IDS = ["identity", "campaigns", "digital", "direction"] as const;

export default async function LocaleHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const tHero = await getTranslations("hero");
  const tAbout = await getTranslations("about");
  const tStudioPage = await getTranslations("studioPage");
  const tServices = await getTranslations("services");
  const tWork = await getTranslations("work");
  const tContact = await getTranslations("contact");

  return (
    <>
      <SiteNav />
      <main id="top">
        <section className="hero container">
          <Eyebrow number={1} accent>
            {tHero("eyebrow")}
          </Eyebrow>
          <h1 className="display">
            {tHero.rich("headline", {
              em: (chunks) => <em>{chunks}</em>,
            })}
          </h1>
          <p className="lead">{tHero("lead")}</p>
          <div className="hero-actions">
            <a className="btn btn-dark btn-lg" href="#work">
              <span>{tHero("ctaPrimary")}</span>
              <span className="arrow" aria-hidden="true">→</span>
            </a>
            <a className="btn btn-ghost btn-lg" href="#contact">
              {tHero("ctaSecondary")}
            </a>
          </div>
          <dl className="hero-meta">
            {(["founded", "studios", "practice", "engagements"] as const).map((k) => (
              <div key={k}>
                <dt className="lbl">{tHero(`meta.${k}.label`)}</dt>
                <dd className="val">{tHero(`meta.${k}.value`)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="about" className="section container">
          <Eyebrow number={2}>{tAbout("eyebrow")}</Eyebrow>
          <div className="section-head">
            <h2>{tAbout("headline")}</h2>
          </div>
          <div className="about-teaser">
            <p className="lede">
              {tAbout.rich("lede", {
                em: (chunks) => <em>{chunks}</em>,
              })}
            </p>
            <p className="body">{tAbout("body1")}</p>
            <Link className="btn btn-text" href={`/${locale}/studio`}>
              <span>{tStudioPage("homepageTeaser")}</span>
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section id="services" className="section container">
          <Eyebrow number={3}>{tServices("eyebrow")}</Eyebrow>
          <div className="section-head">
            <h2>{tServices("headline")}</h2>
          </div>
          <div className="services">
            {SERVICE_IDS.map((id, i) => {
              const tags = tServices.raw(`items.${id}.tags`) as string[];
              return (
                <article className="service" key={id}>
                  <span className="num">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{tServices(`items.${id}.title`)}</h3>
                    <p>{tServices(`items.${id}.body`)}</p>
                    <ul>
                      {tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="work" className="section container">
          <div className="section-head">
            <div>
              <Eyebrow number={4}>{tWork("eyebrow")}</Eyebrow>
              <h2>{tWork("headline")}</h2>
            </div>
            <a className="btn btn-text" href="#contact">
              <span>{tWork("indexCta")}</span>
              <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>
          <div className="work-list">
            {PROJECT_IDS.map((id, i) => {
              const title = tWork(`projects.${id}.title`);
              return (
                <a
                  className="work-row"
                  key={id}
                  href="#contact"
                  aria-label={tWork("openLabel", { title })}
                >
                  <span className={`wr-num${i === 0 ? " accent" : ""}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="wr-title">{title}</span>
                  <span className="wr-meta">{tWork(`projects.${id}.kind`)}</span>
                  <span className="wr-year">{PROJECT_YEARS[id]}</span>
                  <span className="wr-arrow" aria-hidden="true">→</span>
                </a>
              );
            })}
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="container">
            <Eyebrow number={5} accent>
              {tContact("eyebrow")}
            </Eyebrow>
            <h2 className="contact-headline">{tContact("headline")}</h2>
            <div className="contact-grid">
              <div className="contact-aside">
                <p>{tContact("intro")}</p>
                <div className="channels">
                  <div className="channel">
                    <span className="lbl">{tContact("channels.emailLabel")}</span>
                    <span className="val">
                      <a href="mailto:hi@transad.studio">hi@transad.studio</a>
                    </span>
                  </div>
                  <div className="channel">
                    <span className="lbl">{tContact("channels.phoneLabel")}</span>
                    <span className="val">
                      <a href="tel:+492110000">+49 211 0000</a>
                    </span>
                  </div>
                  <div className="channel">
                    <span className="lbl">{tContact("channels.studiosLabel")}</span>
                    <span className="val">{tContact("channels.studiosValue")}</span>
                  </div>
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
