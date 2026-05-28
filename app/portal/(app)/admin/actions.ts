"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type AdminActionState = { ok: boolean; message?: string };

async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (session?.user as any)?.role === "ADMIN";
}

/**
 * Archive a wedding. Hides it from the active admin list and (via
 * canAccessProject + the planning resolver) locks its couple members
 * out of the portal. Reversible with unarchiveProject.
 */
export async function archiveProject(id: string): Promise<AdminActionState> {
  if (!(await requireAdmin())) return { ok: false, message: "Not authorized." };
  await prisma.project.update({
    where: { id },
    data: { archivedAt: new Date() },
  });
  revalidatePath("/portal/admin");
  revalidatePath("/portal/admin/archive");
  revalidatePath(`/portal/admin/projects/${id}`);
  return { ok: true };
}

export async function unarchiveProject(id: string): Promise<AdminActionState> {
  if (!(await requireAdmin())) return { ok: false, message: "Not authorized." };
  await prisma.project.update({
    where: { id },
    data: { archivedAt: null },
  });
  revalidatePath("/portal/admin");
  revalidatePath("/portal/admin/archive");
  revalidatePath(`/portal/admin/projects/${id}`);
  return { ok: true };
}
