"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthedProject, ensureWeddingDetails } from "../_server";

export type EventsState = { ok: boolean; message?: string };

function revalidate() {
  revalidatePath("/portal/planning/events");
}

/* ───── Question answers (live on WeddingDetails) ───── */

const optStr = z.string().trim().max(500).optional().or(z.literal(""));
const longStr = z.string().trim().max(4000).optional().or(z.literal(""));

const questionsSchema = z.object({
  takeAudienceRequests: z.string().optional(), // "true" | "false" | undefined
  cocktailGenre: optStr,
  receptionGenres: optStr,
  announceLastCall: z.string().optional(),
  announceShuttle: z.string().optional(),
  shuttleTimes: optStr,
  coupleAnnouncement: longStr,
  miscDetails: longStr,
});

function toBoolNull(v: string | undefined): boolean | null {
  if (v === "true") return true;
  if (v === "false") return false;
  return null;
}

export async function saveQuestions(
  _prev: EventsState,
  formData: FormData,
): Promise<EventsState> {
  const ctx = await getAuthedProject(
    formData.get("projectId")?.toString() || undefined,
  );
  if (!ctx) return { ok: false, message: "Not authorized." };

  const parsed = questionsSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }
  const d = parsed.data;

  const shuttleOn = toBoolNull(d.announceShuttle);

  await ensureWeddingDetails(ctx.projectId);
  await prisma.weddingDetails.update({
    where: { projectId: ctx.projectId },
    data: {
      takeAudienceRequests: toBoolNull(d.takeAudienceRequests),
      cocktailGenre: d.cocktailGenre || null,
      receptionGenres: d.receptionGenres || null,
      announceLastCall: toBoolNull(d.announceLastCall),
      announceShuttle: shuttleOn,
      // Only persist the time when shuttle announcements are on.
      shuttleTimes: shuttleOn === true ? d.shuttleTimes || null : null,
      coupleAnnouncement: d.coupleAnnouncement || null,
      miscDetails: d.miscDetails || null,
    },
  });

  revalidate();
  return { ok: true, message: "Saved." };
}

/* ───── Event announcements (per-row inline save) ───── */

const announcementUpdateSchema = z.object({
  customTitle: optStr,
  peopleInvolved: optStr,
  songName: optStr,
  songArtist: optStr,
  notes: longStr,
});

export async function updateAnnouncement(
  id: string,
  formData: FormData,
): Promise<EventsState> {
  const ctx = await getAuthedProject(
    formData.get("projectId")?.toString() || undefined,
  );
  if (!ctx) return { ok: false, message: "Not authorized." };

  const parsed = announcementUpdateSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }
  const d = parsed.data;

  await prisma.eventAnnouncement.updateMany({
    where: { id, projectId: ctx.projectId },
    data: {
      customTitle: d.customTitle || null,
      peopleInvolved: d.peopleInvolved || null,
      songName: d.songName || null,
      songArtist: d.songArtist || null,
      notes: d.notes || null,
    },
  });

  revalidate();
  return { ok: true };
}

const customAddSchema = z.object({
  customTitle: z.string().trim().min(1, "Title required").max(200),
  peopleInvolved: optStr,
  songName: optStr,
  songArtist: optStr,
  notes: longStr,
});

export async function addCustomAnnouncement(
  _prev: EventsState,
  formData: FormData,
): Promise<EventsState> {
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

  const last = await prisma.eventAnnouncement.findFirst({
    where: { projectId: ctx.projectId },
    orderBy: { sortOrder: "desc" },
  });

  await prisma.eventAnnouncement.create({
    data: {
      projectId: ctx.projectId,
      eventKey: "CUSTOM",
      customTitle: d.customTitle,
      peopleInvolved: d.peopleInvolved || null,
      songName: d.songName || null,
      songArtist: d.songArtist || null,
      notes: d.notes || null,
      sortOrder: (last?.sortOrder ?? 0) + 10,
    },
  });

  revalidate();
  return { ok: true };
}

export async function deleteAnnouncement(
  projectId: string,
  id: string,
): Promise<void> {
  const ctx = await getAuthedProject(projectId);
  if (!ctx) return;
  await prisma.eventAnnouncement.deleteMany({
    where: { id, projectId: ctx.projectId, eventKey: "CUSTOM" },
  });
  revalidate();
}

/* ───── Playlists (3 buckets via listType) ───── */

const songSchema = z.object({
  listType: z.enum(["COCKTAIL_DINNER", "RECEPTION_PLAYLIST", "DO_NOT_PLAY"]),
  songName: z.string().trim().min(1, "Song name required").max(200),
  songArtist: optStr,
  notes: longStr,
});

export async function addPlaylistSong(
  _prev: EventsState,
  formData: FormData,
): Promise<EventsState> {
  const ctx = await getAuthedProject(
    formData.get("projectId")?.toString() || undefined,
  );
  if (!ctx) return { ok: false, message: "Not authorized." };

  const parsed = songSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }
  const d = parsed.data;

  const last = await prisma.playlistSong.findFirst({
    where: { projectId: ctx.projectId, listType: d.listType },
    orderBy: { sortOrder: "desc" },
  });

  await prisma.playlistSong.create({
    data: {
      projectId: ctx.projectId,
      listType: d.listType,
      songName: d.songName,
      songArtist: d.songArtist || null,
      notes: d.notes || null,
      sortOrder: (last?.sortOrder ?? 0) + 10,
    },
  });

  revalidate();
  return { ok: true };
}

const songUpdateSchema = z.object({
  songName: z.string().trim().min(1, "Song name required").max(200),
  songArtist: optStr,
  notes: longStr,
});

export async function updatePlaylistSong(
  id: string,
  formData: FormData,
): Promise<EventsState> {
  const ctx = await getAuthedProject(
    formData.get("projectId")?.toString() || undefined,
  );
  if (!ctx) return { ok: false, message: "Not authorized." };

  const parsed = songUpdateSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }
  const d = parsed.data;

  await prisma.playlistSong.updateMany({
    where: { id, projectId: ctx.projectId },
    data: {
      songName: d.songName,
      songArtist: d.songArtist || null,
      notes: d.notes || null,
    },
  });

  revalidate();
  return { ok: true };
}

export async function deletePlaylistSong(
  projectId: string,
  id: string,
): Promise<void> {
  const ctx = await getAuthedProject(projectId);
  if (!ctx) return;
  await prisma.playlistSong.deleteMany({
    where: { id, projectId: ctx.projectId },
  });
  revalidate();
}
