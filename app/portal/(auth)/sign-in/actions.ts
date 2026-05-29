"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { signIn } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export type SignInState = {
  ok: boolean;
  message?: string;
  errors?: { email?: string };
};

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(200),
});

async function callerIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

export async function requestMagicLink(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const parsed = schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, errors: { email: issue?.message ?? "Required" } };
  }

  // Throttle magic-link sends per IP so the form can't be used to spam
  // an inbox or hammer SMTP. 5 requests / 15 min. The message is safe
  // to show — it leaks nothing about whether the email is on the list.
  const rl = checkRateLimit(`signin:${await callerIp()}`, 5, 15 * 60 * 1000);
  if (!rl.ok) {
    return {
      ok: false,
      message: "Too many sign-in attempts. Try again in a few minutes.",
    };
  }

  try {
    await signIn("nodemailer", {
      email: parsed.data.email,
      redirect: false,
    });
  } catch (err) {
    console.error("[portal sign-in] signIn failed", err);
    return {
      ok: false,
      message:
        "We couldn't send the sign-in link. Try again, or email joey@radiantsoundwny.com.",
    };
  }

  // Always return "ok" — don't leak which emails are or aren't on the
  // invite list. The Auth.js layer enforces invite-only behaviour
  // (Phase 2B will add an allowlist callback).
  return { ok: true };
}
