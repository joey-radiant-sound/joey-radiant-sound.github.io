"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type MilestoneState = { ok: boolean; message?: string };

async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (session?.user as any)?.role === "ADMIN";
}

function revalidate(projectId: string) {
  revalidatePath("/portal/timeline");
  revalidatePath(`/portal/admin/projects/${projectId}`);
}

const addSchema = z.object({
  title: z.string().trim().min(1, "Title required").max(200),
  dueAt: z.string().trim().max(40).optional().or(z.literal("")),
});

export async function addMilestone(
  projectId: string,
  _prev: MilestoneState,
  formData: FormData,
): Promise<MilestoneState> {
  if (!(await requireAdmin())) return { ok: false, message: "Not authorized." };

  const parsed = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const last = await prisma.milestone.findFirst({
    where: { projectId },
    orderBy: { sortOrder: "desc" },
  });
  await prisma.milestone.create({
    data: {
      projectId,
      title: parsed.data.title,
      dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
      sortOrder: (last?.sortOrder ?? 0) + 10,
    },
  });

  revalidate(projectId);
  return { ok: true };
}

export async function toggleMilestone(id: string): Promise<MilestoneState> {
  if (!(await requireAdmin())) return { ok: false, message: "Not authorized." };
  const m = await prisma.milestone.findUnique({ where: { id } });
  if (!m) return { ok: true };
  await prisma.milestone.update({
    where: { id },
    data: { done: !m.done },
  });
  revalidate(m.projectId);
  return { ok: true };
}

export async function deleteMilestone(id: string): Promise<MilestoneState> {
  if (!(await requireAdmin())) return { ok: false, message: "Not authorized." };
  const m = await prisma.milestone.findUnique({ where: { id } });
  if (!m) return { ok: true };
  await prisma.milestone.delete({ where: { id } });
  revalidate(m.projectId);
  return { ok: true };
}
