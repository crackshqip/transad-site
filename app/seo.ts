import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://transadgroup.com"
).replace(/\/$/, "");

export const SITE_NAME = "Transad";

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Transad — clarity, made visible.",
};

const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  de: "de_DE",
};

type Args = {
  locale: string;
  /** Path *under* the locale, e.g. "" for the homepage, "/services". */
  path: string;
  title: string;
  description: string;
  /** Override og:type. Defaults to "website". */
  ogType?: "website" | "article" | "profile";
};

/**
 * Build a per-page Metadata object that includes:
 *   - title / description
 *   - canonical URL for the current locale
 *   - hreflang alternates (en, de, x-default)
 *   - Open Graph (og:title, og:description, og:image, og:type, og:url, og:locale)
 *   - Twitter card (summary_large_image)
 *
 * `metadataBase` is set on the root layout, so relative image URLs resolve correctly.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  ogType = "website",
}: Args): Metadata {
  const cleanPath = path.startsWith("/") || path === "" ? path : `/${path}`;
  const url = `${SITE_URL}/${locale}${cleanPath}`;

  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE_URL}/${l}${cleanPath}`]),
  );
  // x-default points at the default locale per Google's hreflang spec.
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}${cleanPath}`;

  const otherLocale = routing.locales.find((l) => l !== locale);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      type: ogType,
      siteName: SITE_NAME,
      url,
      title,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: otherLocale ? OG_LOCALE[otherLocale] : undefined,
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
