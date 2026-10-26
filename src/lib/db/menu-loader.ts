import { prisma } from "./prisma";
import { menuData as staticMenuData, MenuCategory, MenuItem } from "@/data/menuData";
import { DISH_TRANSLATIONS, CATEGORY_TRANSLATIONS } from "@/data/dishTranslations";
import { getIstanbulDateString } from "@/lib/date";

export interface PublicDailyMenuEntry {
  id: string;
  productId: string;
  slug: string;
  name: string;
  categoryName: string;
  priceTRY: number;
  imageUrl?: string | null;
  displayOrder: number;
}

export interface PublicDailyMenu {
  id: string;
  dateString: string;
  notes: string | null;
  entries: PublicDailyMenuEntry[];
}

export interface PublicOfferItem {
  productId: string;
  productName: string;
  quantity: number;
  priceTRY: number;
}

export interface PublicOffer {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sellingPriceTRY: number;
  imageUrl?: string | null;
  items: PublicOfferItem[];
}

// Map for quick static lookup of tags & en/ar translations when not in DB
const staticDishMap = new Map<string, MenuItem>();
staticMenuData.forEach((c) => {
  c.items.forEach((item) => {
    staticDishMap.set(item.id, item);
  });
});

/**
 * Loads categories and active products directly from PostgreSQL.
 * Falls back to static menuData if DB is empty or disconnected.
 */
export async function getDatabaseMenu(): Promise<{
  categories: MenuCategory[];
  isFromDb: boolean;
}> {
  try {
    const dbCategories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { orderIndex: "asc" },
      include: {
        translations: true,
        products: {
          where: { isActive: true },
          orderBy: { orderIndex: "asc" },
          include: {
            translations: true,
          },
        },
      },
    });

    // If database has no categories or products yet, use static fallback
    if (!dbCategories || dbCategories.length === 0) {
      return { categories: staticMenuData, isFromDb: false };
    }

    const categories: MenuCategory[] = dbCategories
      .filter((c) => c.products.length > 0) // Hide empty categories on public menu
      .map((cat) => {
        const catTrans = CATEGORY_TRANSLATIONS[cat.slug];
        const catTr = cat.translations.find((t) => t.locale === "tr")?.name || catTrans?.tr || cat.slug;
        const catEn = cat.translations.find((t) => t.locale === "en")?.name || catTrans?.en || catTr;
        const catAr = cat.translations.find((t) => t.locale === "ar")?.name || catTrans?.ar || catTr;

        const items: MenuItem[] = cat.products.map((prod) => {
          const staticMatch = staticDishMap.get(prod.slug);
          const dishTrans =
            DISH_TRANSLATIONS[prod.slug] ||
            (staticMatch ? DISH_TRANSLATIONS[staticMatch.id] : undefined) ||
            (prod.slug === "tavuklu-pide" ? DISH_TRANSLATIONS["tavuklu"] : undefined);

          const nameTr = prod.translations.find((t) => t.locale === "tr")?.name || dishTrans?.name?.tr || staticMatch?.name?.tr || prod.slug;
          const nameEn = prod.translations.find((t) => t.locale === "en")?.name || dishTrans?.name?.en || staticMatch?.name?.en || nameTr;
          const nameAr = prod.translations.find((t) => t.locale === "ar")?.name || dishTrans?.name?.ar || staticMatch?.name?.ar || nameTr;
          const nameRu = prod.translations.find((t: any) => t.locale === "ru")?.name || dishTrans?.name?.ru || staticMatch?.name?.ru || nameTr;
          const nameFa = prod.translations.find((t: any) => t.locale === "fa")?.name || dishTrans?.name?.fa || staticMatch?.name?.fa || nameTr;
          const nameFr = prod.translations.find((t: any) => t.locale === "fr")?.name || dishTrans?.name?.fr || staticMatch?.name?.fr || nameTr;
          const nameDe = prod.translations.find((t: any) => t.locale === "de")?.name || dishTrans?.name?.de || staticMatch?.name?.de || nameTr;
          const nameIt = prod.translations.find((t: any) => t.locale === "it")?.name || dishTrans?.name?.it || staticMatch?.name?.it || nameTr;
          const nameEs = prod.translations.find((t: any) => t.locale === "es")?.name || dishTrans?.name?.es || staticMatch?.name?.es || nameTr;
          const nameZh = prod.translations.find((t: any) => t.locale === "zh")?.name || dishTrans?.name?.zh || staticMatch?.name?.zh || nameTr;

          const descTr = prod.translations.find((t) => t.locale === "tr")?.description || dishTrans?.desc?.tr || staticMatch?.description || "";

          // Merge tags
          const tags = new Set<string>(staticMatch?.tags || []);
          if (prod.isFeatured) tags.add("signature");

          return {
            id: prod.slug,
            name: {
              tr: nameTr,
              en: nameEn,
              ar: nameAr,
              ru: nameRu,
              fa: nameFa,
              fr: nameFr,
              de: nameDe,
              it: nameIt,
              es: nameEs,
              zh: nameZh,
            },
            price: Number(prod.basePriceTRY),
            image: prod.imageUrl || staticMatch?.image || undefined,
            description: descTr,
            descriptions: dishTrans?.desc || staticMatch?.descriptions,
            tags: Array.from(tags),
            trending: prod.isFeatured || staticMatch?.trending || false,
            isAvailable: prod.isAvailable,
          };
        });

        return {
          id: cat.slug,
          slug: cat.slug,
          category: {
            tr: catTr,
            en: catEn,
            ar: catAr,
            ru: catTrans?.ru,
            fa: catTrans?.fa,
            fr: catTrans?.fr,
            de: catTrans?.de,
            it: catTrans?.it,
            es: catTrans?.es,
            zh: catTrans?.zh,
          },
          items,
        };
      });

    return { categories, isFromDb: true };
  } catch (err) {
    console.error("[getDatabaseMenu Error] Falling back to static menuData:", err);
    return { categories: staticMenuData, isFromDb: false };
  }
}

/**
 * Loads published Daily Menu for today's Europe/Istanbul business date.
 */
export async function getPublishedDailyMenu(locale: string = "tr"): Promise<PublicDailyMenu | null> {
  try {
    const today = getIstanbulDateString();

    const menu = await prisma.dailyMenu.findUnique({
      where: { dateString: today },
      include: {
        entries: {
          orderBy: { displayOrder: "asc" },
          include: {
            product: {
              include: {
                translations: true,
                category: {
                  include: { translations: true },
                },
              },
            },
          },
        },
      },
    });

    if (!menu || !menu.isPublished) {
      return null;
    }

    // Filter only active & available products according to business rules
    const eligibleEntries = menu.entries.filter(
      (e) => e.product.isActive && e.product.isAvailable
    );

    if (eligibleEntries.length === 0) {
      return null;
    }

    const entries: PublicDailyMenuEntry[] = eligibleEntries.map((e) => {
      const dishTrans = DISH_TRANSLATIONS[e.product.slug];
      const catTransDef = CATEGORY_TRANSLATIONS[e.product.category.slug];
      const prodTrans =
        e.product.translations.find((t) => t.locale === locale)?.name ||
        (dishTrans?.name as any)?.[locale] ||
        e.product.translations.find((t) => t.locale === "tr")?.name ||
        dishTrans?.name?.tr ||
        e.product.slug;

      const catTrans =
        e.product.category.translations.find((t) => t.locale === locale)?.name ||
        (catTransDef as any)?.[locale] ||
        e.product.category.translations.find((t) => t.locale === "tr")?.name ||
        catTransDef?.tr ||
        e.product.category.slug;

      return {
        id: e.id,
        productId: e.productId,
        slug: e.product.slug,
        name: prodTrans,
        categoryName: catTrans,
        priceTRY: Number(e.product.basePriceTRY),
        imageUrl: e.product.imageUrl,
        displayOrder: e.displayOrder,
      };
    });

    return {
      id: menu.id,
      dateString: menu.dateString,
      notes: menu.notes,
      entries,
    };
  } catch (err) {
    console.error("[getPublishedDailyMenu Error]:", err);
    return null;
  }
}

/**
 * Loads active Combo Offers respecting validity dates.
 */
export async function getActivePublicOffers(locale: string = "tr"): Promise<PublicOffer[]> {
  try {
    const now = new Date();

    const offers = await prisma.offer.findMany({
      where: {
        isActive: true,
        OR: [{ validFrom: null }, { validFrom: { lte: now } }],
        AND: [{ OR: [{ validUntil: null }, { validUntil: { gte: now } }] }],
      },
      include: {
        translations: true,
        items: {
          include: {
            product: {
              include: { translations: true },
            },
          },
        },
      },
      orderBy: { orderIndex: "asc" },
    });

    return offers.map((o) => {
      const trans =
        o.translations.find((t) => t.locale === locale) ||
        o.translations.find((t) => t.locale === "tr");

      return {
        id: o.id,
        slug: o.slug,
        title: trans?.title || o.slug,
        description: trans?.description || null,
        sellingPriceTRY: Number(o.sellingPrice),
        imageUrl: o.imageUrl,
        items: o.items.map((it) => {
          const pName =
            it.product.translations.find((t) => t.locale === locale)?.name ||
            it.product.translations.find((t) => t.locale === "tr")?.name ||
            it.product.slug;

          return {
            productId: it.productId,
            productName: pName,
            quantity: it.quantity,
            priceTRY: Number(it.product.basePriceTRY),
          };
        }),
      };
    });
  } catch (err) {
    console.error("[getActivePublicOffers Error]:", err);
    return [];
  }
}
