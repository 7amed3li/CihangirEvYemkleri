import { prisma } from "./prisma";
import { menuData as staticMenuData, MenuCategory, MenuItem } from "@/data/menuData";
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
        const catTr = cat.translations.find((t) => t.locale === "tr")?.name || cat.slug;
        const catEn = cat.translations.find((t) => t.locale === "en")?.name || catTr;
        const catAr = cat.translations.find((t) => t.locale === "ar")?.name || catTr;

        const items: MenuItem[] = cat.products.map((prod) => {
          const staticMatch = staticDishMap.get(prod.slug);

          const nameTr = prod.translations.find((t) => t.locale === "tr")?.name || prod.slug;
          const nameEn =
            prod.translations.find((t) => t.locale === "en")?.name ||
            staticMatch?.name?.en ||
            nameTr;
          const nameAr =
            prod.translations.find((t) => t.locale === "ar")?.name ||
            staticMatch?.name?.ar ||
            nameTr;

          const descTr =
            prod.translations.find((t) => t.locale === "tr")?.description ||
            staticMatch?.description;

          // Merge tags
          const tags = new Set<string>(staticMatch?.tags || []);
          if (prod.isFeatured) tags.add("signature");

          return {
            id: prod.slug,
            name: {
              tr: nameTr,
              en: nameEn,
              ar: nameAr,
              ru: prod.translations.find((t: any) => t.locale === "ru")?.name || staticMatch?.name?.ru,
              fa: prod.translations.find((t: any) => t.locale === "fa")?.name || staticMatch?.name?.fa,
              fr: prod.translations.find((t: any) => t.locale === "fr")?.name || staticMatch?.name?.fr,
              de: prod.translations.find((t: any) => t.locale === "de")?.name || staticMatch?.name?.de,
              it: prod.translations.find((t: any) => t.locale === "it")?.name || staticMatch?.name?.it,
              es: prod.translations.find((t: any) => t.locale === "es")?.name || staticMatch?.name?.es,
              zh: prod.translations.find((t: any) => t.locale === "zh")?.name || staticMatch?.name?.zh,
            },
            price: Number(prod.basePriceTRY),
            image: prod.imageUrl || staticMatch?.image || undefined,
            description: descTr || staticMatch?.description,
            descriptions: staticMatch?.descriptions,
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
      const prodTrans =
        e.product.translations.find((t) => t.locale === locale)?.name ||
        e.product.translations.find((t) => t.locale === "tr")?.name ||
        e.product.slug;

      const catTrans =
        e.product.category.translations.find((t) => t.locale === locale)?.name ||
        e.product.category.translations.find((t) => t.locale === "tr")?.name ||
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
