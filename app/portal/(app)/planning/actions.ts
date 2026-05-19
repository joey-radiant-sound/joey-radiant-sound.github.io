"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { FormState } from "./constants";

/**
 * Planning-sheet server actions. Every action:
 *   1. Resolves the current user's project via ProjectMember (or, for
 *      admins, accepts a projectId override — handled per-action).
 *   2. Verifies the user is a member of the project (or is ADMIN).
 *   3. Performs the mutation, scoped by projectId.
 *   4. revalidatePath("/portal/planning") and admin detail path.
 */

async function getAuthedProject(): Promise<{
  userId: string;
  projectId: string;
  isAdmin: boolean;
} | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (session.user as any).role === "ADMIN";

  // Admins editing through /portal/planning don't have their own
  // membership; they should hit /portal/admin/projects/[id]/planning
  // instead (Phase 2C.1). For now, admins viewing /portal get
  // redirected; this guard returns null for them.
  const membership = await prisma.projectMember.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  if (!membership) return null;

  return {
    userId: session.user.id,
    projectId: membership.projectId,
    isAdmin,
  };
}

function revalidate(projectId: string) {
  revalidatePath("/portal/planning");
  revalidatePath(`/portal/admin/projects/${projectId}`);
}

// -------- Timeline --------

const timelineSchema = z.object({
  time: z.string().trim().max(40).optional().or(z.literal("")),
  title: z.string().trim().min(1, "Required").max(200),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export async function addTimelineEvent(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const ctx = await getAuthedProject();
  if (!ctx) return { ok: false, message: "Not authorized." };

  const parsed = timelineSchema.safeParse({
    time: formData.get("time"),
    title: formData.get("title"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const last = await prisma.timelineEvent.findFirst({
    where: { projectId: ctx.projectId },
    orderBy: { sortOrder: "desc" },
  });

  await prisma.timelineEvent.create({
    data: {
      projectId: ctx.projectId,
      time: parsed.data.time || null,
      title: parsed.data.title,
      notes: parsed.data.notes || null,
      sortOrder: (last?.sortOrder ?? 0) + 10,
    },
  });

  revalidate(ctx.projectId);
  return { ok: true };
}

export async function deleteTimelineEvent(id: string): Promise<void> {
  const ctx = await getAuthedProject();
  if (!ctx) return;
  // Scope the delete to the user's project to prevent cross-project
  // mutation via a guessed id.
  await prisma.timelineEvent.deleteMany({
    where: { id, projectId: ctx.projectId },
  });
  revalidate(ctx.projectId);
}

// -------- Music --------

const musicSchema = z.object({
  category: z.string().trim().min(1).max(40),
  title: z.string().trim().min(1, "Required").max(200),
  artist: z.string().trim().max(200).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export async function addMusicSelection(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const ctx = await getAuthedProject();
  if (!ctx) return { ok: false, message: "Not authorized." };

  const parsed = musicSchema.safeParse({
    category: formData.get("category"),
    title: formData.get("title"),
    artist: formData.get("artist"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const last = await prisma.musicSelection.findFirst({
    where: { projectId: ctx.projectId, category: parsed.data.category },
    orderBy: { sortOrder: "desc" },
  });

  await prisma.musicSelection.create({
    data: {
      projectId: ctx.projectId,
      category: parsed.data.category,
      title: parsed.data.title,
      artist: parsed.data.artist || null,
      notes: parsed.data.notes || null,
      sortOrder: (last?.sortOrder ?? 0) + 10,
    },
  });

  revalidate(ctx.projectId);
  return { ok: true };
}

export async function deleteMusicSelection(id: string): Promise<void> {
  const ctx = await getAuthedProject();
  if (!ctx) return;
  await prisma.musicSelection.deleteMany({
    where: { id, projectId: ctx.projectId },
  });
  revalidate(ctx.projectId);
}

// -------- Vendors --------

const vendorSchema = z.object({
  role: z.string().trim().min(1).max(40),
  name: z.string().trim().min(1, "Required").max(200),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().max(200).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export async function addVendorContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const ctx = await getAuthedProject();
  if (!ctx) return { ok: false, message: "Not authorized." };

  const parsed = vendorSchema.safeParse({
    role: formData.get("role"),
    name: formData.get("name"),
    company: formData.get("company"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const last = await prisma.vendorContact.findFirst({
    where: { projectId: ctx.projectId },
    orderBy: { sortOrder: "desc" },
  });

  await prisma.vendorContact.create({
    data: {
      projectId: ctx.projectId,
      role: parsed.data.role,
      name: parsed.data.name,
      company: parsed.data.company || null,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      notes: parsed.data.notes || null,
      sortOrder: (last?.sortOrder ?? 0) + 10,
    },
  });

  revalidate(ctx.projectId);
  return { ok: true };
}

export async function deleteVendorContact(id: string): Promise<void> {
  const ctx = await getAuthedProject();
  if (!ctx) return;
  await prisma.vendorContact.deleteMany({
    where: { id, projectId: ctx.projectId },
  });
  revalidate(ctx.projectId);
}

// -------- Equipment notes --------

const equipmentSchema = z.object({
  category: z.string().trim().min(1).max(40),
  body: z.string().trim().min(1, "Required").max(2000),
});

export async function addEquipmentNote(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const ctx = await getAuthedProject();
  if (!ctx) return { ok: false, message: "Not authorized." };

  const parsed = equipmentSchema.safeParse({
    category: formData.get("category"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const last = await prisma.equipmentNote.findFirst({
    where: { projectId: ctx.projectId },
    orderBy: { sortOrder: "desc" },
  });

  await prisma.equipmentNote.create({
    data: {
      projectId: ctx.projectId,
      category: parsed.data.category,
      body: parsed.data.body,
      sortOrder: (last?.sortOrder ?? 0) + 10,
    },
  });

  revalidate(ctx.projectId);
  return { ok: true };
}

export async function deleteEquipmentNote(id: string): Promise<void> {
  const ctx = await getAuthedProject();
  if (!ctx) return;
  await prisma.equipmentNote.deleteMany({
    where: { id, projectId: ctx.projectId },
  });
  revalidate(ctx.projectId);
}
