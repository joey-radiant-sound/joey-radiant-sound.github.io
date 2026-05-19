"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthedProject } from "../_server";

export type ItineraryState = { ok: boolean; message?: string };

function revalidate() {
  revalidatePath("/portal/planning/itinerary");
}

const optStr = z.string().trim().max(500).optional().or(z.literal(""));

const updateSchema = z.object({
  time: z.string().trim().max(40).optional().or(z.literal("")),
  event: optStr,
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export async function updateItineraryItem(
  id: string,
  formData: FormData,
): Promise<ItineraryState> {
  const ctx = await getAuthedProject();
  if (!ctx) return { ok: false, message: "Not authorized." };

  const parsed = updateSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  await prisma.itineraryItem.updateMany({
    where: { id, projectId: ctx.projectId },
    data: {
      time: parsed.data.time || "",
      event: parsed.data.event || null,
      notes: parsed.data.notes || null,
    },
  });

  revalidate();
  return { ok: true };
}

const addSchema = z.object({
  time: z.string().trim().min(1, "Time required").max(40),
  event: optStr,
  notes: optStr,
});

export async function addItineraryItem(
  _prev: ItineraryState,
  formData: FormData,
): Promise<ItineraryState> {
  const ctx = await getAuthedProject();
  if (!ctx) return { ok: false, message: "Not authorized." };

  const parsed = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const last = await prisma.itineraryItem.findFirst({
    where: { projectId: ctx.projectId },
    orderBy: { sortOrder: "desc" },
  });

  await prisma.itineraryItem.create({
    data: {
      projectId: ctx.projectId,
      time: parsed.data.time,
      event: parsed.data.event || null,
      notes: parsed.data.notes || null,
      sortOrder: (last?.sortOrder ?? 0) + 10,
    },
  });

  revalidate();
  return { ok: true };
}

export async function deleteItineraryItem(id: string): Promise<void> {
  const ctx = await getAuthedProject();
  if (!ctx) return;
  await prisma.itineraryItem.deleteMany({
    where: { id, projectId: ctx.projectId },
  });
  revalidate();
}
