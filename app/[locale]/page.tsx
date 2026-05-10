import type { Metadata } from "next";
import Image from "next/image";
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
    title: "Transad — Clarity. Made visible.",
    description:
      "Transad is a minimal marketing and branding agency. We help modern businesses communicate with clarity, consistency, and visual impact.",
  },
  de: {
    title: "Transad — Klarheit. Sichtbar gemacht.",
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

const FEATURED_SLUGS = ["hello-baby-box", "treventi"] as const;

type WorkItem = {
  slug: string;
  title: string;
  outcome: string;
  tag: string;
  year?: number | string;
  cardImage?: string;
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
  const tWorkPage = await getTranslations("workPage");
  const allItems = tWorkPage.raw("items") as WorkItem[];
  const featuredItems = FEATURED_SLUGS
    .map((slug) => allItems.find((i) => i.slug === slug))
    .filter((i): i is WorkItem => Boolean(i));
  const tContact = await getTranslations("contact");

  return (
    <>
      <SiteNav />
      <main id="top">
        <section className="hero container">
          <Eyebrow number={1}>
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
            <Link className="btn btn-ghost btn-lg" href={`/${locale}/studio`}>
              {tHero("ctaSecondary")}
            </Link>
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
          </div>
          <div className="work-list">
            {featuredItems.map((item, i) => (
              <Link
                className="work-row"
                key={item.slug}
                href={`/${locale}/work/${item.slug}`}
                aria-label={tWork("openLabel", { title: item.title })}
              >
                <span className="wr-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="wr-thumb">
                  {item.cardImage && (
                    <Image
                      src={item.cardImage}
                      alt={item.title}
                      width={560}
                      height={420}
                      sizes="(max-width: 768px) 92vw, 140px"
                    />
                  )}
                </div>
                <span className="wr-title">{item.title}</span>
                <span className="wr-meta">{item.tag}</span>
                <span className="wr-year">{item.year ?? ""}</span>
                <span className="wr-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
          <div className="work-cta">
            <Link className="btn-caps" href={`/${locale}/work`}>
              <span>{tWork("viewAllCta")}</span>
              <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="container">
            <Eyebrow number={5}>
              {tContact("eyebrow")}
            </Eyebrow>
            <h2 className="contact-headline">{tContact("headline")}</h2>
            <div className="contact-grid">
              <div className="contact-aside">
                <p>{tContact("intro")}</p>
                <div className="channels">
                  <div className="channel">
                    <span className="lbl">{tContact("channels.emailLabel")}</span>
                    {(tContact.raw("channels.emails") as string[]).map((e) => (
                      <span className="val" key={e}>
                        <a href={`mailto:${e}`}>{e}</a>
                      </span>
                    ))}
                  </div>
                  <div className="channel">
                    <span className="lbl">{tContact("channels.phoneLabel")}</span>
                    <span className="val">
                      <a
                        href={`tel:${tContact("channels.phone").replace(/\s/g, "")}`}
                      >
                        {tContact("channels.phone")}
                      </a>
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
