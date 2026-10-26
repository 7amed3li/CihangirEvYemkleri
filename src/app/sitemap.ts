import { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@/i18n/translations";
import { menuData } from "@/data/menuData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cihangir-ev-yemkleri.vercel.app";
  const now = new Date();

  const coreRoutes = [
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
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Generate localized URLs for all core routes with full alternate language links
  for (const route of coreRoutes) {
    for (const locale of SUPPORTED_LOCALES) {
      const url = `${baseUrl}/${locale}${route}`;
      const languageAlternates: Record<string, string> = {};
      SUPPORTED_LOCALES.forEach((l) => {
        languageAlternates[l] = `${baseUrl}/${l}${route}`;
      });

      entries.push({
        url,
        lastModified: now,
        changeFrequency: route === "" || route === "/menu" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : route === "/menu" ? 0.9 : 0.7,
        alternates: {
          languages: languageAlternates,
        },
      });
    }
  }

  // Generate localized URLs for every public dish
  const allDishes = menuData.flatMap((cat) => cat.items);
  for (const dish of allDishes) {
    for (const locale of SUPPORTED_LOCALES) {
      const url = `${baseUrl}/${locale}/dish/${dish.id}`;
      const languageAlternates: Record<string, string> = {};
      SUPPORTED_LOCALES.forEach((l) => {
        languageAlternates[l] = `${baseUrl}/${l}/dish/${dish.id}`;
      });

      entries.push({
        url,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: {
          languages: languageAlternates,
        },
      });
    }
  }

  return entries;
}
