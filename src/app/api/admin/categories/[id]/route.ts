import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, requireMutationAuth, requireDeleteAuth } from "@/lib/auth/server-guard";
import { categorySchema } from "@/lib/validation/schemas";
import { recordAuditLog } from "@/lib/audit/audit";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        translations: true,
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Kategori bulunamadı." }, { status: 404 });
    }

    const trTrans = category.translations.find((t) => t.locale === "tr");
    const enTrans = category.translations.find((t) => t.locale === "en");
    const arTrans = category.translations.find((t) => t.locale === "ar");

    return NextResponse.json({
      category: {
        id: category.id,
        slug: category.slug,
        orderIndex: category.orderIndex,
        isActive: category.isActive,
        productCount: category._count.products,
        name: trTrans?.name || category.slug,
        description: trTrans?.description || "",
        name_en: enTrans?.name || "",
        name_ar: arTrans?.name || "",
      },
    });
  } catch (err: any) {
    console.error("[Category GET [id] Error]:", err);
    return NextResponse.json({ error: "Kategori getirilemedi." }, { status: 500 });
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
    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Kategori bulunamadı." }, { status: 404 });
    }

    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz kategori bilgileri." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Slug conflict check
    if (data.slug !== existing.slug) {
      const slugConflict = await prisma.category.findUnique({
        where: { slug: data.slug },
      });
      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json(
          { error: `"${data.slug}" slugı başka bir kategori tarafından kullanılmaktadır.` },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const cat = await tx.category.update({
        where: { id },
        data: {
          slug: data.slug,
          orderIndex: data.orderIndex,
          isActive: data.isActive,
        },
      });

      await tx.categoryTranslation.upsert({
        where: { categoryId_locale: { categoryId: id, locale: "tr" } },
        update: { name: data.name, description: data.description || null },
        create: { categoryId: id, locale: "tr", name: data.name, description: data.description || null },
      });

      if (data.name_en) {
        await tx.categoryTranslation.upsert({
          where: { categoryId_locale: { categoryId: id, locale: "en" } },
          update: { name: data.name_en, description: data.description || null },
          create: { categoryId: id, locale: "en", name: data.name_en, description: data.description || null },
        });
      }

      if (data.name_ar) {
        await tx.categoryTranslation.upsert({
          where: { categoryId_locale: { categoryId: id, locale: "ar" } },
          update: { name: data.name_ar, description: data.description || null },
          create: { categoryId: id, locale: "ar", name: data.name_ar, description: data.description || null },
        });
      }

      return cat;
    });

    await recordAuditLog({
      userId: auth.user.userId,
      action: "UPDATE_CATEGORY",
      entityType: "Category",
      entityId: id,
      details: { slug: updated.slug, name: data.name },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (err: any) {
    console.error("[Category PUT Error]:", err);
    return NextResponse.json(
      { error: "Kategori güncellenirken bir hata oluştu." },
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
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Silinecek kategori bulunamadı." }, { status: 404 });
    }

    // Safe deletion: prevent deleting if category still contains products
    if (category._count.products > 0) {
      return NextResponse.json(
        {
          error: `Bu kategoride kayıtlı ${category._count.products} adet ürün bulunmaktadır. Kategoriyi silebilmek için önce bu ürünleri silmeli veya başka bir kategoriye taşımalısınız.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    await recordAuditLog({
      userId: auth.user.userId,
      action: "DELETE_CATEGORY",
      entityType: "Category",
      entityId: id,
      details: { slug: category.slug },
    });

    return NextResponse.json({
      success: true,
      deleted: true,
      message: "Kategori başarıyla silindi.",
    });
  } catch (err: any) {
    console.error("[Category DELETE Error]:", err);
    return NextResponse.json(
      { error: "Kategori silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
