import "server-only";

import type { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  DEFAULT_EVENT_ANNOUNCEMENTS,
  DEFAULT_CEREMONY_SEGMENTS,
  DEFAULT_LINE_DANCES,
  DEFAULT_ITINERARY_TIMES,
} from "./_constants";

/* ───────── auth + project helpers ───────── */

export async function getAuthedProject() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const membership = await prisma.projectMember.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  if (!membership) return null;
  return { userId: session.user.id, projectId: membership.projectId };
}

/* ───────── idempotent seeders ───────── */

export async function seedLineDances(projectId: string): Promise<void> {
  const existing = await prisma.lineDance.count({ where: { projectId } });
  if (existing > 0) return;
  await prisma.lineDance.createMany({
    data: DEFAULT_LINE_DANCES.map((name, idx) => ({
      projectId,
      name,
      wanted: false,
      isDefault: true,
      sortOrder: idx * 10,
    })),
  });
}

export async function seedItinerary(projectId: string): Promise<void> {
  const existing = await prisma.itineraryItem.count({ where: { projectId } });
  if (existing > 0) return;
  await prisma.itineraryItem.createMany({
    data: DEFAULT_ITINERARY_TIMES.map((time, idx) => ({
      projectId,
      time,
      event: null,
      notes: null,
      sortOrder: idx * 10,
    })),
  });
}

export async function seedEventAnnouncements(projectId: string): Promise<void> {
  const existing = await prisma.eventAnnouncement.count({ where: { projectId } });
  if (existing > 0) return;
  await prisma.eventAnnouncement.createMany({
    data: DEFAULT_EVENT_ANNOUNCEMENTS.map((e, idx) => ({
      projectId,
      eventKey: e.eventKey,
      sortOrder: idx * 10,
    })),
  });
}

export async function seedCeremonyMusic(projectId: string): Promise<void> {
  const existing = await prisma.ceremonyMusicEntry.count({
    where: { projectId },
  });
  if (existing > 0) return;
  await prisma.ceremonyMusicEntry.createMany({
    data: DEFAULT_CEREMONY_SEGMENTS.map((s, idx) => ({
      projectId,
      segment: s.segment,
      sortOrder: idx * 10,
    })),
  });
}

export async function ensureWeddingDetails(projectId: string) {
  return prisma.weddingDetails.upsert({
    where: { projectId },
    create: { projectId },
    update: {},
  });
}

/* ───────── server-action boilerplate consolidator ───────── */

export type ActionResult = { ok: boolean; message?: string };

/**
 * Standard "auth + validate" prelude for a server action that takes
 * FormData. Returns a discriminated union the action can branch on:
 *
 *   const r = await parseAndAuth(schema, formData);
 *   if (!r.ok) return r.result;
 *   const { data, ctx } = r;
 *   // ... mutate using data + ctx.projectId ...
 *
 * Replaces ~6 lines of boilerplate at the top of every action.
 */
export async function parseAndAuth<T extends z.ZodTypeAny>(
  schema: T,
  formData: FormData,
): Promise<
  | { ok: false; result: ActionResult }
  | {
      ok: true;
      data: z.infer<T>;
      ctx: { userId: string; projectId: string };
    }
> {
  const ctx = await getAuthedProject();
  if (!ctx) {
    return { ok: false, result: { ok: false, message: "Not authorized." } };
  }
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      ok: false,
      result: {
        ok: false,
        message: parsed.error.issues[0]?.message ?? "Invalid",
      },
    };
  }
  return { ok: true, data: parsed.data, ctx };
}
