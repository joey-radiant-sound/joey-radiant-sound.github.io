"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { WEDDINGS_SERVICES, type WeddingsFormState } from "./fields";

const ServiceValues = WEDDINGS_SERVICES.map((s) => s.value) as [
  string,
  ...string[],
];

const schema = z.object({
  firstName: z.string().trim().min(1, "Required").max(100),
  lastName: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Enter a valid email").max(200),
  partnerName: z.string().trim().max(100).optional().or(z.literal("")),
  weddingDate: z.string().trim().min(1, "Required").max(40),
  venue: z.string().trim().min(1, "Required").max(300),
  guestCount: z.coerce.number().int().min(1, "Required").max(10000),
  services: z.array(z.enum(ServiceValues)).min(1, "Pick at least one"),
  referral: z.string().trim().max(400).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
});

export async function submitWeddingsContact(
  _prev: WeddingsFormState,
  formData: FormData,
): Promise<WeddingsFormState> {
  if ((formData.get("company") ?? "").toString().trim() !== "") {
    return { ok: true, message: "Got it. We'll be in touch within one business day." };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const rl = checkRateLimit(`weddings:${ip}`);
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
    partnerName: formData.get("partnerName"),
    weddingDate: formData.get("weddingDate"),
    venue: formData.get("venue"),
    guestCount: formData.get("guestCount"),
    services: formData.getAll("services"),
    referral: formData.get("referral"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: WeddingsFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<WeddingsFormState["errors"]>;
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
      source: "weddings",
      fields: {
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        partnerName: d.partnerName || "",
        weddingDate: d.weddingDate,
        venue: d.venue,
        guestCount: d.guestCount,
        services: d.services.map(
          (v) => WEDDINGS_SERVICES.find((s) => s.value === v)?.label ?? v,
        ),
        referral: d.referral || "",
        message: d.message || "",
      },
    });
  } catch (err) {
    console.error("[weddings contact] email send failed", err);
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
