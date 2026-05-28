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

export type PlanningCtx = {
  userId: string;
  projectId: string;
  isAdmin: boolean;
};

/**
 * Resolve which project the current user may edit the planning sheet
 * for, and authorize them.
 *
 * - Admins: must pass `explicitProjectId` (the `?project=` URL param,
 *   or the hidden `projectId` form field). Any existing project,
 *   archived or not — admins keep access to old weddings.
 * - Couples: their own (non-archived) membership project. If an
 *   `explicitProjectId` is supplied it MUST match their membership and
 *   the project must not be archived — otherwise rejected. This makes
 *   the hidden form field safe: a couple can't point it at another
 *   project, and an archived wedding locks them out.
 *
 * Returns null when access can't be granted; callers redirect.
 */
export async function getAuthedProject(
  explicitProjectId?: string,
): Promise<PlanningCtx | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = session.user.id;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (session.user as any).role === "ADMIN";

  if (isAdmin) {
    if (!explicitProjectId) return null;
    const project = await prisma.project.findUnique({
      where: { id: explicitProjectId },
      select: { id: true },
    });
    if (!project) return null;
    return { userId, projectId: project.id, isAdmin: true };
  }

  // Couple path — resolve their (single) membership.
  const membership = await prisma.projectMember.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { project: { select: { id: true, archivedAt: true } } },
  });
  if (!membership) return null;
  // Archived weddings lock the couple out.
  if (membership.project.archivedAt) return null;
  // If an explicit id was supplied it must be their own project.
  if (explicitProjectId && explicitProjectId !== membership.projectId) {
    return null;
  }
  return { userId, projectId: membership.projectId, isAdmin: false };
}

/**
 * Page-level helper: resolve the planning context from a tab page's
 * `searchParams` (which carries `?project=` for admins). Returns the
 * ctx, or null when the caller should redirect. Tab pages do:
 *
 *   const ctx = await resolveTabCtx(searchParams);
 *   if (!ctx) redirect("/portal");
 */
export async function resolveTabCtx(
  searchParams: Promise<{ project?: string }> | undefined,
): Promise<PlanningCtx | null> {
  const params = searchParams ? await searchParams : {};
  return getAuthedProject(params.project);
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
