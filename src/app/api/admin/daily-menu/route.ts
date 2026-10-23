import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth, requireMutationAuth } from "@/lib/auth/server-guard";
import { dailyMenuSchema } from "@/lib/validation/schemas";
import { recordAuditLog } from "@/lib/audit/audit";
import { getIstanbulDateString } from "@/lib/date";

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { searchParams } = new URL(req.url);
    const dateString = searchParams.get("dateString") || getIstanbulDateString();

    const dailyMenu = await prisma.dailyMenu.findUnique({
      where: { dateString },
      include: {
        entries: {
          orderBy: { displayOrder: "asc" },
          include: {
            product: {
              include: {
                category: {
                  select: { slug: true, translations: { where: { locale: "tr" }, select: { name: true } } },
                },
                translations: { where: { locale: "tr" }, select: { name: true } },
              },
            },
          },
        },
      },
    });

    if (!dailyMenu) {
      return NextResponse.json({
        dailyMenu: {
          dateString,
          notes: "",
          isPublished: false,
          entries: [],
          isExisting: false,
        },
      });
    }

    const formattedEntries = dailyMenu.entries.map((e) => ({
      id: e.id,
      productId: e.productId,
      displayOrder: e.displayOrder,
      productName: e.product.translations[0]?.name || e.product.slug,
      categoryName: e.product.category.translations[0]?.name || e.product.category.slug,
      basePriceTRY: Number(e.product.basePriceTRY),
      isAvailable: e.product.isAvailable,
      isActive: e.product.isActive,
      imageUrl: e.product.imageUrl,
    }));

    return NextResponse.json({
      dailyMenu: {
        id: dailyMenu.id,
        dateString: dailyMenu.dateString,
        notes: dailyMenu.notes || "",
        isPublished: dailyMenu.isPublished,
        entries: formattedEntries,
        isExisting: true,
        updatedAt: dailyMenu.updatedAt,
      },
    });
  } catch (err: any) {
    console.error("[Daily Menu GET Error]:", err);
    return NextResponse.json(
      { error: "Günün menüsü yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await requireMutationAuth();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const parsed = dailyMenuSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz menü verileri." },
        { status: 400 }
      );
    }

    const { dateString, notes, isPublished, productIds } = parsed.data;

    // Verify products eligibility: only active and available products can be published
    if (productIds.length > 0) {
      const selectedProducts = await prisma.product.findMany({
        where: { id: { in: productIds } },
        include: {
          translations: { where: { locale: "tr" }, select: { name: true } },
        },
      });

      const ineligible = selectedProducts.filter((p) => !p.isActive || !p.isAvailable);
      if (ineligible.length > 0) {
        const names = ineligible.map((p) => p.translations[0]?.name || p.slug).join(", ");
        return NextResponse.json(
          {
            error: `Günün menüsüne yalnızca aktif ve satışa uygun ürünler eklenebilir. Şu ürünler uygun değildir: ${names}`,
          },
          { status: 400 }
        );
      }
    }

    // Transactionally upsert daily menu and replace its entries
    const updated = await prisma.$transaction(async (tx) => {
      const menu = await tx.dailyMenu.upsert({
        where: { dateString },
        update: {
          notes: notes || null,
          isPublished,
          updatedBy: auth.user.email,
        },
        create: {
          dateString,
          notes: notes || null,
          isPublished,
          updatedBy: auth.user.email,
        },
      });

      // Clear existing entries
      await tx.dailyMenuEntry.deleteMany({
        where: { dailyMenuId: menu.id },
      });

      // Create new ordered entries
      if (productIds.length > 0) {
        await tx.dailyMenuEntry.createMany({
          data: productIds.map((prodId, idx) => ({
            dailyMenuId: menu.id,
            productId: prodId,
            displayOrder: idx + 1,
          })),
        });
      }

      return menu;
    });

    await recordAuditLog({
      userId: auth.user.userId,
      action: isPublished ? "PUBLISH_DAILY_MENU" : "UPDATE_DAILY_MENU",
      entityType: "DailyMenu",
      entityId: updated.id,
      details: {
        dateString,
        itemCount: productIds.length,
        isPublished,
      },
    });

    return NextResponse.json({
      success: true,
      dailyMenu: updated,
      message: isPublished ? "Günün menüsü başarıyla yayınlandı." : "Günün menüsü taslak olarak kaydedildi.",
    });
  } catch (err: any) {
    console.error("[Daily Menu POST Error]:", err);
    return NextResponse.json(
      { error: "Günün menüsü kaydedilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
