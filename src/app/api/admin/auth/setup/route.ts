import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { setupSchema } from "@/lib/validation/schemas";
import { hash } from "@node-rs/argon2";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth/session";
import { recordAuditLog } from "@/lib/audit/audit";

export async function POST(req: Request) {
  try {
    // 1. Guard against unauthorized multiple owner creations:
    // This endpoint strictly operates only when zero admin users exist in the database.
    const userCount = await prisma.adminUser.count();
    if (userCount > 0) {
      return NextResponse.json(
        { error: "Kurulum kalıcı olarak devre dışıdır. Yönetici hesabı zaten mevcuttur." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = setupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz veriler." },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const passwordHash = await hash(password);

    const newOwner = await prisma.adminUser.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role: "OWNER",
        isActive: true,
      },
    });

    await recordAuditLog({
      userId: newOwner.id,
      action: "INITIAL_SETUP_OWNER_CREATED",
      entityType: "AdminUser",
      entityId: newOwner.id,
      details: { email: newOwner.email, role: "OWNER" },
    });

    const token = createSessionToken({
      id: newOwner.id,
      email: newOwner.email,
      name: newOwner.name,
      role: newOwner.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newOwner.id,
        name: newOwner.name,
        email: newOwner.email,
        role: newOwner.role,
      },
    });

    response.cookies.set({
      ...sessionCookieOptions,
      value: token,
    });

    return response;
  } catch (err: any) {
    console.error("[Setup API Error]:", err);
    return NextResponse.json(
      { error: "Sistem kurulumu sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
