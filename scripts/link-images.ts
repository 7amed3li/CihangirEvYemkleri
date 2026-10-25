import * as fs from "fs";
import * as path from "path";

const menuPath = "src/data/menuData.ts";
let content = fs.readFileSync(menuPath, "utf8");

const imageFiles = fs.readdirSync("public/images/products");
const imageMap = new Map<string, string>();
imageFiles.forEach((f) => {
  const slug = f.replace(/\.[^.]+$/, "");
  imageMap.set(slug, `/images/products/${f}`);
});

console.log("Total image files found:", imageFiles.length);

const lines = content.split("\n");
const newLines: string[] = [];
let currentId: string | null = null;
let currentItemHasImage = false;
let updatedCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const idMatch = line.match(/^\s*id:\s*"([^"]+)",?/);
  if (idMatch) {
    currentId = idMatch[1];
    currentItemHasImage = false;
  }

  if (line.includes("image:")) {
    currentItemHasImage = true;
  }

  newLines.push(line);

  // If line contains price and this item has an image available and didn't have one
  const priceMatch = line.match(/^\s*price:\s*\d+,?/);
  if (priceMatch && currentId && imageMap.has(currentId) && !currentItemHasImage) {
    // Check if next line is already image
    const nextLine = lines[i + 1] || "";
    if (!nextLine.includes("image:")) {
      const imgPath = imageMap.get(currentId);
      newLines.push(`        image: "${imgPath}",`);
      currentItemHasImage = true;
      updatedCount++;
    }
  }
}

fs.writeFileSync(menuPath, newLines.join("\n"), "utf8");
console.log(`Successfully added image links to ${updatedCount} items in menuData.ts`);
