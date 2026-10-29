import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Public pages, assets and /api/rates (used client-side for price display)
 * stay crawlable. Only the private admin UI and admin API are excluded from
 * crawling; admin pages additionally send noindex via their layout metadata.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/admin"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
