"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  ACAPPELLA_ROLES,
  ACAPPELLA_SERVICES,
  type AcappellaFormState,
} from "./fields";

const RoleValues = ACAPPELLA_ROLES.map((r) => r.value) as [string, ...string[]];
const ServiceValues = ACAPPELLA_SERVICES.map((s) => s.value) as [
  string,
  ...string[],
];

const schema = z.object({
  firstName: z.string().trim().min(1, "Required").max(100),
  lastName: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Enter a valid email").max(200),
  role: z.enum(RoleValues),
  groupName: z.string().trim().min(1, "Required").max(200),
  institution: z.string().trim().min(1, "Required").max(200),
  showDate: z.string().trim().min(1, "Required").max(40),
  venue: z.string().trim().min(1, "Required").max(300),
  expectedAttendance: z
    .union([z.literal(""), z.coerce.number().int().min(0).max(200000)])
    .optional(),
  services: z.array(z.enum(ServiceValues)).min(1, "Pick at least one"),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
});

export async function submitAcappellaContact(
  _prev: AcappellaFormState,
  formData: FormData,
): Promise<AcappellaFormState> {
  if ((formData.get("company") ?? "").toString().trim() !== "") {
    return { ok: true, message: "Got it. We'll be in touch within one business day." };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const rl = checkRateLimit(`acappella:${ip}`);
  if (!rl.ok) {
    return {
      ok: false,
      message: "Too many submissions. Try again in a few minutes.",
    };
  }

  const parsed = schema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    role: formData.get("role"),
    groupName: formData.get("groupName"),
    institution: formData.get("institution"),
    showDate: formData.get("showDate"),
    venue: formData.get("venue"),
    expectedAttendance: formData.get("expectedAttendance") ?? "",
    services: formData.getAll("services"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: AcappellaFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<AcappellaFormState["errors"]>;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      errors: fieldErrors,
    };
  }

  const d = parsed.data;

  try {
    await sendContactEmail({
      source: "acappella",
      fields: {
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        role: ACAPPELLA_ROLES.find((r) => r.value === d.role)?.label ?? d.role,
        groupName: d.groupName,
        institution: d.institution,
        showDate: d.showDate,
        venue: d.venue,
        expectedAttendance:
          d.expectedAttendance === "" || d.expectedAttendance === undefined
            ? ""
            : d.expectedAttendance,
        services: d.services.map(
          (v) => ACAPPELLA_SERVICES.find((s) => s.value === v)?.label ?? v,
        ),
        message: d.message || "",
      },
    });
  } catch (err) {
    console.error("[acappella contact] email send failed", err);
    return {
      ok: false,
      message:
        "Something went wrong sending your message. Email us directly at joey@radiantsoundwny.com and we'll sort it out.",
    };
  }

  return {
    ok: true,
    message:
      "Got it. We'll be in touch within one business day. Check your inbox (and spam folder just in case).",
  };
}
