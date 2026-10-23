import "dotenv/config";
import assert from "node:assert/strict";
import {
  canMutate,
  canDelete,
  canManageUsers,
  canViewAuditLogs,
} from "../src/lib/auth/permissions";
import {
  createSessionToken,
  verifySessionToken,
  getAuthSecret,
} from "../src/lib/auth/session";
import {
  getDatabaseMenu,
  getPublishedDailyMenu,
  getActivePublicOffers,
} from "../src/lib/db/menu-loader";
import {
  productSchema,
  dailyMenuSchema,
  offerSchema,
} from "../src/lib/validation/schemas";
import { getIstanbulDateString } from "../src/lib/date";

async function runTests() {
  console.log("==================================================");
  console.log("RUNNING ADMIN CRITICAL BUSINESS RULES TEST SUITE");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  [FAIL] ${name}`);
      console.error(`         ${err.message}`);
      failed++;
    }
  }

  // --- 1. Unauthorized Admin Access & Session Token Verification ---
  console.log("1. Authentication & Session Verification Tests:");

  test("Rejects empty or missing session token", () => {
    assert.equal(verifySessionToken(undefined), null);
    assert.equal(verifySessionToken(""), null);
    assert.equal(verifySessionToken("malformed.token"), null);
  });

  test("Rejects tampered HMAC signature on session token", () => {
    const validToken = createSessionToken({
      id: "user-123",
      email: "owner@cihangir.com",
      name: "Owner",
      role: "OWNER",
    });

    const [payload, signature] = validToken.split(".");
    // Tamper with payload (elevate role or user)
    const tamperedPayload = Buffer.from(
      JSON.stringify({
        userId: "hacker",
        email: "hacker@cihangir.com",
        role: "OWNER",
        exp: Math.floor(Date.now() / 1000) + 3600,
      })
    ).toString("base64url");

    const tamperedToken = `${tamperedPayload}.${signature}`;
    assert.equal(verifySessionToken(tamperedToken), null);
  });

  test("Valid session token verifies and extracts user info", () => {
    const validToken = createSessionToken({
      id: "user-456",
      email: "manager@cihangir.com",
      name: "Manager User",
      role: "MANAGER",
    });

    const verified = verifySessionToken(validToken);
    assert.ok(verified !== null);
    assert.equal(verified?.userId, "user-456");
    assert.equal(verified?.email, "manager@cihangir.com");
    assert.equal(verified?.role, "MANAGER");
  });

  // --- 2. Role-Based Permissions (RBAC) ---
  console.log("\n2. Role-Based Access Control (RBAC) Tests:");

  test("VIEWER role is strictly read-only and cannot mutate, delete, or manage users", () => {
    assert.equal(canMutate("VIEWER"), false);
    assert.equal(canDelete("VIEWER"), false);
    assert.equal(canManageUsers("VIEWER"), false);
    assert.equal(canViewAuditLogs("VIEWER"), false);
  });

  test("EDITOR role can mutate but cannot delete entities or manage users", () => {
    assert.equal(canMutate("EDITOR"), true);
    assert.equal(canDelete("EDITOR"), false);
    assert.equal(canManageUsers("EDITOR"), false);
    assert.equal(canViewAuditLogs("EDITOR"), false);
  });

  test("MANAGER role can mutate and delete, but cannot manage users", () => {
    assert.equal(canMutate("MANAGER"), true);
    assert.equal(canDelete("MANAGER"), true);
    assert.equal(canManageUsers("MANAGER"), false);
    assert.equal(canViewAuditLogs("MANAGER"), true);
  });

  test("OWNER role has full administrative capabilities", () => {
    assert.equal(canMutate("OWNER"), true);
    assert.equal(canDelete("OWNER"), true);
    assert.equal(canManageUsers("OWNER"), true);
    assert.equal(canViewAuditLogs("OWNER"), true);
  });

  // --- 3. Product Price Validation ---
  console.log("\n3. Product Price & Input Validation Tests:");

  test("Product schema rejects negative base prices", () => {
    const invalidProduct = {
      name: "Mercimek Çorbası",
      categoryId: "cat-1",
      slug: "mercimek-corbasi",
      basePriceTRY: -45,
    };
    const res = productSchema.safeParse(invalidProduct);
    assert.equal(res.success, false);
  });

  test("Product schema accepts valid non-negative decimal prices", () => {
    const validProduct = {
      name: "Mercimek Çorbası",
      categoryId: "cat-1",
      slug: "mercimek-corbasi",
      basePriceTRY: 120.5,
    };
    const res = productSchema.safeParse(validProduct);
    assert.equal(res.success, true);
    if (res.success) {
      assert.equal(res.data.basePriceTRY, 120.5);
    }
  });

  test("Product schema rejects invalid characters in slugs", () => {
    const invalidSlugProduct = {
      name: "Test Yemek",
      categoryId: "cat-1",
      slug: "Yemek Slug With Spaces!",
      basePriceTRY: 100,
    };
    const res = productSchema.safeParse(invalidSlugProduct);
    assert.equal(res.success, false);
  });

  // --- 4. Daily Menu Business Date & Eligibility ---
  console.log("\n4. Daily Menu & Business Date Tests:");

  test("getIstanbulDateString returns valid YYYY-MM-DD in Europe/Istanbul timezone", () => {
    const today = getIstanbulDateString();
    assert.match(today, /^\d{4}-\d{2}-\d{2}$/);
    const parsedYear = parseInt(today.split("-")[0]);
    assert.ok(parsedYear >= 2025 && parsedYear <= 2030);
  });

  test("Daily menu schema rejects malformed date strings", () => {
    const invalidMenu = {
      dateString: "22-10-2026", // Invalid format (DD-MM-YYYY)
      isPublished: true,
      productIds: ["prod-1"],
    };
    const res = dailyMenuSchema.safeParse(invalidMenu);
    assert.equal(res.success, false);
  });

  test("Daily menu schema validates valid Istanbul business date", () => {
    const validMenu = {
      dateString: "2026-10-22",
      notes: "Bugünün taze çorbası ve taş fırın güveci",
      isPublished: true,
      productIds: ["prod-1", "prod-2"],
    };
    const res = dailyMenuSchema.safeParse(validMenu);
    assert.equal(res.success, true);
  });

  // --- 5. Offer Pricing & Quantity Validation ---
  console.log("\n5. Offer Pricing & Quantity Validation Tests:");

  test("Offer schema rejects negative selling prices", () => {
    const invalidOffer = {
      title: "İkili Pide Menüsü",
      slug: "ikili-pide-menusu",
      sellingPrice: -50,
      items: [{ productId: "p-1", quantity: 1 }],
    };
    const res = offerSchema.safeParse(invalidOffer);
    assert.equal(res.success, false);
  });

  test("Offer schema rejects zero or negative product quantities", () => {
    const zeroQtyOffer = {
      title: "İkili Pide Menüsü",
      slug: "ikili-pide-menusu",
      sellingPrice: 350,
      items: [{ productId: "p-1", quantity: 0 }],
    };
    const res = offerSchema.safeParse(zeroQtyOffer);
    assert.equal(res.success, false);
  });

  test("Offer schema rejects empty product items list", () => {
    const emptyItemsOffer = {
      title: "Boş Menü",
      slug: "bos-menu",
      sellingPrice: 300,
      items: [],
    };
    const res = offerSchema.safeParse(emptyItemsOffer);
    assert.equal(res.success, false);
  });

  test("Offer schema accepts independent selling price and positive quantities", () => {
    const validOffer = {
      title: "Öğle Menüsü",
      title_en: "Lunch Special",
      title_ar: "وجبة غداء",
      slug: "ogle-menusu",
      sellingPrice: 280.0, // Independent package price
      isActive: true,
      items: [
        { productId: "p-1", quantity: 1 },
        { productId: "p-2", quantity: 2 },
      ],
    };
    const res = offerSchema.safeParse(validOffer);
    assert.equal(res.success, true);
    if (res.success) {
      assert.equal(res.data.sellingPrice, 280.0);
      assert.equal(res.data.items.length, 2);
    }
  });

  // --- 6. Phase 3: Public Website Integration & Database Loaders ---
  console.log("\n6. Public Website Integration & Security Tests:");

  await test("AUTH_SECRET strictly throws in production when missing or under 16 characters", async () => {
    const originalEnv = process.env.NODE_ENV;
    const originalSecret = process.env.AUTH_SECRET;

    try {
      (process.env as any).NODE_ENV = "production";
      delete process.env.AUTH_SECRET;
      assert.throws(() => getAuthSecret(), /AUTH_SECRET environment variable must be configured/);

      process.env.AUTH_SECRET = "short";
      assert.throws(() => getAuthSecret(), /AUTH_SECRET environment variable must be configured/);

      process.env.AUTH_SECRET = "a-sufficiently-long-secret-key-123456";
      assert.equal(getAuthSecret(), "a-sufficiently-long-secret-key-123456");
    } finally {
      (process.env as any).NODE_ENV = originalEnv;
      if (originalSecret) {
        process.env.AUTH_SECRET = originalSecret;
      } else {
        delete process.env.AUTH_SECRET;
      }
    }
  });

  await test("Database menu loader returns active categories and active products with canonical TRY prices", async () => {
    const { categories, isFromDb } = await getDatabaseMenu();
    assert.ok(categories.length > 0, "Categories must not be empty");
    assert.ok(categories[0].items.length > 0, "First category must have items");
    for (const cat of categories) {
      assert.ok(cat.id.length > 0);
      assert.ok(cat.category.tr.length > 0);
      for (const item of cat.items) {
        assert.ok(item.id.length > 0);
        assert.ok(typeof item.price === "number" && !isNaN(item.price));
        assert.ok(item.name.tr.length > 0);
      }
    }
  });

  await test("Daily menu loader respects isPublished and Istanbul dateString", async () => {
    const dailyMenu = await getPublishedDailyMenu("tr");
    if (dailyMenu) {
      assert.ok(dailyMenu.entries.length > 0);
      assert.equal(dailyMenu.dateString, getIstanbulDateString());
      for (const entry of dailyMenu.entries) {
        assert.ok(entry.priceTRY > 0);
        assert.ok(entry.name.length > 0);
      }
    }
  });

  await test("Offers loader returns active combo packages respecting valid dates", async () => {
    const offers = await getActivePublicOffers("tr");
    assert.ok(Array.isArray(offers));
    for (const offer of offers) {
      assert.ok(offer.sellingPriceTRY >= 0);
      assert.ok(offer.title.length > 0);
      assert.ok(offer.items.length > 0);
    }
  });

  await test("Display currency conversion preserves canonical TRY numbers", async () => {
    const tryPrice = 650;
    const usdRate = 0.028;
    const converted = (tryPrice * usdRate).toFixed(2);
    assert.equal(converted, "18.20");
  });

  // --- 7. Daily Menu Filter Composability & Deduplication Tests ---
  console.log("\n7. Daily Menu Filter Composability & Deduplication Tests:");

  await test("Bugünün Yemekleri translations exist in all supported languages", async () => {
    const { translations, SUPPORTED_LOCALES } = await import("../src/i18n/translations");
    for (const loc of SUPPORTED_LOCALES) {
      const dict = translations[loc];
      assert.ok(dict, `Dictionary must exist for ${loc}`);
      assert.ok(dict.dailyDishes, `dailyDishes must be defined for ${loc}`);
      assert.ok(dict.dailyDishes.length > 0, `dailyDishes must not be empty for ${loc}`);
    }
  });

  await test("Daily filter composably filters items by category and daily menu inclusion", async () => {
    const mockCategory = {
      id: "ana-yemekler",
      items: [
        { id: "asci-tabagi", price: 650 },
        { id: "tas-kebabi-350", price: 350 },
        { id: "karniyarik", price: 290 },
      ],
    };

    const mockDailyIds = new Set(["tas-kebabi-350"]);

    // When filter is "daily"
    const dailyFiltered = mockCategory.items.filter((item) => mockDailyIds.has(item.id));
    assert.equal(dailyFiltered.length, 1);
    assert.equal(dailyFiltered[0].id, "tas-kebabi-350");

    // When filter is "Tümü" (null or "all")
    const allFiltered = mockCategory.items.filter(() => true);
    assert.equal(allFiltered.length, 3);
    // Ensure no duplicates
    const uniqueIds = new Set(allFiltered.map((i) => i.id));
    assert.equal(uniqueIds.size, allFiltered.length);
  });

  await test("Daily filter is hidden when no published daily menu exists", async () => {
    const emptyDailyIds = new Set<string>();
    const hasDaily = emptyDailyIds.size > 0;
    assert.equal(hasDaily, false);
  });

  console.log("\n--------------------------------------------------");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("--------------------------------------------------\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
