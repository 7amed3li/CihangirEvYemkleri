import { prisma } from "@/lib/db/prisma";
import { menuData } from "@/data/menuData";
import { DISH_TRANSLATIONS } from "@/data/dishTranslations";

const LOCALES = ["tr", "en", "ar", "ru", "fa", "fr", "de", "it", "es", "zh"] as const;

export async function seedDatabaseMenu(force = false): Promise<{ count: number }> {
  try {
    const existingCount = await prisma.product.count();
    if (existingCount > 0 && !force) {
      return { count: existingCount };
    }

    let totalProducts = 0;

    for (let catIdx = 0; catIdx < menuData.length; catIdx++) {
      const cat = menuData[catIdx];
      const catSlug = cat.slug || cat.id;

      // Upsert Category
      const dbCat = await prisma.category.upsert({
        where: { slug: catSlug },
        update: {
          orderIndex: catIdx + 1,
          isActive: true,
        },
        create: {
          slug: catSlug,
          orderIndex: catIdx + 1,
          isActive: true,
        },
      });

      // Category Translations
      for (const locale of LOCALES) {
        const name = (cat.category as any)[locale] || cat.category.tr;
        if (name) {
          await prisma.categoryTranslation.upsert({
            where: {
              categoryId_locale: {
                categoryId: dbCat.id,
                locale,
              },
            },
            update: { name },
            create: {
              categoryId: dbCat.id,
              locale,
              name,
            },
          });
        }
      }

      // Upsert Products
      for (let prodIdx = 0; prodIdx < cat.items.length; prodIdx++) {
        const item = cat.items[prodIdx];
        const isFeatured = item.tags?.includes("signature") || Boolean(item.trending);

        const dbProduct = await prisma.product.upsert({
          where: { slug: item.id },
          update: {
            categoryId: dbCat.id,
            basePriceTRY: item.price,
            imageUrl: item.image || null,
            isAvailable: item.isAvailable !== false,
            isActive: true,
            isFeatured,
            orderIndex: prodIdx + 1,
          },
          create: {
            slug: item.id,
            categoryId: dbCat.id,
            basePriceTRY: item.price,
            imageUrl: item.image || null,
            isAvailable: item.isAvailable !== false,
            isActive: true,
            isFeatured,
            orderIndex: prodIdx + 1,
          },
        });

        // Product Translations
        const dishTrans = DISH_TRANSLATIONS[item.id];
        for (const locale of LOCALES) {
          const transName =
            dishTrans?.name?.[locale] ||
            (item.name as any)?.[locale] ||
            item.name?.tr ||
            item.id;

          const transDesc =
            dishTrans?.desc?.[locale] ||
            (item.descriptions as any)?.[locale] ||
            (locale === "tr" ? item.description : null);

          await prisma.productTranslation.upsert({
            where: {
              productId_locale: {
                productId: dbProduct.id,
                locale,
              },
            },
            update: {
              name: transName,
              description: transDesc || null,
            },
            create: {
              productId: dbProduct.id,
              locale,
              name: transName,
              description: transDesc || null,
            },
          });
        }

        totalProducts++;
      }
    }

    return { count: totalProducts };
  } catch (error) {
    console.error("[seedDatabaseMenu Error]:", error);
    throw error;
  }
}
