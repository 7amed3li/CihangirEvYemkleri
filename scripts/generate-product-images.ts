import * as fs from "node:fs";
import * as path from "node:path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// 1. Load environment variables prioritizing .env.local (never committed, never exposed to browser)
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}
dotenv.config(); // fallback to standard .env

// Product definition interface
export interface ProductItem {
  slug: string;
  name: string;
  category?: string;
  ingredients: string[];
  serving?: string;
}

// Configuration options parsed from CLI or environment
interface ScriptOptions {
  dataFile: string;
  outputDir: string;
  limit: number;
  offset: number;
  targetSlug?: string;
  dryRun: boolean;
  force: boolean;
  model: string;
  delayMs: number;
  maxRetries: number;
  exportBatchJsonl?: string;
}

function parseCliArgs(): ScriptOptions {
  const args = process.argv.slice(2);
  const options: ScriptOptions = {
    dataFile: path.resolve(process.cwd(), "data/products.json"),
    outputDir: path.resolve(process.cwd(), "public/images/products"),
    limit: 10,
    offset: 0,
    dryRun: false,
    force: false,
    model: process.env.GEMINI_IMAGE_MODEL || "gemini-3.1-flash-image",
    delayMs: 3000,
    maxRetries: 3,
  };

  for (const arg of args) {
    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--force") {
      options.force = true;
    } else if (arg.startsWith("--limit=")) {
      const val = parseInt(arg.split("=")[1], 10);
      if (!isNaN(val) && val > 0) options.limit = val;
    } else if (arg.startsWith("--offset=")) {
      const val = parseInt(arg.split("=")[1], 10);
      if (!isNaN(val) && val >= 0) options.offset = val;
    } else if (arg.startsWith("--slug=")) {
      options.targetSlug = arg.split("=")[1].trim();
    } else if (arg.startsWith("--model=")) {
      options.model = arg.split("=")[1].trim();
    } else if (arg.startsWith("--delay=")) {
      const val = parseInt(arg.split("=")[1], 10);
      if (!isNaN(val) && val >= 0) options.delayMs = val;
    } else if (arg.startsWith("--retries=")) {
      const val = parseInt(arg.split("=")[1], 10);
      if (!isNaN(val) && val >= 0) options.maxRetries = val;
    } else if (arg.startsWith("--data=")) {
      options.dataFile = path.resolve(process.cwd(), arg.split("=")[1].trim());
    } else if (arg.startsWith("--out=")) {
      options.outputDir = path.resolve(process.cwd(), arg.split("=")[1].trim());
    } else if (arg.startsWith("--export-batch=")) {
      options.exportBatchJsonl = path.resolve(process.cwd(), arg.split("=")[1].trim());
    }
  }

  return options;
}

/**
 * Builds a prompt following the strict guidelines:
 * - Shared visual style: warm beige textured background, soft warm studio lighting,
 *   consistent 45-degree camera angle, premium realistic Turkish restaurant food photography, square 1:1 composition.
 * - Strict ingredient fidelity: Describe the dish using ONLY verified ingredients.
 *   Explicitly forbid inventing rice, fries, sauces, garnishes, bread, or side dishes.
 */
export function buildProductPrompt(product: ProductItem): string {
  const ingredientsStr = product.ingredients.join(", ");
  const servingNote = product.serving ? ` Plating details: ${product.serving}.` : "";

  return [
    `Editorial culinary food photography of authentic Turkish dish "${product.name}".`,
    `Verified Ingredients: The dish is strictly composed of: ${ingredientsStr}.${servingNote}`,
    `CRITICAL INGREDIENT FIDELITY RULE: Do NOT invent, hallucinate, or add any unverified side dishes, accompaniments, garnishes, or starches. Absolutely NO rice, NO french fries, NO bread, NO pickles, NO extra side salads, NO sauces unless explicitly listed in verified ingredients. Present exclusively the stated dish centered on the plate.`,
    `Visual Style & Atmosphere: Warm beige textured ceramic tabletop background, soft warm cinematic studio lighting with gentle soft shadows, 45-degree angle food portrait, razor-sharp focus on realistic food textures and authentic simmering glazes, square 1:1 composition, premium gourmet Turkish restaurant aesthetic.`
  ].join(" ");
}

/**
 * Checks if an image file already exists for the given slug
 */
function findExistingImage(outputDir: string, slug: string): string | null {
  const extensions = [".png", ".jpg", ".jpeg", ".webp"];
  for (const ext of extensions) {
    const candidate = path.join(outputDir, `${slug}${ext}`);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

/**
 * Sleep helper for rate limiting and backoff
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const options = parseCliArgs();

  console.log("===============================================================");
  console.log("  Cihangir Ev Yemekleri — Gemini Image Generation Utility");
  console.log("===============================================================");
  console.log(`- Model:          ${options.model}`);
  console.log(`- Data file:      ${path.relative(process.cwd(), options.dataFile)}`);
  console.log(`- Output dir:     ${path.relative(process.cwd(), options.dataFile)} -> ${path.relative(process.cwd(), options.outputDir)}`);
  console.log(`- Batch limit:    ${options.limit} (offset: ${options.offset})`);
  console.log(`- Dry-run mode:   ${options.dryRun ? "ENABLED (No API calls, $0 cost)" : "DISABLED (Live generation)"}`);
  console.log(`- Force rewrite:  ${options.force ? "YES" : "NO (Skips existing images)"}`);
  console.log(`- Inter-req delay:${options.delayMs}ms`);
  console.log("===============================================================\n");

  // Verify data file exists
  if (!fs.existsSync(options.dataFile)) {
    console.error(`❌ Error: Data file not found at: ${options.dataFile}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(options.dataFile, "utf-8");
  let allProducts: ProductItem[] = [];
  try {
    allProducts = JSON.parse(rawData);
  } catch (err) {
    console.error(`❌ Error parsing JSON from ${options.dataFile}:`, err);
    process.exit(1);
  }

  // Filter or slice products
  let targetProducts: ProductItem[] = allProducts;
  if (options.targetSlug) {
    targetProducts = allProducts.filter((p) => p.slug === options.targetSlug);
    if (targetProducts.length === 0) {
      console.error(`❌ Product with slug "${options.targetSlug}" not found in ${options.dataFile}`);
      process.exit(1);
    }
  } else {
    targetProducts = allProducts.slice(options.offset, options.offset + options.limit);
  }

  console.log(`📋 Selected ${targetProducts.length} product(s) for this batch run.`);

  // If user requested Batch API JSONL export
  if (options.exportBatchJsonl) {
    console.log(`\n📦 Exporting Gemini Batch API input file to: ${options.exportBatchJsonl}...`);
    const lines = targetProducts.map((p, idx) => {
      const prompt = buildProductPrompt(p);
      return JSON.stringify({
        custom_id: `dish-${p.slug}`,
        request: {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ["IMAGE"],
            imageConfig: { aspectRatio: "1:1", imageSize: "1K" },
          },
        },
      });
    });
    fs.mkdirSync(path.dirname(options.exportBatchJsonl), { recursive: true });
    fs.writeFileSync(options.exportBatchJsonl, lines.join("\n") + "\n", "utf-8");
    console.log(`✅ Exported ${lines.length} requests in JSONL format for Gemini Batch API.`);
    console.log(`Note: Gemini Batch API offers 50% discount with an asynchronous 24h queue.`);
    return;
  }

  // Check output directory
  fs.mkdirSync(options.outputDir, { recursive: true });

  // DRY-RUN MODE: List all products and prompts without spending API credits
  if (options.dryRun) {
    console.log("\n--- [DRY-RUN PREVIEW] -----------------------------------------");
    targetProducts.forEach((product, idx) => {
      const existing = findExistingImage(options.outputDir, product.slug);
      const status = existing
        ? `[EXISTS -> ${path.basename(existing)}]`
        : "[TO BE GENERATED]";
      const prompt = buildProductPrompt(product);

      console.log(`\n[#${idx + 1}/${targetProducts.length}] Product: "${product.name}" (slug: ${product.slug})`);
      console.log(`    Status:      ${status}`);
      console.log(`    Target File: ${path.join(path.relative(process.cwd(), options.outputDir), `${product.slug}.png`)}`);
      console.log(`    Ingredients: ${product.ingredients.join(", ")}`);
      console.log(`    Prompt:`);
      console.log(`    "${prompt}"`);
    });
    console.log("\n---------------------------------------------------------------");
    console.log(`✅ Dry-run complete. Checked ${targetProducts.length} product(s). 0 API credits used.`);
    console.log(`To run live generation for these 10 products, run:`);
    console.log(`  npx tsx scripts/generate-product-images.ts --limit=10`);
    return;
  }

  // LIVE RUN: Verify API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your-gemini-api-key-here") {
    console.error("❌ GEMINI_API_KEY is not set or still has the placeholder value.");
    console.error("   Please open .env.local and set your GEMINI_API_KEY from Google AI Studio:");
    console.error("   GEMINI_API_KEY=\"AIzaSy...\"");
    process.exit(1);
  }

  // Initialize official @google/genai client
  const ai = new GoogleGenAI({ apiKey });

  let successCount = 0;
  let skippedCount = 0;
  let failureCount = 0;
  const startTime = Date.now();

  console.log(`\n🚀 Starting controlled sequential generation with model: "${options.model}"...\n`);

  for (let i = 0; i < targetProducts.length; i++) {
    const product = targetProducts[i];
    const itemNumber = `[${i + 1}/${targetProducts.length}]`;

    // Resumption check: does image already exist?
    const existingFile = findExistingImage(options.outputDir, product.slug);
    if (existingFile && !options.force) {
      console.log(`${itemNumber} ⏩ [SKIPPED] ${product.name} (${product.slug}): Already exists at ${path.basename(existingFile)}`);
      skippedCount++;
      continue;
    }

    const prompt = buildProductPrompt(product);
    console.log(`${itemNumber} ⏳ [GENERATING] ${product.name} (${product.slug})...`);

    let attempt = 0;
    let generated = false;

    while (attempt <= options.maxRetries && !generated) {
      attempt++;
      try {
        const itemStartTime = Date.now();

        // Separate, independent API request per product
        const response = await ai.models.generateContent({
          model: options.model,
          contents: prompt,
          config: {
            responseModalities: ["IMAGE"],
            imageConfig: {
              aspectRatio: "1:1",
              imageSize: "1K",
            },
          },
        });

        // Extract image buffer from response
        const candidate = response.candidates?.[0];
        const parts = candidate?.content?.parts || [];
        let imageBuffer: Buffer | null = null;
        let mimeType = "image/png";

        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            imageBuffer = Buffer.from(part.inlineData.data, "base64");
            if (part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            break;
          }
        }

        if (!imageBuffer) {
          // If no inline image was found, check if text/safety finish reason exists
          const textPart = parts.find((p) => p.text)?.text;
          const finishReason = candidate?.finishReason || "UNKNOWN";
          throw new Error(
            `No image returned by model. Finish reason: ${finishReason}. ${textPart ? `Note: ${textPart}` : ""}`
          );
        }

        // Determine extension and save
        const ext = mimeType === "image/jpeg" ? ".jpg" : ".png";
        const finalFilename = `${product.slug}${ext}`;
        const finalPath = path.join(options.outputDir, finalFilename);

        fs.writeFileSync(finalPath, imageBuffer);
        const elapsedSec = ((Date.now() - itemStartTime) / 1000).toFixed(1);
        const sizeKb = (imageBuffer.length / 1024).toFixed(0);

        console.log(
          `${itemNumber} ✅ [SUCCESS] ${product.name} -> ${path.relative(process.cwd(), finalPath)} (${sizeKb} KB, ${elapsedSec}s)`
        );

        successCount++;
        generated = true;
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        if (attempt <= options.maxRetries) {
          const backoffMs = Math.pow(2, attempt) * 1500;
          console.warn(
            `${itemNumber} ⚠️ [RETRY ${attempt}/${options.maxRetries}] ${product.slug} failed: ${errMsg}. Retrying in ${(backoffMs / 1000).toFixed(1)}s...`
          );
          await sleep(backoffMs);
        } else {
          console.error(
            `${itemNumber} ❌ [FAILED] ${product.name} (${product.slug}) failed after ${options.maxRetries} retries: ${errMsg}`
          );
          failureCount++;
        }
      }
    }

    // Rate-limiting delay before the next product request
    if (i < targetProducts.length - 1 && !options.dryRun) {
      await sleep(options.delayMs);
    }
  }

  const totalTimeSec = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log("\n===============================================================");
  console.log("  Batch Generation Summary");
  console.log("===============================================================");
  console.log(`- Total Evaluated: ${targetProducts.length}`);
  console.log(`- Generated:       ${successCount}`);
  console.log(`- Skipped:         ${skippedCount}`);
  console.log(`- Failed:          ${failureCount}`);
  console.log(`- Time Elapsed:    ${totalTimeSec}s`);
  console.log(`- Output Folder:   ${path.relative(process.cwd(), options.outputDir)}`);
  console.log("===============================================================\n");
}

run().catch((err) => {
  console.error("Fatal error running image generation utility:", err);
  process.exit(1);
});
