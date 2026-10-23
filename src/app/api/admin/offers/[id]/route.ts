import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, requireMutationAuth, requireDeleteAuth } from "@/lib/auth/server-guard";
import { offerSchema } from "@/lib/validation/schemas";
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
    const offer = await prisma.offer.findUnique({
      where: { id },
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
    });

    if (!offer) {
      return NextResponse.json({ error: "Fırsat bulunamadı." }, { status: 404 });
    }

    const trTrans = offer.translations.find((t) => t.locale === "tr");
    const enTrans = offer.translations.find((t) => t.locale === "en");
    const arTrans = offer.translations.find((t) => t.locale === "ar");

    return NextResponse.json({
      offer: {
        id: offer.id,
        slug: offer.slug,
        sellingPriceTRY: Number(offer.sellingPrice),
        isActive: offer.isActive,
        validFrom: offer.validFrom ? offer.validFrom.toISOString().split("T")[0] : null,
        validUntil: offer.validUntil ? offer.validUntil.toISOString().split("T")[0] : null,
        imageUrl: offer.imageUrl,
        orderIndex: offer.orderIndex,
        title: trTrans?.title || offer.slug,
        description: trTrans?.description || "",
        title_en: enTrans?.title || "",
        title_ar: arTrans?.title || "",
        items: offer.items.map((it) => ({
          id: it.id,
          productId: it.productId,
          quantity: it.quantity,
          productName: it.product.translations[0]?.name || it.product.slug,
          productPriceTRY: Number(it.product.basePriceTRY),
        })),
      },
    });
  } catch (err: any) {
    console.error("[Offer GET [id] Error]:", err);
    return NextResponse.json({ error: "Fırsat getirilemedi." }, { status: 500 });
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
    const existing = await prisma.offer.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Fırsat bulunamadı." }, { status: 404 });
    }

    const body = await req.json();
    const parsed = offerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz teklif bilgileri." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check slug conflict
    if (data.slug !== existing.slug) {
      const slugConflict = await prisma.offer.findUnique({
        where: { slug: data.slug },
      });
      if (slugConflict && slugConflict.id !== id) {
        return NextResponse.json(
          { error: `"${data.slug}" slugı başka bir fırsat tarafından kullanılmaktadır.` },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const off = await tx.offer.update({
        where: { id },
        data: {
          slug: data.slug,
          sellingPrice: new Prisma.Decimal(data.sellingPrice),
          isActive: data.isActive,
          validFrom: data.validFrom ? new Date(data.validFrom) : null,
          validUntil: data.validUntil ? new Date(data.validUntil) : null,
          imageUrl: data.imageUrl || null,
          orderIndex: data.orderIndex,
        },
      });

      // Update Turkish translation
      await tx.offerTranslation.upsert({
        where: { offerId_locale: { offerId: id, locale: "tr" } },
        update: { title: data.title, description: data.description || null },
        create: { offerId: id, locale: "tr", title: data.title, description: data.description || null },
      });

      // Update English translation
      if (data.title_en) {
        await tx.offerTranslation.upsert({
          where: { offerId_locale: { offerId: id, locale: "en" } },
          update: { title: data.title_en, description: data.description || null },
          create: { offerId: id, locale: "en", title: data.title_en, description: data.description || null },
        });
      }

      // Update Arabic translation
      if (data.title_ar) {
        await tx.offerTranslation.upsert({
          where: { offerId_locale: { offerId: id, locale: "ar" } },
          update: { title: data.title_ar, description: data.description || null },
          create: { offerId: id, locale: "ar", title: data.title_ar, description: data.description || null },
        });
      }

      // Re-create items
      await tx.offerItem.deleteMany({
        where: { offerId: id },
      });

      await tx.offerItem.createMany({
        data: data.items.map((item) => ({
          offerId: id,
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      return off;
    });

    await recordAuditLog({
      userId: auth.user.userId,
      action: "UPDATE_OFFER",
      entityType: "Offer",
      entityId: id,
      details: { slug: updated.slug, title: data.title, sellingPriceTRY: data.sellingPrice },
    });

    return NextResponse.json({ success: true, offer: updated });
  } catch (err: any) {
    console.error("[Offer PUT Error]:", err);
    return NextResponse.json(
      { error: "Fırsat güncellenirken bir hata oluştu." },
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
    const offer = await prisma.offer.findUnique({
      where: { id },
    });

    if (!offer) {
      return NextResponse.json({ error: "Silinecek fırsat bulunamadı." }, { status: 404 });
    }

    await prisma.offer.delete({
      where: { id },
    });

    await recordAuditLog({
      userId: auth.user.userId,
      action: "DELETE_OFFER",
      entityType: "Offer",
      entityId: id,
      details: { slug: offer.slug },
    });

    return NextResponse.json({
      success: true,
      deleted: true,
      message: "Fırsat başarıyla silindi.",
    });
  } catch (err: any) {
    console.error("[Offer DELETE Error]:", err);
    return NextResponse.json(
      { error: "Fırsat silinirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
