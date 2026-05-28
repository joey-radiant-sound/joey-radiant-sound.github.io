import "server-only";

import { prisma } from "@/lib/db";

/**
 * Authorization gate for per-project resources (Phase 2D files, and
 * anything else that needs "must be a member of this project OR an
 * admin"). Returns true on success. Use the role from `session.user`
 * if you already have it to skip a DB hit; otherwise we fall back to
 * a ProjectMember lookup.
 */
export async function canAccessProject(
  userId: string | null | undefined,
  role: string | null | undefined,
  projectId: string,
): Promise<boolean> {
  if (!userId) return false;
  if (role === "ADMIN") return true;

  // Couples lose access to a wedding once it's archived.
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { archivedAt: true },
  });
  if (!project || project.archivedAt) return false;

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
    select: { id: true },
  });
  return Boolean(member);
}
