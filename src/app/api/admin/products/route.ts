import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, requireMutationAuth } from "@/lib/auth/server-guard";
import { productSchema } from "@/lib/validation/schemas";
import { recordAuditLog } from "@/lib/audit/audit";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const search = searchParams.get("search")?.trim() || "";
    const categoryId = searchParams.get("categoryId") || "";
    const isActiveParam = searchParams.get("isActive");
    const isAvailableParam = searchParams.get("isAvailable");
    const isFeaturedParam = searchParams.get("isFeatured");

    const where: Prisma.ProductWhereInput = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActiveParam === "true") where.isActive = true;
    else if (isActiveParam === "false") where.isActive = false;

    if (isAvailableParam === "true") where.isAvailable = true;
    else if (isAvailableParam === "false") where.isAvailable = false;

    if (isFeaturedParam === "true") where.isFeatured = true;
    else if (isFeaturedParam === "false") where.isFeatured = false;

    if (search) {
      where.OR = [
        { slug: { contains: search, mode: "insensitive" } },
        {
          translations: {
            some: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, slug: true, translations: { where: { locale: "tr" }, select: { name: true } } },
          },
          translations: true,
          priceHistory: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    // Format products for consumer UI
    const formattedProducts = products.map((p) => {
      const trTrans = p.translations.find((t) => t.locale === "tr");
      const enTrans = p.translations.find((t) => t.locale === "en");
      const arTrans = p.translations.find((t) => t.locale === "ar");

      return {
        id: p.id,
        slug: p.slug,
        categoryId: p.categoryId,
        categoryName: p.category.translations[0]?.name || p.category.slug,
        basePriceTRY: Number(p.basePriceTRY),
        imageUrl: p.imageUrl,
        isAvailable: p.isAvailable,
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        orderIndex: p.orderIndex,
        createdAt: p.createdAt,
        name: trTrans?.name || p.slug,
        description: trTrans?.description || "",
        name_en: enTrans?.name || "",
        name_ar: arTrans?.name || "",
        lastPriceChange: p.priceHistory[0]?.createdAt || p.createdAt,
      };
    });

    return NextResponse.json({
      products: formattedProducts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    });
  } catch (err: any) {
    console.error("[Products GET Error]:", err);
    return NextResponse.json(
      { error: "Ürünler yüklenirken bir veritabanı hatası oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await requireMutationAuth();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz ürün bilgileri." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: `"${data.slug}" slugına sahip başka bir ürün zaten mevcut.` },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { error: "Belirtilen kategori bulunamadı." },
        { status: 400 }
      );
    }

    // Build translations array
    const translationsCreate = [
      { locale: "tr", name: data.name, description: data.description || null },
    ];
    if (data.name_en) {
      translationsCreate.push({ locale: "en", name: data.name_en, description: data.description || null });
    }
    if (data.name_ar) {
      translationsCreate.push({ locale: "ar", name: data.name_ar, description: data.description || null });
    }

    // Transactional creation: Product + Translations + Initial PriceHistory
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          slug: data.slug,
          categoryId: data.categoryId,
          basePriceTRY: new Prisma.Decimal(data.basePriceTRY),
          imageUrl: data.imageUrl || null,
          isActive: data.isActive,
          isAvailable: data.isAvailable,
          isFeatured: data.isFeatured,
          orderIndex: data.orderIndex,
          translations: {
            create: translationsCreate,
          },
          priceHistory: {
            create: {
              oldPrice: new Prisma.Decimal(data.basePriceTRY),
              newPrice: new Prisma.Decimal(data.basePriceTRY),
              changedBy: auth.user.email,
              reason: data.priceChangeReason || "Ürün oluşturma başlangıç fiyatı",
            },
          },
        },
        include: {
          translations: true,
        },
      });

      return product;
    });

    await recordAuditLog({
      userId: auth.user.userId,
      action: "CREATE_PRODUCT",
      entityType: "Product",
      entityId: result.id,
      details: {
        slug: result.slug,
        basePriceTRY: data.basePriceTRY,
        category: category.slug,
      },
    });

    return NextResponse.json({ success: true, product: result }, { status: 201 });
  } catch (err: any) {
    console.error("[Products POST Error]:", err);
    return NextResponse.json(
      { error: "Ürün kaydedilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
