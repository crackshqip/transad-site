import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import LegalPage from "@/app/components/LegalPage";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/app/seo";

const SEO_BY_LOCALE: Record<string, { title: string; description: string }> = {
  en: {
    title: "Terms — Transad",
    description:
      "General terms governing engagements between Transad and our clients — services, pricing, intellectual property, liability.",
  },
  de: {
    title: "AGB — Transad",
    description:
      "Allgemeine Geschäftsbedingungen für die Zusammenarbeit zwischen Transad und unseren Kund:innen — Leistungen, Vergütung, Nutzungsrechte, Haftung.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return buildMetadata({ locale, path: "/terms", ...SEO_BY_LOCALE[locale] });
}

export default async function Terms({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <LegalPage namespace="terms" />;
}
