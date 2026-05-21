import "server-only";

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
