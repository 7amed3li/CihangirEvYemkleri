import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/server-guard";

export async function GET() {
  const auth = await requireAuth();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isAvailable: true,
      },
      include: {
        category: {
          select: {
            id: true,
            slug: true,
            translations: { where: { locale: "tr" }, select: { name: true } },
          },
        },
        translations: {
          where: { locale: "tr" },
          select: { name: true },
        },
      },
      orderBy: [
        { category: { orderIndex: "asc" } },
        { orderIndex: "asc" },
      ],
    });

    const eligible = products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.translations[0]?.name || p.slug,
      categoryName: p.category.translations[0]?.name || p.category.slug,
      basePriceTRY: Number(p.basePriceTRY),
      imageUrl: p.imageUrl,
    }));

    return NextResponse.json({ eligibleProducts: eligible });
  } catch (err: any) {
    console.error("[Eligible Products GET Error]:", err);
    return NextResponse.json(
      { error: "Uygun ürünler listelenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
