import { prisma } from "@/lib/db/prisma";

let schemaInitialized = false;

export async function ensureDatabaseTables(): Promise<void> {
  if (schemaInitialized) return;

  try {
    const ddl = `
      DO $$ BEGIN
        CREATE TYPE "Role" AS ENUM ('OWNER', 'MANAGER', 'EDITOR', 'VIEWER');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      CREATE TABLE IF NOT EXISTS "admin_users" (
        "id" TEXT PRIMARY KEY,
        "email" TEXT UNIQUE NOT NULL,
        "name" TEXT NOT NULL,
        "passwordHash" TEXT NOT NULL,
        "role" "Role" NOT NULL DEFAULT 'EDITOR',
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "categories" (
        "id" TEXT PRIMARY KEY,
        "slug" TEXT UNIQUE NOT NULL,
        "orderIndex" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "category_translations" (
        "id" TEXT PRIMARY KEY,
        "categoryId" TEXT NOT NULL REFERENCES "categories"("id") ON DELETE CASCADE,
        "locale" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        CONSTRAINT "category_translations_categoryId_locale_key" UNIQUE ("categoryId", "locale")
      );

      CREATE TABLE IF NOT EXISTS "products" (
        "id" TEXT PRIMARY KEY,
        "categoryId" TEXT NOT NULL REFERENCES "categories"("id") ON DELETE RESTRICT,
        "slug" TEXT UNIQUE NOT NULL,
        "basePriceTRY" DECIMAL(10,2) NOT NULL,
        "imageUrl" TEXT,
        "isAvailable" BOOLEAN NOT NULL DEFAULT true,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "isFeatured" BOOLEAN NOT NULL DEFAULT false,
        "orderIndex" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "product_translations" (
        "id" TEXT PRIMARY KEY,
        "productId" TEXT NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
        "locale" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        CONSTRAINT "product_translations_productId_locale_key" UNIQUE ("productId", "locale")
      );

      CREATE TABLE IF NOT EXISTS "price_history" (
        "id" TEXT PRIMARY KEY,
        "productId" TEXT NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
        "oldPrice" DECIMAL(10,2) NOT NULL,
        "newPrice" DECIMAL(10,2) NOT NULL,
        "changedBy" TEXT,
        "reason" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "daily_menus" (
        "id" TEXT PRIMARY KEY,
        "dateString" TEXT UNIQUE NOT NULL,
        "notes" TEXT,
        "isPublished" BOOLEAN NOT NULL DEFAULT true,
        "updatedBy" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "daily_menu_entries" (
        "id" TEXT PRIMARY KEY,
        "dailyMenuId" TEXT NOT NULL REFERENCES "daily_menus"("id") ON DELETE CASCADE,
        "productId" TEXT NOT NULL REFERENCES "products"("id") ON DELETE RESTRICT,
        "displayOrder" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "daily_menu_entries_dailyMenuId_productId_key" UNIQUE ("dailyMenuId", "productId")
      );

      CREATE TABLE IF NOT EXISTS "offers" (
        "id" TEXT PRIMARY KEY,
        "slug" TEXT UNIQUE NOT NULL,
        "sellingPrice" DECIMAL(10,2) NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "validFrom" TIMESTAMP(3),
        "validUntil" TIMESTAMP(3),
        "imageUrl" TEXT,
        "orderIndex" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS "offer_translations" (
        "id" TEXT PRIMARY KEY,
        "offerId" TEXT NOT NULL REFERENCES "offers"("id") ON DELETE CASCADE,
        "locale" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        CONSTRAINT "offer_translations_offerId_locale_key" UNIQUE ("offerId", "locale")
      );

      CREATE TABLE IF NOT EXISTS "offer_items" (
        "id" TEXT PRIMARY KEY,
        "offerId" TEXT NOT NULL REFERENCES "offers"("id") ON DELETE CASCADE,
        "productId" TEXT NOT NULL REFERENCES "products"("id") ON DELETE RESTRICT,
        "quantity" INTEGER NOT NULL DEFAULT 1,
        CONSTRAINT "offer_items_offerId_productId_key" UNIQUE ("offerId", "productId")
      );

      CREATE TABLE IF NOT EXISTS "audit_logs" (
        "id" TEXT PRIMARY KEY,
        "userId" TEXT REFERENCES "admin_users"("id") ON DELETE SET NULL,
        "action" TEXT NOT NULL,
        "entityType" TEXT NOT NULL,
        "entityId" TEXT,
        "details" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await prisma.$executeRawUnsafe(ddl);
    schemaInitialized = true;
  } catch (error) {
    console.error("[ensureDatabaseTables Error]:", error);
    throw error;
  }
}

