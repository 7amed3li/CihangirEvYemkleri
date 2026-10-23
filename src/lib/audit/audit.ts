import { prisma } from "@/lib/db/prisma";

export interface AuditLogParams {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, any> | string | null;
}

/**
 * Persists an administrative action into the AuditLog table.
 * Designed to never throw or break the parent flow if audit logging encounters a secondary failure.
 */
export async function recordAuditLog({
  userId,
  action,
  entityType,
  entityId,
  details,
}: AuditLogParams): Promise<void> {
  try {
    const formattedDetails =
      typeof details === "object" && details !== null
        ? JSON.stringify(details)
        : details || null;

    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        entityType,
        entityId: entityId || null,
        details: formattedDetails,
      },
    });
  } catch (err) {
    console.error("[AuditLog Error] Failed to persist audit entry:", err);
  }
}
