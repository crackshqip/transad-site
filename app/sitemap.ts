import type { MetadataRoute } from "next";
import { SITE_URL } from "./seo";
import { routing } from "@/i18n/routing";

// Every public, indexable route under a locale prefix.
const PATHS = [
  "",
  "/work",
  "/studio",
  "/services",
  "/pricing",
  "/imprint",
  "/privacy",
  "/terms",
] as const;

// Routes that exist in only one locale — emitted once, without
// cross-locale hreflang alternates.
const LOCALE_ONLY_PATHS: { path: string; locale: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/germany", locale: "de", priority: 0.7, changeFrequency: "monthly" },
];

const PRIORITY: Record<string, number> = {
  "": 1.0,
  "/work": 0.9,
  "/studio": 0.8,
  "/services": 0.8,
  "/pricing": 0.8,
  "/imprint": 0.3,
  "/privacy": 0.3,
  "/terms": 0.3,
};

const CHANGE_FREQ: Record<string, MetadataRoute.Sitemap[number]["changeFrequency"]> = {
  "": "monthly",
  "/work": "monthly",
  "/studio": "monthly",
  "/services": "monthly",
  "/pricing": "monthly",
  "/imprint": "yearly",
  "/privacy": "yearly",
  "/terms": "yearly",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const localized = routing.locales.flatMap((locale) =>
    PATHS.map((path) => {
      const languages: Record<string, string> = Object.fromEntries(
        routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
      );
      languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}${path}`;

      return {
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: CHANGE_FREQ[path],
        priority: PRIORITY[path],
        alternates: { languages },
      };
    }),
  );

  const localeOnly = LOCALE_ONLY_PATHS.map(({ path, locale, priority, changeFrequency }) => {
    const url = `${SITE_URL}/${locale}${path}`;
    return {
      url,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: { languages: { [locale]: url, "x-default": url } },
    };
  });

  return [...localized, ...localeOnly];
}
