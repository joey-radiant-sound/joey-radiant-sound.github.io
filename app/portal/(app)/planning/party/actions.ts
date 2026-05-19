"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthedProject, ensureWeddingDetails } from "../_server";

export type PartyState = { ok: boolean; message?: string };

function revalidate() {
  revalidatePath("/portal/planning/party");
}

/* ───── announceWeddingParty toggle (lives on WeddingDetails) ───── */

export async function setAnnounceWeddingParty(
  value: boolean,
): Promise<PartyState> {
  const ctx = await getAuthedProject();
  if (!ctx) return { ok: false, message: "Not authorized." };
  await ensureWeddingDetails(ctx.projectId);
  await prisma.weddingDetails.update({
    where: { projectId: ctx.projectId },
    data: { announceWeddingParty: value },
  });
  revalidate();
  return { ok: true };
}

/* ───── repeating wedding-party rows ───── */

const memberSchema = z.object({
  bridesmaidName: z.string().trim().max(200).optional().or(z.literal("")),
  groomsmanName: z.string().trim().max(200).optional().or(z.literal("")),
  title: z.string().trim().max(100).optional().or(z.literal("")),
  songName: z.string().trim().max(200).optional().or(z.literal("")),
  songArtist: z.string().trim().max(200).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export async function addPartyMember(
  _prev: PartyState,
  formData: FormData,
): Promise<PartyState> {
  const ctx = await getAuthedProject();
  if (!ctx) return { ok: false, message: "Not authorized." };

  const parsed = memberSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }
  const d = parsed.data;

  const last = await prisma.weddingPartyMember.findFirst({
    where: { projectId: ctx.projectId },
    orderBy: { sortOrder: "desc" },
  });

  await prisma.weddingPartyMember.create({
    data: {
      projectId: ctx.projectId,
      bridesmaidName: d.bridesmaidName || null,
      groomsmanName: d.groomsmanName || null,
      title: d.title || null,
      songName: d.songName || null,
      songArtist: d.songArtist || null,
      notes: d.notes || null,
      sortOrder: (last?.sortOrder ?? 0) + 10,
    },
  });

  revalidate();
  return { ok: true };
}

export async function deletePartyMember(id: string): Promise<void> {
  const ctx = await getAuthedProject();
  if (!ctx) return;
  await prisma.weddingPartyMember.deleteMany({
    where: { id, projectId: ctx.projectId },
  });
  revalidate();
}
