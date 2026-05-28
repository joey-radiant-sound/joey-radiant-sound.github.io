"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthedProject, ensureWeddingDetails } from "../_server";

export type GeneralState = {
  ok: boolean;
  message?: string;
};

const optStr = z.string().trim().max(500).optional().or(z.literal(""));
const optLong = z.string().trim().max(4000).optional().or(z.literal(""));
const optInt = z
  .union([z.literal(""), z.coerce.number().int().min(0).max(10000)])
  .optional();

const schema = z.object({
  weddingDate: optStr,
  contactPhone: optStr,
  contactEmail: optStr,
  brideFirstName: optStr,
  brideLastName: optStr,
  groomFirstName: optStr,
  groomLastName: optStr,
  receptionVenueName: optStr,
  receptionVenueAddress: optStr,
  ceremonyVenueName: optStr,
  ceremonyVenueAddress: optStr,
  venueManagerName: optStr,
  venueManagerPhone: optStr,
  venueManagerEmail: optStr,
  photographerName: optStr,
  photographerEmail: optStr,
  videographerName: optStr,
  videographerEmail: optStr,
  guestCount: optInt,
  earliestArrival: optStr,
  djArrival: optStr,
  linenColor: optStr,
  generalNotes: optLong,
});

function toNull<T>(v: T | "" | undefined): T | null {
  if (v === "" || v === undefined) return null;
  return v;
}

export async function saveGeneralInfo(
  _prev: GeneralState,
  formData: FormData,
): Promise<GeneralState> {
  const ctx = await getAuthedProject(
    formData.get("projectId")?.toString() || undefined,
  );
  if (!ctx) return { ok: false, message: "Not authorized." };

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid",
    };
  }
  const d = parsed.data;

  await ensureWeddingDetails(ctx.projectId);

  await prisma.weddingDetails.update({
    where: { projectId: ctx.projectId },
    data: {
      weddingDate: d.weddingDate ? new Date(d.weddingDate) : null,
      contactPhone: toNull(d.contactPhone),
      contactEmail: toNull(d.contactEmail),
      brideFirstName: toNull(d.brideFirstName),
      brideLastName: toNull(d.brideLastName),
      groomFirstName: toNull(d.groomFirstName),
      groomLastName: toNull(d.groomLastName),
      receptionVenueName: toNull(d.receptionVenueName),
      receptionVenueAddress: toNull(d.receptionVenueAddress),
      ceremonyVenueName: toNull(d.ceremonyVenueName),
      ceremonyVenueAddress: toNull(d.ceremonyVenueAddress),
      venueManagerName: toNull(d.venueManagerName),
      venueManagerPhone: toNull(d.venueManagerPhone),
      venueManagerEmail: toNull(d.venueManagerEmail),
      photographerName: toNull(d.photographerName),
      photographerEmail: toNull(d.photographerEmail),
      videographerName: toNull(d.videographerName),
      videographerEmail: toNull(d.videographerEmail),
      guestCount:
        d.guestCount === "" || d.guestCount === undefined ? null : d.guestCount,
      earliestArrival: toNull(d.earliestArrival),
      djArrival: toNull(d.djArrival),
      linenColor: toNull(d.linenColor),
      generalNotes: toNull(d.generalNotes),
    },
  });

  revalidatePath("/portal/planning/general");
  return { ok: true, message: "Saved." };
}
