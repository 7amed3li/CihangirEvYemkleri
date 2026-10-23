import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireOwnerAuth } from "@/lib/auth/server-guard";
import { adminUserCreateSchema } from "@/lib/validation/schemas";
import { hash } from "@node-rs/argon2";
import { recordAuditLog } from "@/lib/audit/audit";

export async function GET() {
  const auth = await requireOwnerAuth();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (err: any) {
    console.error("[Users GET Error]:", err);
    return NextResponse.json({ error: "Kullanıcılar yüklenemedi." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await requireOwnerAuth();
  if (auth.errorResponse) return auth.errorResponse;

  try {
    const body = await req.json();
    const parsed = adminUserCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Geçersiz kullanıcı bilgileri." },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;

    const existing = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Bu e-posta adresine sahip bir kullanıcı zaten kayıtlı." },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password);
    const newUser = await prisma.adminUser.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    await recordAuditLog({
      userId: auth.user.userId,
      action: "CREATE_ADMIN_USER",
      entityType: "AdminUser",
      entityId: newUser.id,
      details: { email: newUser.email, role: newUser.role },
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (err: any) {
    console.error("[Users POST Error]:", err);
    return NextResponse.json({ error: "Kullanıcı oluşturulurken bir hata oluştu." }, { status: 500 });
  }
}
