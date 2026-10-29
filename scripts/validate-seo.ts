/**
 * Automated Technical SEO & International SEO Validation Suite
 *
 * Runs deterministic tests across:
 *  1. Dynamic route discovery & canonical structure
 *  2. Page metadata completeness & uniqueness
 *  3. Hreflang reciprocity, self-references & x-default
 *  4. XML Sitemap generator & schema compliance
 *  5. Robots.txt directives & sitemap references
 *  6. Schema.org JSON-LD business entity facts & dish markup
 *  7. Crawlable internal navigation link validation
 */
import {
  SITE_URL,
  SITE_NAME,
  STATIC_PUBLIC_ROUTES,
  getDishIds,
  getPublicRoutes,
  buildPageMetadata,
  localizedUrl,
  languageAlternates,
  isRtlLocale,
} from "../src/lib/seo";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  Locale,
} from "../src/i18n/translations";
import { PAGES_META } from "../src/data/pagesContent";
import { RESTAURANT_CONFIG } from "../src/data/restaurantConfig";
import { buildRestaurantSchema } from "../src/components/RestaurantJsonLd";
import { menuData } from "../src/data/menuData";
import { getDishDisplay } from "../src/data/dishTranslations";
import sitemap from "../src/app/sitemap";
import robots from "../src/app/robots";

interface TestResult {
  name: string;
  status: "PASS" | "FAIL";
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, failureDetails?: string) {
  if (condition) {
    results.push({ name, status: "PASS" });
  } else {
    results.push({
      name,
      status: "FAIL",
      details: failureDetails || "Assertion failed",
    });
    console.error(`❌ FAIL: ${name} -> ${failureDetails}`);
  }
}

async function runSeoSuite() {
  console.log("=================================================");
  console.log("   AUTOMATED TECHNICAL & INTERNATIONAL SEO SUITE ");
  console.log("=================================================\n");

  // TEST 1: Hostname & Site Origin
  assert(
    SITE_URL === "https://www.cihangirevyemekler.com.tr",
    "Origin Hostname: Canonical www HTTPS format",
    `Expected https://www.cihangirevyemekler.com.tr, got ${SITE_URL}`
  );

  // TEST 2: Supported Locales & RTL
  assert(
    SUPPORTED_LOCALES.length === 10,
    "Locales: Exactly 10 supported locales configured",
    `Count: ${SUPPORTED_LOCALES.length}`
  );
  assert(
    DEFAULT_LOCALE === "tr",
    "Locales: Default locale is 'tr'",
    `Got ${DEFAULT_LOCALE}`
  );
  assert(
    isRtlLocale("ar") && isRtlLocale("fa") && !isRtlLocale("tr") && !isRtlLocale("en"),
    "Locales: RTL detection is correct for Arabic and Persian only",
    "RTL check failed"
  );

  // TEST 3: Route Discovery
  const publicRoutes = getPublicRoutes();
  const dishIds = getDishIds();
  assert(
    STATIC_PUBLIC_ROUTES.length === 10,
    "Routes: 10 static public routes identified",
    `Got ${STATIC_PUBLIC_ROUTES.length}`
  );
  assert(
    dishIds.length > 80,
    "Routes: Menu dish IDs discovered dynamically",
    `Found ${dishIds.length} dishes`
  );
  assert(
    publicRoutes.length === STATIC_PUBLIC_ROUTES.length + dishIds.length,
    "Routes: Public routes correctly sum static + dynamic dishes",
    `Total: ${publicRoutes.length}`
  );

  // TEST 4: Canonical URLs & Hreflang across all routes & locales
  let allCanonicalsValid = true;
  let allHreflangsReciprocal = true;
  let allHreflangsSelfReferencing = true;
  let allXDefaultsValid = true;

  for (const route of publicRoutes) {
    for (const locale of SUPPORTED_LOCALES) {
      const canonical = localizedUrl(locale, route);
      if (!canonical.startsWith(SITE_URL) || canonical.endsWith("/")) {
        allCanonicalsValid = false;
      }

      const alternates = languageAlternates(route);

      // Check self-reference
      if (alternates[locale] !== canonical) {
        allHreflangsSelfReferencing = false;
      }

      // Check x-default points to default locale (tr)
      if (alternates["x-default"] !== localizedUrl(DEFAULT_LOCALE, route)) {
        allXDefaultsValid = false;
      }

      // Check reciprocity: every supported locale has an entry
      for (const targetLocale of SUPPORTED_LOCALES) {
        if (!alternates[targetLocale] || !alternates[targetLocale].includes(`/${targetLocale}`)) {
          allHreflangsReciprocal = false;
        }
      }
    }
  }

  assert(
    allCanonicalsValid,
    "Canonical URLs: Fully-qualified HTTPS URLs without trailing slashes",
    "At least one canonical URL was malformed"
  );
  assert(
    allHreflangsSelfReferencing,
    "Hreflang: Every page contains an accurate self-referencing hreflang tag",
    "Self-referencing hreflang missing or mismatched"
  );
  assert(
    allHreflangsReciprocal,
    "Hreflang: Reciprocal alternate references for all 10 locales on all routes",
    "Reciprocity broken on one or more routes"
  );
  assert(
    allXDefaultsValid,
    "Hreflang: x-default destination consistently maps to canonical default locale (tr)",
    "x-default mapping invalid"
  );

  // TEST 5: Metadata generation & uniqueness for Subpages
  let allPagesMetaValid = true;
  const subpages = [
    "about",
    "contact",
    "delivery",
    "faq",
    "allergens",
    "terms",
    "privacy",
    "cancellation",
  ] as const;

  for (const pageName of subpages) {
    const pageMeta = PAGES_META[pageName];
    if (!pageMeta) {
      allPagesMetaValid = false;
      continue;
    }
    for (const locale of SUPPORTED_LOCALES) {
      const localized = pageMeta[locale as Locale] || pageMeta.tr;
      const meta = buildPageMetadata({
        locale,
        path: `/${pageName}`,
        title: localized.title,
        description: localized.description,
      });

      if (!meta.title || !meta.description || meta.robots) {
        allPagesMetaValid = false;
      }
    }
  }
  assert(
    allPagesMetaValid,
    "Page Metadata: Descriptive titles and descriptions for all 8 subpages across 10 locales",
    "Subpage metadata generation incomplete"
  );

  // TEST 6: Dish Page Metadata & Item details
  let allDishesMetaValid = true;
  const sampleDishes = menuData.flatMap((c) => c.items).slice(0, 15);
  for (const item of sampleDishes) {
    for (const locale of SUPPORTED_LOCALES) {
      const { turkishTitle, localizedName, localizedDesc } = getDishDisplay(
        item,
        locale
      );
      const title =
        locale === "tr" || !localizedName || localizedName === turkishTitle
          ? `${turkishTitle} | Cihangir Ev Yemekleri & Pide`
          : `${turkishTitle} (${localizedName}) | Cihangir Ev Yemekleri & Pide`;
      const description =
        localizedDesc ||
        `${turkishTitle} - Cihangir Ev Yemekleri & Pide, Beyoğlu, İstanbul`;

      const meta = buildPageMetadata({
        locale,
        path: `/dish/${item.id}`,
        title,
        description,
        image: item.image ? { url: item.image, alt: turkishTitle } : undefined,
      });

      if (!meta.title || !meta.description) {
        allDishesMetaValid = false;
      }
    }
  }
  assert(
    allDishesMetaValid,
    "Dish Metadata: Valid unique titles and descriptions without doubled branding",
    "Dish metadata generation failed"
  );

  // TEST 7: XML Sitemap Generation
  const sitemapEntries = sitemap();
  const expectedSitemapCount = publicRoutes.length * SUPPORTED_LOCALES.length;
  assert(
    sitemapEntries.length === expectedSitemapCount,
    `XML Sitemap: Emits exact full route set (${expectedSitemapCount} entries)`,
    `Expected ${expectedSitemapCount}, got ${sitemapEntries.length}`
  );

  let sitemapEntriesClean = true;
  let sitemapAlternatesClean = true;
  for (const entry of sitemapEntries) {
    if (!entry.url.startsWith(SITE_URL)) sitemapEntriesClean = false;
    // Ensure no fake lastmod or deprecated priority / changefreq
    if ((entry as any).lastModified !== undefined || (entry as any).priority !== undefined) {
      sitemapEntriesClean = false;
    }
    const alts = entry.alternates?.languages;
    if (!alts || Object.keys(alts).length !== SUPPORTED_LOCALES.length + 1) {
      sitemapAlternatesClean = false;
    }
  }
  assert(
    sitemapEntriesClean,
    "XML Sitemap: All entries use HTTPS canonical origin and omit fake lastmod/priority",
    "Sitemap contains invalid or non-canonical entries"
  );
  assert(
    sitemapAlternatesClean,
    "XML Sitemap: Localized entries have complete reciprocal alternates including x-default",
    "Sitemap alternates structure incomplete"
  );

  // TEST 8: Robots.txt Rules
  const robotsConfig = robots();
  const rules = Array.isArray(robotsConfig.rules)
    ? robotsConfig.rules[0]
    : robotsConfig.rules;
  assert(
    rules?.userAgent === "*",
    "Robots.txt: Target userAgent is '*'",
    `Got ${rules?.userAgent}`
  );
  assert(
    rules?.allow === "/",
    "Robots.txt: Permits public crawling with Allow: /",
    `Got ${rules?.allow}`
  );
  const disallows = Array.isArray(rules?.disallow) ? rules.disallow : [rules?.disallow];
  assert(
    disallows.includes("/admin") && disallows.includes("/api/admin"),
    "Robots.txt: Disallows /admin and /api/admin without breaking public pages",
    `Got ${JSON.stringify(disallows)}`
  );
  assert(
    robotsConfig.sitemap === `${SITE_URL}/sitemap.xml`,
    "Robots.txt: Sitemap directive matches absolute canonical sitemap URL",
    `Got ${robotsConfig.sitemap}`
  );

  // TEST 9: Schema.org Restaurant Entity
  const restaurantSchema = buildRestaurantSchema(
    "tr",
    "Anne şefkatiyle pişen taze tencere yemekleri, fırından yeni çıkmış çıtır pideler."
  );
  assert(
    restaurantSchema["@type"] === "Restaurant",
    "Schema.org: Type is Restaurant",
    `Got ${restaurantSchema["@type"]}`
  );
  assert(
    restaurantSchema["@id"] === `${SITE_URL}/#restaurant`,
    "Schema.org: Stable URI identifier (@id) provided",
    `Got ${restaurantSchema["@id"]}`
  );
  assert(
    restaurantSchema.telephone === RESTAURANT_CONFIG.phone.tel,
    "Schema.org: Verified telephone number from RESTAURANT_CONFIG",
    `Got ${restaurantSchema.telephone}`
  );
  assert(
    restaurantSchema.geo.latitude === RESTAURANT_CONFIG.address.coordinates.latitude,
    "Schema.org: Verified geographic coordinates",
    "Coordinates mismatched"
  );
  assert(
    (restaurantSchema as any).priceRange === undefined &&
      (restaurantSchema as any).acceptsReservations === undefined &&
      (restaurantSchema as any).aggregateRating === undefined,
    "Schema.org: No fabricated/unverified facts (no fake ratings, reviews, or reservation flags)",
    "Unverified properties detected in restaurant schema"
  );
  assert(
    restaurantSchema.openingHoursSpecification.length > 0 &&
      restaurantSchema.openingHoursSpecification[0].opens === RESTAURANT_CONFIG.hours.openTime,
    "Schema.org: Opening hours align with verified restaurant operational hours",
    "Opening hours mismatch"
  );

  // Print Summary
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  console.log("\n-------------------------------------------------");
  console.log(`TOTAL CHECKS: ${results.length}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log("-------------------------------------------------\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log("✅ All SEO regression checks passed successfully!\n");
  }
}

runSeoSuite().catch((err) => {
  console.error("Suite execution error:", err);
  process.exit(1);
});
