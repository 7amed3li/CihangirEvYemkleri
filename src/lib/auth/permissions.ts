import { Role } from "@prisma/client";

export type AdminRole = "OWNER" | "MANAGER" | "EDITOR" | "VIEWER";

/**
 * Capability check: Can user perform general write mutations (create/update)?
 * OWNER, MANAGER, EDITOR have write capabilities. VIEWER is strictly read-only.
 */
export function canMutate(role: Role | string): boolean {
  return role === "OWNER" || role === "MANAGER" || role === "EDITOR";
}

/**
 * Capability check: Can user perform deletions of entities?
 * Restricted to OWNER and MANAGER.
 */
export function canDelete(role: Role | string): boolean {
  return role === "OWNER" || role === "MANAGER";
}

/**
 * Capability check: Can user manage admin staff and roles?
 * Strictly restricted to OWNER.
 */
export function canManageUsers(role: Role | string): boolean {
  return role === "OWNER";
}

/**
 * Capability check: Can user publish/unpublish daily menus?
 * OWNER, MANAGER, EDITOR.
 */
export function canManageDailyMenu(role: Role | string): boolean {
  return role === "OWNER" || role === "MANAGER" || role === "EDITOR";
}

/**
 * Capability check: Can user access audit logs and system settings?
 * OWNER and MANAGER.
 */
export function canViewAuditLogs(role: Role | string): boolean {
  return role === "OWNER" || role === "MANAGER";
}
