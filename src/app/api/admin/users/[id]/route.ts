import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireOwnerAuth } from "@/lib/auth/server-guard";
import { adminUserUpdateSchema } from "@/lib/validation/schemas";
import { hash } from "@node-rs/argon2";
import { recordAuditLog } from "@/lib/audit/audit";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireOwnerAuth();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await params;
    const existing = await prisma.adminUser.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    const body = await req.json();
    const parsed = adminUserUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz veriler." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Prevent OWNER from disabling their own account if they are the only OWNER
    if (id === auth.user.userId) {
      if (data.isActive === false) {
        return NextResponse.json(
          { error: "Kendi yönetici hesabınızı pasife alamazsınız." },
          { status: 400 }
        );
      }
      if (data.role && data.role !== "OWNER") {
        return NextResponse.json(
          { error: "Kendi OWNER rolünüzü değiştiremezsiniz." },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email.toLowerCase().trim();
    if (data.role) updateData.role = data.role;
    if (typeof data.isActive === "boolean") updateData.isActive = data.isActive;
    if (data.password && data.password.length >= 6) {
      updateData.passwordHash = await hash(data.password);
    }

    const updated = await prisma.adminUser.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    await recordAuditLog({
      userId: auth.user.userId,
      action: "UPDATE_ADMIN_USER",
      entityType: "AdminUser",
      entityId: id,
      details: { email: updated.email, role: updated.role, isActive: updated.isActive },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    console.error("[User PATCH Error]:", err);
    return NextResponse.json({ error: "Kullanıcı güncellenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireOwnerAuth();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const { id } = await params;

    if (id === auth.user.userId) {
      return NextResponse.json(
        { error: "Kendi yönetici hesabınızı silemezsiniz." },
        { status: 400 }
      );
    }

    const user = await prisma.adminUser.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    await prisma.adminUser.delete({ where: { id } });

    await recordAuditLog({
      userId: auth.user.userId,
      action: "DELETE_ADMIN_USER",
      entityType: "AdminUser",
      entityId: id,
      details: { email: user.email },
    });

    return NextResponse.json({ success: true, message: "Kullanıcı silindi." });
  } catch (err: any) {
    console.error("[User DELETE Error]:", err);
    return NextResponse.json({ error: "Kullanıcı silinemedi." }, { status: 500 });
  }
}
