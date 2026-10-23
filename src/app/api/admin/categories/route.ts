import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, requireMutationAuth } from "@/lib/auth/server-guard";
import { categorySchema } from "@/lib/validation/schemas";
import { recordAuditLog } from "@/lib/audit/audit";

export async function GET() {
  const auth = await requireAuth();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const categories = await prisma.category.findMany({
      include: {
        translations: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { orderIndex: "asc" },
    });

    const formatted = categories.map((c) => {
      const trTrans = c.translations.find((t) => t.locale === "tr");
      const enTrans = c.translations.find((t) => t.locale === "en");
      const arTrans = c.translations.find((t) => t.locale === "ar");

      return {
        id: c.id,
        slug: c.slug,
        orderIndex: c.orderIndex,
        isActive: c.isActive,
        productCount: c._count.products,
        name: trTrans?.name || c.slug,
        description: trTrans?.description || "",
        name_en: enTrans?.name || "",
        name_ar: arTrans?.name || "",
      };
    });

    return NextResponse.json({ categories: formatted });
  } catch (err: any) {
    console.error("[Categories GET Error]:", err);
    return NextResponse.json(
      { error: "Kategoriler yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await requireMutationAuth();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz kategori bilgileri." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Slug uniqueness check
    const existing = await prisma.category.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: `"${data.slug}" slugına sahip başka bir kategori zaten mevcut.` },
        { status: 400 }
      );
    }

    const translationsCreate = [
      { locale: "tr", name: data.name, description: data.description || null },
    ];
    if (data.name_en) {
      translationsCreate.push({ locale: "en", name: data.name_en, description: data.description || null });
    }
    if (data.name_ar) {
      translationsCreate.push({ locale: "ar", name: data.name_ar, description: data.description || null });
    }

    const category = await prisma.category.create({
      data: {
        slug: data.slug,
        orderIndex: data.orderIndex,
        isActive: data.isActive,
        translations: {
          create: translationsCreate,
        },
      },
      include: {
        translations: true,
      },
    });

    await recordAuditLog({
      userId: auth.user.userId,
      action: "CREATE_CATEGORY",
      entityType: "Category",
      entityId: category.id,
      details: { slug: category.slug, name: data.name },
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (err: any) {
    console.error("[Categories POST Error]:", err);
    return NextResponse.json(
      { error: "Kategori oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}
