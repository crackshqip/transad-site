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
    title: "Studio — Transad",
    description:
      "A deliberate practice across Stuttgart, Leeds, Pristina, and Vilnius — identity, campaigns, and digital systems built for clarity.",
  },
  de: {
    title: "Studio — Transad",
    description:
      "Ein bewusst geführtes Studio in Stuttgart, Leeds, Prishtina und Vilnius — Identität, Kampagnen und digitale Systeme mit Anspruch auf Klarheit.",
  },
};

type Member = { slug: string; name: string; role: string };
type Principle = { title: string; body: string };
type Location = { slug: string; city: string; address: string; hours: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return buildMetadata({ locale, path: "/studio", ...SEO_BY_LOCALE[locale] });
}

export default async function StudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("studioPage");
  const principles = t.raw("principles.items") as Principle[];
  const members = t.raw("team.members") as Member[];
  const locations = t.raw("locations.list") as Location[];

  return (
    <>
      <SiteNav />
      <main>
        {/* HERO */}
        <section className="page-intro container">
          <Eyebrow number={2}>{t("eyebrow")}</Eyebrow>
          <h1 className="display">{t("headline")}</h1>
          <div className="studio-hero-grid">
            <div>
              <p className="lede">
                {t.rich("lede", { em: (chunks) => <em>{chunks}</em> })}
              </p>
              <p className="body">{t("body1")}</p>
              <p className="body">{t("body2")}</p>
            </div>
            <div className="studio-stats">
              <div className="stat">
                <div className="num">12</div>
                <div className="lbl">{t("stats.caseStudies")}</div>
              </div>
              <div className="stat">
                <div className="num">6</div>
                <div className="lbl">{t("stats.studioMembers")}</div>
              </div>
              <div className="stat">
                <div className="num">4</div>
                <div className="lbl">{t("stats.cities")}</div>
              </div>
              <div className="stat">
                <div className="num">19</div>
                <div className="lbl">{t("stats.yearEstablished")}</div>
              </div>
            </div>
          </div>
        </section>

        {/* PRINCIPLES */}
        <section className="section container">
          <Eyebrow number={3}>{t("principles.eyebrow")}</Eyebrow>
          <div className="principles-grid">
            {principles.map((p, i) => (
              <article className="principle" key={p.title}>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{p.title}</h2>
                  <p>{p.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* TEAM */}
        <section className="section container">
          <Eyebrow number={4}>{t("team.eyebrow")}</Eyebrow>
          <div className="team-grid">
            {members.map((m) => (
              <article className="team-card" key={m.slug}>
                <div className="team-photo">
                  <Image
                    src={`/images/studio/team/${m.slug}.jpg`}
                    alt={m.name}
                    width={1200}
                    height={1200}
                    sizes="(max-width: 720px) 100vw, (max-width: 960px) 50vw, 33vw"
                  />
                </div>
                <div className="team-meta">
                  <h3 className="team-name">{m.name}</h3>
                  <p className="team-role">{m.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* LOCATIONS */}
        <section className="section container">
          <Eyebrow number={5}>{t("locations.eyebrow")}</Eyebrow>
          <div className="locations-grid">
            {locations.map((loc) => (
              <article className="location-card" key={loc.slug}>
                <div className="location-photo">
                  <Image
                    src={`/images/studio/locations/${loc.slug}.jpg`}
                    alt={`Transad studio — ${loc.city}`}
                    width={1600}
                    height={1200}
                    sizes="(max-width: 960px) 100vw, 50vw"
                  />
                </div>
                <div className="location-meta">
                  <h3 className="location-city">{loc.city}</h3>
                  <p className="location-address">{loc.address}</p>
                  <p className="location-hours">{loc.hours}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
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
