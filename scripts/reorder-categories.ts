import "dotenv/config";
import { prisma } from "../src/lib/db/prisma";

const NEW_ORDER: Record<string, { orderIndex: number; trName: string }> = {
  "ana-yemekler": { orderIndex: 1, trName: "Ana Yemekler" },
  "pideler": { orderIndex: 2, trName: "Taş Fırın Pide" },
  "corbalar": { orderIndex: 3, trName: "Çorbalar" },
  "az-menu": { orderIndex: 4, trName: "Az Menü (Yarım Porsiyon)" },
  "yan-urunler": { orderIndex: 5, trName: "Yan Ürünler" },
  "salatalar": { orderIndex: 6, trName: "Salatalar" },
  "tatlilar": { orderIndex: 7, trName: "Tatlı Çeşitleri" },
  "icecekler": { orderIndex: 8, trName: "Sıcak Soğuk İçecekler" },
};

async function main() {
  for (const [slug, data] of Object.entries(NEW_ORDER)) {
    const cat = await prisma.category.findUnique({ where: { slug } });
    if (!cat) {
      console.warn(`Category not found: ${slug}`);
      continue;
    }

    await prisma.category.update({
      where: { id: cat.id },
      data: {
        orderIndex: data.orderIndex,
      },
    });

    await prisma.categoryTranslation.upsert({
      where: {
        categoryId_locale: {
          categoryId: cat.id,
          locale: "tr",
        },
      },
      update: { name: data.trName },
      create: {
        categoryId: cat.id,
        locale: "tr",
        name: data.trName,
      },
    });

    console.log(`Updated ${slug} -> orderIndex: ${data.orderIndex}, name: ${data.trName}`);
  }

  const updated = await prisma.category.findMany({
    orderBy: { orderIndex: "asc" },
    include: { translations: { where: { locale: "tr" } } },
  });

  console.log("\nFINAL ORDER IN DB:");
  updated.forEach((c) => {
    console.log(`${c.orderIndex}. ${c.translations[0]?.name} (${c.slug})`);
  });

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
