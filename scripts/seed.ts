import "dotenv/config";
import { prisma } from "../src/lib/db/prisma";

async function seed() {
  console.log("Seeding initial categories and sample products...");

  // 1. Categories
  const evYemekleriCat = await prisma.category.upsert({
    where: { slug: "ev-yemekleri" },
    update: {},
    create: {
      slug: "ev-yemekleri",
      orderIndex: 1,
      translations: {
        create: [
          { locale: "tr", name: "Ev Yemekleri", description: "Geleneksel tencere yemekleri" },
          { locale: "en", name: "Home Cooked Dishes", description: "Traditional pot dishes" },
          { locale: "ar", name: "وجبات منزلية", description: "أطباق مطبوخة تقليدية" },
        ],
      },
    },
  });

  const pideCat = await prisma.category.upsert({
    where: { slug: "tas-firin-pide" },
    update: {},
    create: {
      slug: "tas-firin-pide",
      orderIndex: 2,
      translations: {
        create: [
          { locale: "tr", name: "Taş Fırın Pide", description: "Çıtır odun ateşi pideleri" },
          { locale: "en", name: "Stone Oven Pide", description: "Crispy oven baked Turkish pies" },
          { locale: "ar", name: "فطائر حجرية (بيدة)", description: "بيدة تركية طازجة من الفرن" },
        ],
      },
    },
  });

  // 2. Products with canonical TRY price
  await prisma.product.upsert({
    where: { slug: "kuru-fasulye" },
    update: {},
    create: {
      slug: "kuru-fasulye",
      categoryId: evYemekleriCat.id,
      basePriceTRY: 180.0,
      orderIndex: 1,
      translations: {
        create: [
          { locale: "tr", name: "İspir Kuru Fasulye", description: "Özel tereyağlı geleneksel İspir kuru fasulyesi" },
          { locale: "en", name: "Traditional White Bean Stew", description: "Slow-cooked white beans with rich butter" },
          { locale: "ar", name: "فاصولياء بيضاء مطبوخة", description: "فاصولياء إسبير التقليدية بالزبدة البلدية" },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "kiymali-kasarli-pide" },
    update: {},
    create: {
      slug: "kiymali-kasarli-pide",
      categoryId: pideCat.id,
      basePriceTRY: 290.0,
      orderIndex: 2,
      translations: {
        create: [
          { locale: "tr", name: "Kıymalı Kaşarlı Pide", description: "Taş fırında taze çekilmiş dana kıyma ve erimiş kaşar peyniri" },
          { locale: "en", name: "Minced Meat & Kashar Pide", description: "Stone-oven baked pide with minced beef and melted cheese" },
          { locale: "ar", name: "بيدة لحم مفروم وجبنة قشقوان", description: "فطيرة مخبوزة على الحجر بلحم العجل والجبن الذائب" },
        ],
      },
    },
  });

  console.log("Seeding complete!");
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error("Seeding error:", e);
  process.exit(1);
});
