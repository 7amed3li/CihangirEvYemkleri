/**
 * Centralized SEO source of truth.
 *
 * Every canonical URL, hreflang map, sitemap entry and Open Graph block is
 * derived from SUPPORTED_LOCALES + the public route lists below, so adding a
 * locale or a public page only requires editing one place.
 */
import type { Metadata } from "next";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type Locale } from "@/i18n/translations";
import { menuData } from "@/data/menuData";
import { RESTAURANT_CONFIG } from "@/data/restaurantConfig";

/** Canonical origin. Production serves www (apex 308-redirects to www on Vercel). */
export const SITE_URL = "https://www.cihangirevyemekler.com.tr";
export const SITE_NAME = RESTAURANT_CONFIG.name;
export const DEFAULT_OG_IMAGE = "/splash/logo-original.webp";

/** Locale-prefixed static public routes ("" = locale home). */
export const STATIC_PUBLIC_ROUTES = [
  "",
  "/menu",
  "/about",
  "/contact",
  "/delivery",
  "/faq",
  "/allergens",
  "/terms",
  "/privacy",
  "/cancellation",
] as const;

/** Dish detail routes are generated from the same static data used by generateStaticParams. */
export function getDishIds(): string[] {
  const ids = menuData.flatMap((c) => c.items.map((i) => i.id)).filter(Boolean);
  return Array.from(new Set(ids));
}

export function getPublicRoutes(): string[] {
  return [...STATIC_PUBLIC_ROUTES, ...getDishIds().map((id) => `/dish/${id}`)];
}

export const RTL_LOCALES: readonly Locale[] = ["ar", "fa"];
export function isRtlLocale(locale: string): boolean {
  return RTL_LOCALES.includes(locale as Locale);
}

export function isSupportedLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

/** Open Graph expects language_TERRITORY. */
export const OG_LOCALES: Record<Locale, string> = {
  tr: "tr_TR",
  en: "en_US",
  ar: "ar_AR",
  ru: "ru_RU",
  fa: "fa_IR",
  fr: "fr_FR",
  de: "de_DE",
  it: "it_IT",
  es: "es_ES",
  zh: "zh_CN",
};

/** Absolute canonical URL for a locale + route path (no trailing slash). */
export function localizedUrl(locale: string, path: string = ""): string {
  return `${SITE_URL}/${locale}${path}`;
}

/**
 * Reciprocal hreflang map for a route. x-default points at the default-locale
 * page, which is also where the bare domain ("/") redirects.
 */
export function languageAlternates(path: string = ""): Record<string, string> {
  const map: Record<string, string> = {};
  for (const l of SUPPORTED_LOCALES) map[l] = localizedUrl(l, path);
  map["x-default"] = localizedUrl(DEFAULT_LOCALE, path);
  return map;
}

export interface PageSeoInput {
  locale: string;
  /** Route path after the locale, e.g. "/menu" or "" for home. */
  path: string;
  /** Full title. Rendered as-is (layout template is bypassed to avoid a doubled brand). */
  title: string;
  description: string;
  image?: { url: string; alt?: string; width?: number; height?: number };
  type?: "website" | "article";
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
  image,
  type = "website",
}: PageSeoInput): Metadata {
  const canonical = localizedUrl(locale, path);
  const img = image ?? { url: DEFAULT_OG_IMAGE, alt: SITE_NAME };
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale as Locale] ?? OG_LOCALES[DEFAULT_LOCALE],
      alternateLocale: SUPPORTED_LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
      type,
      images: [img],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [img.url],
    },
  };
}
