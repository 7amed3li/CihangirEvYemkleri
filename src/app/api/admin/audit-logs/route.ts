import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/server-guard";
import { canViewAuditLogs } from "@/lib/auth/permissions";

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (auth.errorResponse) return auth.errorResponse;

  if (!canViewAuditLogs(auth.user.role)) {
    return NextResponse.json(
      { error: "İşlem geçmişini görüntüleme yetkiniz bulunmamaktadır." },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "30", 10)));

    const logs = await prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true, role: true },
        },
      },
    });

    return NextResponse.json({
      auditLogs: logs.map((l) => ({
        id: l.id,
        action: l.action,
        entityType: l.entityType,
        entityId: l.entityId,
        details: l.details,
        createdAt: l.createdAt,
        user: l.user ? { name: l.user.name, role: l.user.role, email: l.user.email } : null,
      })),
    });
  } catch (err: any) {
    console.error("[AuditLogs GET Error]:", err);
    return NextResponse.json(
      { error: "Kayıtlar listelenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
