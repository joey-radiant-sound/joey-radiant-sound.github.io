"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthedProject, ensureWeddingDetails } from "../_server";

export type CeremonyState = { ok: boolean; message?: string };

function revalidate() {
  revalidatePath("/portal/planning/ceremony");
}

/* ───── Questions on WeddingDetails ───── */

const optStr = z.string().trim().max(500).optional().or(z.literal(""));
const longStr = z.string().trim().max(4000).optional().or(z.literal(""));

const ceremonyQuestionsSchema = z.object({
  ceremonyWalkOutOrder: longStr,
  ceremonyWirelessMic: z.string().optional(),
  ceremonyOutdoors: z.string().optional(),
  ceremonyOtherDetails: longStr,
});

function toBoolNull(v: string | undefined): boolean | null {
  if (v === "true") return true;
  if (v === "false") return false;
  return null;
}

export async function saveCeremonyQuestions(
  _prev: CeremonyState,
  formData: FormData,
): Promise<CeremonyState> {
  const ctx = await getAuthedProject(
    formData.get("projectId")?.toString() || undefined,
  );
  if (!ctx) return { ok: false, message: "Not authorized." };

  const parsed = ceremonyQuestionsSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }
  const d = parsed.data;

  await ensureWeddingDetails(ctx.projectId);
  await prisma.weddingDetails.update({
    where: { projectId: ctx.projectId },
    data: {
      ceremonyWalkOutOrder: d.ceremonyWalkOutOrder || null,
      ceremonyWirelessMic: toBoolNull(d.ceremonyWirelessMic),
      ceremonyOutdoors: toBoolNull(d.ceremonyOutdoors),
      ceremonyOtherDetails: d.ceremonyOtherDetails || null,
    },
  });

  revalidate();
  return { ok: true, message: "Saved." };
}

/* ───── Ceremony music entries ───── */

const segmentUpdateSchema = z.object({
  customLabel: optStr,
  songName: optStr,
  songArtist: optStr,
  notes: longStr,
});

export async function updateCeremonySegment(
  id: string,
  formData: FormData,
): Promise<CeremonyState> {
  const ctx = await getAuthedProject(
    formData.get("projectId")?.toString() || undefined,
  );
  if (!ctx) return { ok: false, message: "Not authorized." };

  const parsed = segmentUpdateSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }
  const d = parsed.data;

  await prisma.ceremonyMusicEntry.updateMany({
    where: { id, projectId: ctx.projectId },
    data: {
      customLabel: d.customLabel || null,
      songName: d.songName || null,
      songArtist: d.songArtist || null,
      notes: d.notes || null,
    },
  });

  revalidate();
  return { ok: true };
}

const customAddSchema = z.object({
  customLabel: z.string().trim().min(1, "Label required").max(200),
  songName: optStr,
  songArtist: optStr,
  notes: longStr,
});

export async function addCustomCeremonySegment(
  _prev: CeremonyState,
  formData: FormData,
): Promise<CeremonyState> {
  const ctx = await getAuthedProject(
    formData.get("projectId")?.toString() || undefined,
  );
  if (!ctx) return { ok: false, message: "Not authorized." };

  const parsed = customAddSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }
  const d = parsed.data;

  const last = await prisma.ceremonyMusicEntry.findFirst({
    where: { projectId: ctx.projectId },
    orderBy: { sortOrder: "desc" },
  });

  await prisma.ceremonyMusicEntry.create({
    data: {
      projectId: ctx.projectId,
      segment: "CUSTOM",
      customLabel: d.customLabel,
      songName: d.songName || null,
      songArtist: d.songArtist || null,
      notes: d.notes || null,
      sortOrder: (last?.sortOrder ?? 0) + 10,
    },
  });

  revalidate();
  return { ok: true };
}

export async function deleteCeremonySegment(
  projectId: string,
  id: string,
): Promise<void> {
  const ctx = await getAuthedProject(projectId);
  if (!ctx) return;
  await prisma.ceremonyMusicEntry.deleteMany({
    where: { id, projectId: ctx.projectId, segment: "CUSTOM" },
  });
  revalidate();
}
