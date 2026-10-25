import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import { prisma } from "../src/lib/db/prisma";

async function syncImages() {
  const imagesDir = path.join(process.cwd(), "public/images/products");
  if (!fs.existsSync(imagesDir)) {
    console.log("No products images directory found.");
    return;
  }

  const files = fs.readdirSync(imagesDir);
  const imageMap = new Map<string, string>();
  for (const f of files) {
    const slug = f.replace(/\.[^.]+$/, "");
    imageMap.set(slug, `/images/products/${f}`);
  }

  console.log(`Found ${imageMap.size} image files.`);

  const products = await prisma.product.findMany();
  let updatedCount = 0;

  for (const prod of products) {
    if (imageMap.has(prod.slug)) {
      const imgUrl = imageMap.get(prod.slug)!;
      if (prod.imageUrl !== imgUrl) {
        await prisma.product.update({
          where: { id: prod.id },
          data: { imageUrl: imgUrl },
        });
        updatedCount++;
      }
    }
  }

  console.log(`Updated ${updatedCount} products with image URLs in the database.`);
  await prisma.$disconnect();
}

syncImages().catch((err) => {
  console.error("Error syncing images:", err);
  process.exit(1);
});
