import * as fs from "fs";
import * as path from "path";

interface ProductItem {
  slug: string;
  name: string;
  category?: string;
  ingredients: string[];
  serving?: string;
}

const products: ProductItem[] = JSON.parse(fs.readFileSync("data/products.json", "utf8"));
const outputDir = "public/images/products";
const existingImages = new Set(
  fs.readdirSync(outputDir).map((f) => f.replace(/\.[^.]+$/, ""))
);

const missing = products.filter((p) => !existingImages.has(p.slug));

function buildPrompt(product: ProductItem): string {
  const ingredientsStr = product.ingredients.join(", ");
  const servingNote = product.serving ? ` Plating details: ${product.serving}.` : "";

  return [
    `Editorial culinary food photography of authentic Turkish dish "${product.name}".`,
    `Verified Ingredients: The dish is strictly composed of: ${ingredientsStr}.${servingNote}`,
    `CRITICAL INGREDIENT FIDELITY RULE: Do NOT invent, hallucinate, or add any unverified side dishes, accompaniments, garnishes, or starches. Absolutely NO rice, NO french fries, NO bread, NO pickles, NO extra side salads, NO sauces unless explicitly listed in verified ingredients. Present exclusively the stated dish centered on the plate.`,
    `Visual Style & Atmosphere: Warm beige textured ceramic tabletop background, soft warm cinematic studio lighting with gentle soft shadows, 45-degree angle food portrait, razor-sharp focus on realistic food textures and authentic simmering glazes, square 1:1 composition, premium gourmet Turkish restaurant aesthetic.`
  ].join(" ");
}

const exportData = missing.map((p) => ({
  slug: p.slug,
  name: p.name,
  category: p.category,
  targetFilename: `${p.slug}.jpg`,
  targetPath: `public/images/products/${p.slug}.jpg`,
  prompt: buildPrompt(p)
}));

fs.writeFileSync("data/missing-images-prompts.json", JSON.stringify(exportData, null, 2), "utf8");
console.log(`Exported ${exportData.length} missing dishes to data/missing-images-prompts.json`);
