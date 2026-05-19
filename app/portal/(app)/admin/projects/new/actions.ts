"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type CreateProjectState = {
  ok: boolean;
  message?: string;
  errors?: Partial<
    Record<
      "title" | "eventDate" | "venueName" | "venueCity" | "guestCount" | "status",
      string
    >
  >;
};

const STATUSES = [
  "LEAD",
  "BOOKED",
  "PLANNING",
  "COMPLETED",
  "CANCELED",
] as const;

const schema = z.object({
  title: z.string().trim().min(1, "Required").max(200),
  eventDate: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  venueName: z.string().trim().max(200).optional().or(z.literal("")),
  venueCity: z.string().trim().max(120).optional().or(z.literal("")),
  guestCount: z
    .union([z.literal(""), z.coerce.number().int().min(1).max(10000)])
    .optional(),
  status: z.enum(STATUSES).default("LEAD"),
});

export async function createProject(
  _prev: CreateProjectState,
  formData: FormData,
): Promise<CreateProjectState> {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN") {
    return { ok: false, message: "Not authorized." };
  }

  const parsed = schema.safeParse({
    title: formData.get("title"),
    eventDate: formData.get("eventDate"),
    venueName: formData.get("venueName"),
    venueCity: formData.get("venueCity"),
    guestCount: formData.get("guestCount") ?? "",
    status: formData.get("status") ?? "LEAD",
  });

  if (!parsed.success) {
    const fieldErrors: CreateProjectState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<
        CreateProjectState["errors"]
      >;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: fieldErrors,
    };
  }

  const d = parsed.data;

  const project = await prisma.project.create({
    data: {
      title: d.title,
      eventDate: d.eventDate ? new Date(d.eventDate) : null,
      venueName: d.venueName || null,
      venueCity: d.venueCity || null,
      guestCount:
        d.guestCount === "" || d.guestCount === undefined ? null : d.guestCount,
      status: d.status,
      invitedById: session?.user?.id ?? null,
    },
  });

  revalidatePath("/portal/admin");
  redirect(`/portal/admin/projects/${project.id}`);
}
