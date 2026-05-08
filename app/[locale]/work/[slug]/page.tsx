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

type Item = {
  slug: string;
  title: string;
  outcome: string;
  tag: string;
  year: number | string;
  cardImage?: string;
};

type ShowcaseItem = {
  src: string;
  alt: string;
  caption: string;
  style?: "contained" | "fullbleed";
  pair?: boolean;
};

type ShowcaseGroup =
  | { type: "single"; img: ShowcaseItem }
  | { type: "pair"; images: [ShowcaseItem, ShowcaseItem] };

function groupShowcase(items: ShowcaseItem[]): ShowcaseGroup[] {
  const groups: ShowcaseGroup[] = [];
  let i = 0;
  while (i < items.length) {
    const img = items[i];
    const next = items[i + 1];
    if (img.pair && next?.pair) {
      groups.push({ type: "pair", images: [img, next] });
      i += 2;
    } else {
      groups.push({ type: "single", img });
      i += 1;
    }
  }
  return groups;
}

type CaseStudyContent = {
  eyebrow: string;
  title: string;
  outcome: string;
  meta: { label: string; value: string }[];
  hero: { src: string; alt: string };
  brief: { eyebrow: string; body: string };
  approach: { eyebrow: string; body: string };
  stats: { num: string; lbl: string }[];
  statsNote?: string;
  showcase: ShowcaseItem[];
  results: { eyebrow: string; headline: string; bullets: string[] };
  navigation: { back: string; next: string };
  cta: { title: string; button: string };
};

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

  const studies = t.raw("caseStudies") as Record<string, CaseStudyContent> | undefined;
  const study = studies?.[slug];

  return buildMetadata({
    locale,
    path: `/work/${slug}`,
    title: `${item.title} — Transad`,
    description: study?.outcome ?? item.outcome,
  });
}

export default async function CaseStudyPage({
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

  const studies = t.raw("caseStudies") as Record<string, CaseStudyContent> | undefined;
  const study = studies?.[slug];

  if (!study) {
    return (
      <>
        <SiteNav />
        <main>
          <section className="page-intro container">
            <Eyebrow accent>
              {item.tag} · {item.year}
            </Eyebrow>
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

  // "Next case study" cycles through items that have rich content only —
  // skipping placeholder slugs so the link always lands on a real case study.
  const studyItems = items.filter((i) => Boolean(studies?.[i.slug]));
  const currentStudyIndex = studyItems.findIndex((i) => i.slug === slug);
  const nextItem = studyItems[(currentStudyIndex + 1) % studyItems.length];

  return (
    <>
      <SiteNav />
      <main>
        <article className="case">
          <header className="case-hero container">
            <div className="case-hero-eyebrow">{study.eyebrow}</div>
            <h1 className="case-hero-title">{study.title}</h1>
            <p className="case-hero-outcome">{study.outcome}</p>

            <dl className="case-meta-strip">
              {study.meta.map((m) => (
                <div className="case-meta-cell" key={m.label}>
                  <dt className="case-meta-label">{m.label}</dt>
                  <dd className="case-meta-value">{m.value}</dd>
                </div>
              ))}
            </dl>
          </header>

          <figure className="case-hero-image">
            <Image
              src={study.hero.src}
              alt={study.hero.alt}
              width={2400}
              height={1600}
              priority
              sizes="100vw"
            />
          </figure>

          <section className="case-intro container">
            <div className="case-intro-grid">
              <div className="case-intro-col">
                <div className="case-intro-eyebrow">{study.brief.eyebrow}</div>
                <p className="case-intro-body">{study.brief.body}</p>
              </div>
              <div className="case-intro-col">
                <div className="case-intro-eyebrow">{study.approach.eyebrow}</div>
                <p className="case-intro-body">{study.approach.body}</p>
              </div>
            </div>

            {study.statsNote && (
              <div className="case-stats-note">{study.statsNote}</div>
            )}
            <div className="case-stats">
              {study.stats.map((s, i) => (
                <div className="case-stat" key={i}>
                  <div className="case-stat-num">{s.num}</div>
                  <div className="case-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="case-showcase">
            {groupShowcase(study.showcase).map((group, i) => {
              if (group.type === "pair") {
                return (
                  <div className="case-show-pair" key={i}>
                    {group.images.map((img, j) => (
                      <figure className="case-show case-show-paired" key={j}>
                        <div className="case-show-frame">
                          <Image
                            src={img.src}
                            alt={img.alt}
                            width={2400}
                            height={1600}
                            sizes="(max-width: 768px) 92vw, (max-width: 1200px) 46vw, 540px"
                          />
                        </div>
                        {img.caption && (
                          <figcaption className="case-show-caption">
                            {img.caption}
                          </figcaption>
                        )}
                      </figure>
                    ))}
                  </div>
                );
              }
              const img = group.img;
              const isFull = img.style === "fullbleed";
              return (
                <figure
                  className={`case-show ${isFull ? "case-show-full" : "case-show-contained"}`}
                  key={i}
                >
                  <div className="case-show-frame">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={2400}
                      height={1600}
                      sizes={isFull ? "100vw" : "(max-width: 1200px) 92vw, 1080px"}
                    />
                  </div>
                  {img.caption && (
                    <figcaption className="case-show-caption">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </section>

          <section className="case-results container">
            <div className="case-results-eyebrow">{study.results.eyebrow}</div>
            <h2 className="case-results-headline">{study.results.headline}</h2>
            <ul className="case-results-list">
              {study.results.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </section>

          <nav className="case-nav container">
            <Link className="case-nav-back" href={`/${locale}/work`}>
              <span aria-hidden="true">←</span>
              <span>{study.navigation.back}</span>
            </Link>
            <Link
              className="case-nav-next"
              href={`/${locale}/work/${nextItem.slug}`}
            >
              <span>{study.navigation.next}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </nav>

          <section className="container">
            <div className="cta-strip">
              <h2>{study.cta.title}</h2>
              <Link
                className="btn btn-primary btn-lg"
                href={`/${locale}#contact`}
              >
                <span>{study.cta.button}</span>
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
