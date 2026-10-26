import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/data/menuData.ts");
let content = fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");

const order = [
  "ana-yemekler",
  "pideler",
  "corbalar",
  "az-menu",
  "yan-urunler",
  "salatalar",
  "tatlilar",
  "icecekler",
];

const rawStartMarker = "const rawMenuData: MenuCategory[] = [\n";
const rawEndMarker = "\n];\n\nexport const GLUTEN_FREE_DISH_IDS";

const startIndex = content.indexOf(rawStartMarker);
const endIndex = content.indexOf(rawEndMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find markers with normalized line endings");
  process.exit(1);
}

const before = content.slice(0, startIndex + rawStartMarker.length);
const arrayContent = content.slice(startIndex + rawStartMarker.length, endIndex);
const after = content.slice(endIndex);

const catRegex = /  \{\n    id: "([a-z0-9\-]+)",/g;
const matches = [...arrayContent.matchAll(catRegex)];

const blocks: Record<string, string> = {};
for (let i = 0; i < matches.length; i++) {
  const current = matches[i];
  const slug = current[1];
  const start = current.index!;
  const end = i < matches.length - 1 ? matches[i + 1].index! : arrayContent.length;
  let block = arrayContent.slice(start, end).trim();
  if (block.endsWith(",")) {
    block = block.slice(0, -1).trim();
  }
  blocks[slug] = block;
}

console.log("Found categories:", Object.keys(blocks));

const newArrayContent = order
  .map((slug) => {
    const b = blocks[slug];
    if (!b) throw new Error("Missing block: " + slug);
    return "  " + b.split("\n").join("\n  ") + ",";
  })
  .join("\n");

const finalContent = before + newArrayContent + after;
fs.writeFileSync(filePath, finalContent, "utf8");
console.log("Successfully reordered rawMenuData in src/data/menuData.ts!");
