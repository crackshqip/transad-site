import type { MetadataRoute } from "next";
import { SITE_URL } from "./seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The contact form lives at /api/contact and accepts POST only —
        // there's nothing to index there.
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
