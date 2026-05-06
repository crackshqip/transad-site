import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import LegalPage from "@/app/components/LegalPage";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/app/seo";

const SEO_BY_LOCALE: Record<string, { title: string; description: string }> = {
  en: {
    title: "Imprint — Transad",
    description:
      "Imprint and legal information for Transad — company details, contact, VAT identification, and content responsibility.",
  },
  de: {
    title: "Impressum — Transad",
    description:
      "Impressum und rechtliche Angaben von Transad — Unternehmensdaten, Kontakt, Umsatzsteuer-ID und inhaltliche Verantwortung.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return buildMetadata({ locale, path: "/imprint", ...SEO_BY_LOCALE[locale] });
}

export default async function Imprint({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <LegalPage namespace="imprint" />;
}
