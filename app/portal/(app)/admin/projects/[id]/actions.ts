"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";

export type InviteCoupleState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<"email" | "firstName" | "lastName", string>>;
};

const schema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(200),
  firstName: z.string().trim().min(1, "Required").max(100),
  lastName: z.string().trim().max(100).optional().or(z.literal("")),
});

export async function inviteCouple(
  projectId: string,
  _prev: InviteCoupleState,
  formData: FormData,
): Promise<InviteCoupleState> {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN") {
    return { ok: false, message: "Not authorized." };
  }

  // Light throttle even though this is admin-gated — keeps a stuck
  // form or fat finger from blasting invite emails. 10 / 15 min per IP.
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const rl = checkRateLimit(`invite:${ip}`, 10, 15 * 60 * 1000);
  if (!rl.ok) {
    return {
      ok: false,
      message: "Too many invites just now. Try again in a few minutes.",
    };
  }

  const parsed = schema.safeParse({
    email: formData.get("email"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
  });
  if (!parsed.success) {
    const fieldErrors: InviteCoupleState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<
        InviteCoupleState["errors"]
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

  // Make sure the project actually exists.
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project) {
    return { ok: false, message: "Project not found." };
  }

  // Find-or-create the User row. If they already exist (e.g. invited
  // to another wedding by a planner, or were Joey's first guinea pig)
  // just attach as a member.
  const user = await prisma.user.upsert({
    where: { email: d.email },
    create: {
      email: d.email,
      firstName: d.firstName,
      lastName: d.lastName || null,
      name: [d.firstName, d.lastName].filter(Boolean).join(" ") || null,
      role: "COUPLE",
    },
    update: {},
  });

  // Attach as project member (idempotent — unique constraint on
  // (projectId, userId)). If already a member, skip.
  await prisma.projectMember.upsert({
    where: {
      projectId_userId: { projectId, userId: user.id },
    },
    create: { projectId, userId: user.id, role: "OWNER" },
    update: {},
  });

  // Send the magic-link email (or print to console in dev — see
  // lib/auth.ts fallback). signIn won't throw on success when
  // redirect:false.
  try {
    await signIn("nodemailer", {
      email: d.email,
      redirect: false,
    });
  } catch (err) {
    console.error("[admin invite] signIn failed", err);
    return {
      ok: false,
      message:
        "User was added but the invite email failed to send. They can still sign in from /portal/sign-in.",
    };
  }

  revalidatePath(`/portal/admin/projects/${projectId}`);
  return {
    ok: true,
    message: `Invite sent to ${d.email}.`,
  };
}
