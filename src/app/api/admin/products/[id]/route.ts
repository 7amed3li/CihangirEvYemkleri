import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, requireMutationAuth, requireDeleteAuth } from "@/lib/auth/server-guard";
import { productSchema } from "@/lib/validation/schemas";
import { recordAuditLog } from "@/lib/audit/audit";
import { Prisma } from "@prisma/client";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        translations: true,
        priceHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
    }

    const trTrans = product.translations.find((t) => t.locale === "tr");
    const enTrans = product.translations.find((t) => t.locale === "en");
    const arTrans = product.translations.find((t) => t.locale === "ar");

    return NextResponse.json({
      product: {
        id: product.id,
        slug: product.slug,
        categoryId: product.categoryId,
        basePriceTRY: Number(product.basePriceTRY),
        imageUrl: product.imageUrl,
        isAvailable: product.isAvailable,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        orderIndex: product.orderIndex,
        createdAt: product.createdAt,
        name: trTrans?.name || product.slug,
        description: trTrans?.description || "",
        name_en: enTrans?.name || "",
        name_ar: arTrans?.name || "",
        priceHistory: product.priceHistory.map((ph) => ({
          id: ph.id,
          oldPrice: Number(ph.oldPrice),
          newPrice: Number(ph.newPrice),
          changedBy: ph.changedBy,
          reason: ph.reason,
          createdAt: ph.createdAt,
        })),
      },
    });
  } catch (err: any) {
    console.error("[Product GET [id] Error]:", err);
    return NextResponse.json({ error: "Ürün getirilemedi." }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireMutationAuth();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await params;
    const existing = await prisma.product.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Güncellenecek ürün bulunamadı." }, { status: 404 });
    }

    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz ürün bilgileri." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check slug conflict if slug was changed
    if (data.slug !== existing.slug) {
      const slugConflict = await prisma.product.findUnique({
        where: { slug: data.slug },
      });
      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json(
          { error: `"${data.slug}" slugı başka bir ürün tarafından kullanılmaktadır.` },
          { status: 400 }
        );
      }
    }

    const oldPriceNumber = Number(existing.basePriceTRY);
    const newPriceNumber = data.basePriceTRY;
    const isPriceChanged = Math.abs(oldPriceNumber - newPriceNumber) >= 0.01;

    // Transactionally update product, translations, and price history
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update product core fields
      const prod = await tx.product.update({
        where: { id },
        data: {
          slug: data.slug,
          categoryId: data.categoryId,
          basePriceTRY: new Prisma.Decimal(data.basePriceTRY),
          imageUrl: data.imageUrl || null,
          isActive: data.isActive,
          isAvailable: data.isAvailable,
          isFeatured: data.isFeatured,
          orderIndex: data.orderIndex,
        },
      });

      // 2. Upsert Turkish translation
      await tx.productTranslation.upsert({
        where: { productId_locale: { productId: id, locale: "tr" } },
        update: { name: data.name, description: data.description || null },
        create: { productId: id, locale: "tr", name: data.name, description: data.description || null },
      });

      // 3. Upsert English translation
      if (data.name_en) {
        await tx.productTranslation.upsert({
          where: { productId_locale: { productId: id, locale: "en" } },
          update: { name: data.name_en, description: data.description || null },
          create: { productId: id, locale: "en", name: data.name_en, description: data.description || null },
        });
      }

      // 4. Upsert Arabic translation
      if (data.name_ar) {
        await tx.productTranslation.upsert({
          where: { productId_locale: { productId: id, locale: "ar" } },
          update: { name: data.name_ar, description: data.description || null },
          create: { productId: id, locale: "ar", name: data.name_ar, description: data.description || null },
        });
      }

      // 5. If price changed, record in PriceHistory
      if (isPriceChanged) {
        await tx.priceHistory.create({
          data: {
            productId: id,
            oldPrice: new Prisma.Decimal(oldPriceNumber),
            newPrice: new Prisma.Decimal(newPriceNumber),
            changedBy: auth.user.email,
            reason: data.priceChangeReason || "Yönetim paneli üzerinden fiyat güncellemesi",
          },
        });
      }

      return prod;
    });

    await recordAuditLog({
      userId: auth.user.userId,
      action: isPriceChanged ? "PRODUCT_PRICE_CHANGED" : "UPDATE_PRODUCT",
      entityType: "Product",
      entityId: id,
      details: {
        slug: updated.slug,
        oldPriceTRY: oldPriceNumber,
        newPriceTRY: newPriceNumber,
        isPriceChanged,
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    console.error("[Product PUT Error]:", err);
    return NextResponse.json(
      { error: "Ürün güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireDeleteAuth();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const forceDeactivate = searchParams.get("deactivate") === "true";

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            dailyMenuEntries: true,
            offerItems: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Silinecek ürün bulunamadı." }, { status: 404 });
    }

    const isReferenced =
      product._count.dailyMenuEntries > 0 || product._count.offerItems > 0;

    // If referenced or requested, safely deactivate instead of breaking database constraints
    if (isReferenced || forceDeactivate) {
      await prisma.product.update({
        where: { id },
        data: {
          isActive: false,
          isAvailable: false,
        },
      });

      await recordAuditLog({
        userId: auth.user.userId,
        action: "DEACTIVATE_PRODUCT",
        entityType: "Product",
        entityId: id,
        details: {
          slug: product.slug,
          reason: isReferenced
            ? "Referenced by daily menus or offers"
            : "User safe deactivation",
        },
      });

      return NextResponse.json({
        success: true,
        deactivated: true,
        message:
          "Ürün sipariş/menü/fırsat kayıtlarıyla ilişkili olduğu için güvenli bir şekilde pasife alındı.",
      });
    }

    // If not referenced, proceed with clean deletion
    await prisma.product.delete({
      where: { id },
    });

    await recordAuditLog({
      userId: auth.user.userId,
      action: "DELETE_PRODUCT",
      entityType: "Product",
      entityId: id,
      details: { slug: product.slug },
    });

    return NextResponse.json({
      success: true,
      deleted: true,
      message: "Ürün başarıyla silindi.",
    });
  } catch (err: any) {
    console.error("[Product DELETE Error]:", err);
    return NextResponse.json(
      { error: "Ürün silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
