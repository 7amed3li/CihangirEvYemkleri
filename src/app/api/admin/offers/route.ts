import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, requireMutationAuth } from "@/lib/auth/server-guard";
import { offerSchema } from "@/lib/validation/schemas";
import { recordAuditLog } from "@/lib/audit/audit";
import { Prisma } from "@prisma/client";

export async function GET() {
  const auth = await requireAuth();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const offers = await prisma.offer.findMany({
      include: {
        translations: true,
        items: {
          include: {
            product: {
              include: {
                translations: { where: { locale: "tr" }, select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
    });

    const formatted = offers.map((o) => {
      const trTrans = o.translations.find((t) => t.locale === "tr");
      const enTrans = o.translations.find((t) => t.locale === "en");
      const arTrans = o.translations.find((t) => t.locale === "ar");

      return {
        id: o.id,
        slug: o.slug,
        sellingPriceTRY: Number(o.sellingPrice),
        isActive: o.isActive,
        validFrom: o.validFrom ? o.validFrom.toISOString().split("T")[0] : null,
        validUntil: o.validUntil ? o.validUntil.toISOString().split("T")[0] : null,
        imageUrl: o.imageUrl,
        orderIndex: o.orderIndex,
        title: trTrans?.title || o.slug,
        description: trTrans?.description || "",
        title_en: enTrans?.title || "",
        title_ar: arTrans?.title || "",
        items: o.items.map((it) => ({
          id: it.id,
          productId: it.productId,
          quantity: it.quantity,
          productName: it.product.translations[0]?.name || it.product.slug,
          productPriceTRY: Number(it.product.basePriceTRY),
        })),
      };
    });

    return NextResponse.json({ offers: formatted });
  } catch (err: any) {
    console.error("[Offers GET Error]:", err);
    return NextResponse.json(
      { error: "Fırsatlar yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await requireMutationAuth();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const parsed = offerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz teklif bilgileri." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check slug uniqueness
    const existing = await prisma.offer.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: `"${data.slug}" slugına sahip başka bir fırsat zaten mevcut.` },
        { status: 400 }
      );
    }

    const translationsCreate = [
      { locale: "tr", title: data.title, description: data.description || null },
    ];
    if (data.title_en) {
      translationsCreate.push({ locale: "en", title: data.title_en, description: data.description || null });
    }
    if (data.title_ar) {
      translationsCreate.push({ locale: "ar", title: data.title_ar, description: data.description || null });
    }

    const offer = await prisma.$transaction(async (tx) => {
      const created = await tx.offer.create({
        data: {
          slug: data.slug,
          sellingPrice: new Prisma.Decimal(data.sellingPrice),
          isActive: data.isActive,
          validFrom: data.validFrom ? new Date(data.validFrom) : null,
          validUntil: data.validUntil ? new Date(data.validUntil) : null,
          imageUrl: data.imageUrl || null,
          orderIndex: data.orderIndex,
          translations: {
            create: translationsCreate,
          },
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          translations: true,
          items: true,
        },
      });

      return created;
    });

    await recordAuditLog({
      userId: auth.user.userId,
      action: "CREATE_OFFER",
      entityType: "Offer",
      entityId: offer.id,
      details: {
        slug: offer.slug,
        title: data.title,
        sellingPriceTRY: data.sellingPrice,
        itemsCount: data.items.length,
      },
    });

    return NextResponse.json({ success: true, offer }, { status: 201 });
  } catch (err: any) {
    console.error("[Offers POST Error]:", err);
    return NextResponse.json(
      { error: "Fırsat oluşturulurken bir hata oluştu." },
      { status: 500 }
    );
  }
}
