"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthedProject } from "../_server";

export type LineDanceState = { ok: boolean; message?: string };

function revalidate() {
  revalidatePath("/portal/planning/line-dances");
}

export async function toggleLineDance(
  id: string,
  wanted: boolean,
): Promise<void> {
  const ctx = await getAuthedProject();
  if (!ctx) return;
  await prisma.lineDance.updateMany({
    where: { id, projectId: ctx.projectId },
    data: { wanted },
  });
  revalidate();
}

const addSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(200),
});

export async function addLineDance(
  _prev: LineDanceState,
  formData: FormData,
): Promise<LineDanceState> {
  const ctx = await getAuthedProject();
  if (!ctx) return { ok: false, message: "Not authorized." };

  const parsed = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const last = await prisma.lineDance.findFirst({
    where: { projectId: ctx.projectId },
    orderBy: { sortOrder: "desc" },
  });

  await prisma.lineDance.create({
    data: {
      projectId: ctx.projectId,
      name: parsed.data.name,
      wanted: true,
      isDefault: false,
      sortOrder: (last?.sortOrder ?? 0) + 10,
    },
  });

  revalidate();
  return { ok: true };
}

export async function deleteLineDance(id: string): Promise<void> {
  const ctx = await getAuthedProject();
  if (!ctx) return;
  await prisma.lineDance.deleteMany({
    where: { id, projectId: ctx.projectId, isDefault: false },
  });
  revalidate();
}
