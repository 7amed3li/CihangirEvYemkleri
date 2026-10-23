import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { loginSchema } from "@/lib/validation/schemas";
import { verify } from "@node-rs/argon2";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth/session";
import { recordAuditLog } from "@/lib/audit/audit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz e-posta veya şifre." },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const user = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Geçersiz e-posta veya şifre." },
        { status: 401 }
      );
    }

    const isValidPassword = await verify(user.passwordHash, password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Geçersiz e-posta veya şifre." },
        { status: 401 }
      );
    }

    const token = createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    await recordAuditLog({
      userId: user.id,
      action: "ADMIN_LOGIN",
      entityType: "AdminUser",
      entityId: user.id,
      details: { email: user.email, role: user.role },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set({
      ...sessionCookieOptions,
      value: token,
    });

    return response;
  } catch (err: any) {
    console.error("[Login API Error]:", err);
    return NextResponse.json(
      { error: "Giriş yapılırken bir hata oluştu." },
      { status: 500 }
    );
  }
}
