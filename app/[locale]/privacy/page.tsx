import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import LegalPage from "@/app/components/LegalPage";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/app/seo";

const SEO_BY_LOCALE: Record<string, { title: string; description: string }> = {
  en: {
    title: "Privacy policy — Transad",
    description:
      "How Transad handles personal data on this website. GDPR-compliant privacy policy covering cookies, contact form, server logs, and your rights.",
  },
  de: {
    title: "Datenschutz — Transad",
    description:
      "Wie Transad mit personenbezogenen Daten auf dieser Website umgeht. DSGVO-konforme Datenschutzerklärung zu Cookies, Kontaktformular, Server-Logs und Ihren Rechten.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return buildMetadata({ locale, path: "/privacy", ...SEO_BY_LOCALE[locale] });
}

export default async function Privacy({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <LegalPage namespace="privacy" />;
}
