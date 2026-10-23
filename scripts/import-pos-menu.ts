import "dotenv/config";
import { prisma } from "../src/lib/db/prisma";

const POS_DATA = {
  categories: [
    {
      slug: "ana-yemekler",
      name: "Ana Yemekler",
      products: [
        { slug: "asci-tabagi", name: "Aşçı tabağı", priceTRY: 650 },
        { slug: "baget-firin", name: "Baget fırın", priceTRY: 320 },
        { slug: "biber-dolmasi", name: "Biber dolması", priceTRY: 370 },
        { slug: "ciftlik-kebabi", name: "Çiftlik kebabı", priceTRY: 300 },
        { slug: "eksili-kofte", name: "Ekşili köfte", priceTRY: 320 },
        { slug: "elbasan", name: "Elbasan", priceTRY: 370 },
        { slug: "et-sote", name: "Et sote", priceTRY: 550 },
        { slug: "etli-nohut", name: "Etli nohut", priceTRY: 390 },
        { slug: "firinda-tavuk", name: "Fırında tavuk", priceTRY: 320 },
        { slug: "gunun-menu", name: "Günün menü", priceTRY: 420 },
        { slug: "gunun-menu-2", name: "Günün menü 2", priceTRY: 400 },
        { slug: "guvec", name: "Güveç", priceTRY: 400 },
        { slug: "ispanak", name: "Ispanak", priceTRY: 200 },
        { slug: "izmir-kofte", name: "İzmir köfte", priceTRY: 400 },
        { slug: "kara-lahana-dolmasi", name: "Kara lahana dolması", priceTRY: 370 },
        { slug: "karniyarik", name: "Karnıyarık", priceTRY: 350 },
        { slug: "kavurma", name: "Kavurma", priceTRY: 450 },
        { slug: "kayseri-mantisi", name: "Kayseri mantısı", priceTRY: 350 },
        { slug: "kori-mantarli-tavuk", name: "Köri mantarlı tavuk", priceTRY: 280 },
        { slug: "krema-kori-tavuk", name: "Krema köri tavuk", priceTRY: 280 },
        { slug: "kuru-fasulye", name: "Kuru fasulye", priceTRY: 220 },
        { slug: "kuzu-incik", name: "Kuzu incik", priceTRY: 400 },
        { slug: "mantar-tavuk-sote", name: "Mantar tavuk sote", priceTRY: 320 },
        { slug: "mix-tabak-2", name: "Mix tabak 2", priceTRY: 400 },
        { slug: "musakka", name: "Musakka", priceTRY: 370 },
        { slug: "pirasa", name: "Pırasa", priceTRY: 260 },
        { slug: "sebzeli-kofte", name: "Sebzeli köfte", priceTRY: 400 },
        { slug: "tas-kebabi-500", name: "Taş kebabı (Büyük)", priceTRY: 500 },
        { slug: "tas-kebabi-350", name: "Taş kebabı", priceTRY: 350 },
        { slug: "tavuk-haslama", name: "Tavuk haşlama", priceTRY: 290 },
        { slug: "tavuk-sote", name: "Tavuk sote", priceTRY: 250 },
        { slug: "taze-fasulye", name: "Taze fasulye", priceTRY: 270 },
        { slug: "turlu", name: "Türlü", priceTRY: 270 },
      ],
    },
    {
      slug: "corbalar",
      name: "Çorbalar",
      products: [
        { slug: "ezogelin", name: "Ezogelin çorbası", priceTRY: 120 },
        { slug: "mercimek", name: "Mercimek çorbası", priceTRY: 120 },
        { slug: "sebze-corbasi", name: "Sebze çorbası", priceTRY: 110 },
        { slug: "tavuk-suyu", name: "Tavuk suyu çorbası", priceTRY: 160 },
        { slug: "yayla-corbasi", name: "Yayla çorbası", priceTRY: 140 },
      ],
    },
    {
      slug: "salatalar",
      name: "Salatalar",
      products: [
        { slug: "cacik", name: "Cacık", priceTRY: 80 },
        { slug: "coban-salata", name: "Çoban salata", priceTRY: 150 },
        { slug: "havuc-tarator", name: "Havuç tarator", priceTRY: 100 },
        { slug: "mevsim-salatasi", name: "Mevsim salatası", priceTRY: 150 },
        { slug: "semizotu", name: "Semizotu salatası", priceTRY: 100 },
      ],
    },
    {
      slug: "yan-urunler",
      name: "Yan Ürünler & Pilavlar",
      products: [
        { slug: "bulgur", name: "Bulgur pilavı", priceTRY: 140 },
        { slug: "makarna", name: "Makarna", priceTRY: 140 },
        { slug: "pilavustu-kuru", name: "Pilavüstü kuru fasulye", priceTRY: 190 },
        { slug: "pirinc-pilavi", name: "Pirinç pilavı", priceTRY: 100 },
        { slug: "yogurt", name: "Yoğurt", priceTRY: 50 },
      ],
    },
    {
      slug: "pideler",
      name: "Taş Fırın Pideler",
      products: [
        { slug: "karisik-pide", name: "Karışık pide", priceTRY: 350 },
        { slug: "kasarli-pide", name: "Kaşarlı pide", priceTRY: 300 },
        { slug: "kavurmali-kasarli", name: "Kavurmalı kaşarlı pide", priceTRY: 650 },
        { slug: "kavurmali-pide", name: "Kavurmalı pide", priceTRY: 600 },
        { slug: "kiymali-kasarli", name: "Kıymalı kaşarlı pide", priceTRY: 500 },
        { slug: "kiymali-pide", name: "Kıymalı pide", priceTRY: 480 },
        { slug: "koy-peynirli-pide", name: "Köy peynirli pide", priceTRY: 380 },
        { slug: "kusbasili-kasarli", name: "Kuşbaşılı kaşarlı pide", priceTRY: 500 },
        { slug: "kusbasili-pide", name: "Kuşbaşılı pide", priceTRY: 480 },
        { slug: "pastirmali-kasarli", name: "Pastırmalı kaşarlı pide", priceTRY: 450 },
        { slug: "pastirmali-pide", name: "Pastırmalı pide", priceTRY: 400 },
        { slug: "sosisli-pide", name: "Sosisli pide", priceTRY: 350 },
        { slug: "sucuklu-kasarli", name: "Sucuklu kaşarlı pide", priceTRY: 450 },
        { slug: "sucuklu-pide", name: "Sucuklu pide", priceTRY: 400 },
        { slug: "tavuklu-pide", name: "Tavuklu pide", priceTRY: 380 },
        { slug: "trabzon-peynirli", name: "Trabzon peynirli pide", priceTRY: 500 },
      ],
    },
    {
      slug: "tatlilar",
      name: "Tatlı Çeşitleri",
      products: [
        { slug: "firinda-sutlac", name: "Fırında sütlaç", priceTRY: 200 },
        { slug: "kadayif", name: "Kadayıf", priceTRY: 150 },
        { slug: "kibris-tatlisi", name: "Kıbrıs tatlısı", priceTRY: 200 },
        { slug: "sekerpare", name: "Şekerpare", priceTRY: 200 },
        { slug: "tatli", name: "Günün tatlısı", priceTRY: 180 },
      ],
    },
    {
      slug: "icecekler",
      name: "Sıcak & Soğuk İçecekler",
      products: [
        { slug: "ayran", name: "Ayran", priceTRY: 70 },
        { slug: "bitki-caylari", name: "Bitki çayları", priceTRY: 100 },
        { slug: "cola", name: "Coca-Cola", priceTRY: 70 },
        { slug: "cay", name: "Demleme Çay", priceTRY: 50 },
        { slug: "fanta", name: "Fanta", priceTRY: 70 },
        { slug: "meyve-sulari", name: "Meyve suları", priceTRY: 70 },
        { slug: "nescafe", name: "Nescafe", priceTRY: 100 },
        { slug: "soda", name: "Maden suyu / Soda", priceTRY: 50 },
        { slug: "su", name: "Su", priceTRY: 30 },
        { slug: "turk-kahvesi", name: "Türk kahvesi", priceTRY: 70 },
      ],
    },
    {
      slug: "az-menu",
      name: "Az Menü (Yarım Porsiyon)",
      products: [
        { slug: "az-corba", name: "Az çorba", priceTRY: 70 },
        { slug: "az-dolma", name: "Az dolma", priceTRY: 200 },
        { slug: "az-et-yemegi", name: "Az et yemeği", priceTRY: 270 },
        { slug: "az-kofte", name: "Az köfte", priceTRY: 250 },
        { slug: "az-kuru", name: "Az kuru fasulye", priceTRY: 100 },
        { slug: "az-pilav", name: "Az pilav", priceTRY: 70 },
        { slug: "az-sebze-yemegi", name: "Az sebze yemeği", priceTRY: 170 },
        { slug: "az-sehriye", name: "Az şehriye", priceTRY: 60 },
        { slug: "az-tavuk", name: "Az tavuk", priceTRY: 200 },
      ],
    },
  ],
};

async function seedPOSData() {
  console.log("Seeding verified POS Menu Data for Cihangir Ev Yemekleri...");

  let categoryIndex = 1;
  let totalProducts = 0;

  for (const cat of POS_DATA.categories) {
    const categoryRecord = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        orderIndex: categoryIndex,
        isActive: true,
      },
      create: {
        slug: cat.slug,
        orderIndex: categoryIndex,
        isActive: true,
        translations: {
          create: [{ locale: "tr", name: cat.name }],
        },
      },
    });

    // Make sure Turkish translation exists
    await prisma.categoryTranslation.upsert({
      where: {
        categoryId_locale: {
          categoryId: categoryRecord.id,
          locale: "tr",
        },
      },
      update: { name: cat.name },
      create: {
        categoryId: categoryRecord.id,
        locale: "tr",
        name: cat.name,
      },
    });

    let prodIndex = 1;
    for (const prod of cat.products) {
      const productRecord = await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {
          categoryId: categoryRecord.id,
          basePriceTRY: prod.priceTRY,
          orderIndex: prodIndex,
          isActive: true,
          isAvailable: true,
        },
        create: {
          slug: prod.slug,
          categoryId: categoryRecord.id,
          basePriceTRY: prod.priceTRY,
          orderIndex: prodIndex,
          isActive: true,
          isAvailable: true,
          translations: {
            create: [{ locale: "tr", name: prod.name }],
          },
        },
      });

      await prisma.productTranslation.upsert({
        where: {
          productId_locale: {
            productId: productRecord.id,
            locale: "tr",
          },
        },
        update: { name: prod.name },
        create: {
          productId: productRecord.id,
          locale: "tr",
          name: prod.name,
        },
      });

      prodIndex++;
      totalProducts++;
    }

    categoryIndex++;
  }

  console.log(`Successfully seeded ${categoryIndex - 1} categories and ${totalProducts} products!`);
  await prisma.$disconnect();
}

seedPOSData().catch((err) => {
  console.error("Error seeding POS data:", err);
  process.exit(1);
});
