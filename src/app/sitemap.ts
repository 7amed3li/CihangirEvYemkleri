import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@/i18n/translations";
import { getPublicRoutes, localizedUrl, languageAlternates } from "@/lib/seo";

/**
 * One <url> per locale per public route, each with the same reciprocal
 * hreflang set emitted in page <head> (both come from src/lib/seo.ts).
 *
 * lastmod / changefreq / priority are intentionally omitted: no reliable
 * per-page modification date is tracked, and Google ignores the other two.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return getPublicRoutes().flatMap((route) =>
    SUPPORTED_LOCALES.map((locale) => ({
      url: localizedUrl(locale, route),
      alternates: { languages: languageAlternates(route) },
    }))
  );
}
