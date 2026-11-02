import { NextResponse } from "next/server";
import { requireMutationAuth } from "@/lib/auth/server-guard";
import { seedDatabaseMenu } from "@/lib/db/seed-menu";
import { recordAuditLog } from "@/lib/audit/audit";

export async function POST() {
  const auth = await requireMutationAuth();
  if (auth.errorResponse) return auth.errorResponse;

  if (auth.user.role !== "OWNER") {
    return NextResponse.json(
      { error: "Bu işlemi yalnızca restoran sahibi (OWNER) gerçekleştirebilir." },
      { status: 403 }
    );
  }

  try {
    const result = await seedDatabaseMenu(true);
    await recordAuditLog({
      userId: auth.user.userId,
      action: "MANUAL_MENU_RESEED",
      entityType: "Product",
      entityId: "all",
      details: { seededCount: result.count },
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} ürün ve kategoriler başarıyla veritabanına aktarıldı.`,
      count: result.count,
    });
  } catch (err: any) {
    console.error("[Manual Seed Error]:", err);
    return NextResponse.json(
      { error: err?.message || "Menü aktarımı sırasında hata oluştu." },
      { status: 500 }
    );
  }
}

