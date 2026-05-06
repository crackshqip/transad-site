import type { MetadataRoute } from "next";
import { SITE_URL } from "./seo";
import { routing } from "@/i18n/routing";

// Every public, indexable route under a locale prefix.
const PATHS = ["", "/services", "/pricing", "/imprint", "/privacy", "/terms"] as const;

const PRIORITY: Record<string, number> = {
  "": 1.0,
  "/services": 0.8,
  "/pricing": 0.8,
  "/imprint": 0.3,
  "/privacy": 0.3,
  "/terms": 0.3,
};

const CHANGE_FREQ: Record<string, MetadataRoute.Sitemap[number]["changeFrequency"]> = {
  "": "monthly",
  "/services": "monthly",
  "/pricing": "monthly",
  "/imprint": "yearly",
  "/privacy": "yearly",
  "/terms": "yearly",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routing.locales.flatMap((locale) =>
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
}
