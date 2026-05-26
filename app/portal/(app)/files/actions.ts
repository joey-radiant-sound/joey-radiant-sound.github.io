"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canAccessProject } from "@/lib/project-access";
import { deleteFromDisk } from "@/lib/files";

export type FilesActionState = { ok: boolean; message?: string };

function revalidateBoth(projectId: string) {
  revalidatePath("/portal/files");
  revalidatePath(`/portal/admin/projects/${projectId}`);
}

/**
 * Delete a ProjectFile. Allowed for the original uploader OR any
 * ADMIN. Couples can't delete each other's uploads even on the same
 * project — only the uploader can.
 */
export async function deleteProjectFile(
  id: string,
): Promise<FilesActionState> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, message: "Not authorized." };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session.user as any).role as string | undefined;

  const file = await prisma.projectFile.findUnique({ where: { id } });
  if (!file) return { ok: true }; // already gone

  const allowed =
    role === "ADMIN" ||
    (file.uploadedById === session.user.id &&
      (await canAccessProject(session.user.id, role, file.projectId)));
  if (!allowed) return { ok: false, message: "Not authorized." };

  // DB row first; on success unlink from disk. Order matters — if the
  // disk unlink fails we'd rather have a stale file than a phantom row.
  await prisma.projectFile.delete({ where: { id } });
  await deleteFromDisk(file.projectId, file.storageKey);

  revalidateBoth(file.projectId);
  return { ok: true };
}
