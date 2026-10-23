import { getSession, SessionPayload } from "./session";
import { canMutate, canDelete, canManageUsers, canManageDailyMenu } from "./permissions";
import { NextResponse } from "next/server";

export type AuthResult =
  | { user: SessionPayload; errorResponse?: never }
  | { user?: never; errorResponse: NextResponse };

/**
 * Ensures the request has a valid active admin session.
 */
export async function requireAuth(): Promise<AuthResult> {
  const session = await getSession();
  if (!session) {
    return {
      errorResponse: NextResponse.json(
        { error: "Yetkisiz erişim. Lütfen giriş yapınız." },
        { status: 401 }
      ),
    };
  }
  return { user: session };
}

/**
 * Ensures the request has write capabilities (OWNER, MANAGER, EDITOR).
 * Reject VIEWER role with 403.
 */
export async function requireMutationAuth(): Promise<AuthResult> {
  const auth = await requireAuth();
  if (auth.errorResponse) return auth;

  if (!canMutate(auth.user.role)) {
    return {
      errorResponse: NextResponse.json(
        { error: "Bu işlem için yazma yetkiniz bulunmamaktadır (Salt okunur erişim)." },
        { status: 403 }
      ),
    };
  }
  return auth;
}

/**
 * Ensures the request has deletion capabilities (OWNER, MANAGER).
 */
export async function requireDeleteAuth(): Promise<AuthResult> {
  const auth = await requireAuth();
  if (auth.errorResponse) return auth;

  if (!canDelete(auth.user.role)) {
    return {
      errorResponse: NextResponse.json(
        { error: "Silme işlemi için yetkiniz bulunmamaktadır (Yönetici yetkisi gerekir)." },
        { status: 403 }
      ),
    };
  }
  return auth;
}

/**
 * Ensures the request is from OWNER.
 */
export async function requireOwnerAuth(): Promise<AuthResult> {
  const auth = await requireAuth();
  if (auth.errorResponse) return auth;

  if (!canManageUsers(auth.user.role)) {
    return {
      errorResponse: NextResponse.json(
        { error: "Bu işlem yalnızca sistem sahibi (OWNER) tarafından gerçekleştirilebilir." },
        { status: 403 }
      ),
    };
  }
  return auth;
}
