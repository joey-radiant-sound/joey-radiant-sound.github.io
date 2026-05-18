"use server";

import { z } from "zod";
import { signIn } from "@/lib/auth";

export type SignInState = {
  ok: boolean;
  message?: string;
  errors?: { email?: string };
};

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(200),
});

export async function requestMagicLink(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const parsed = schema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, errors: { email: issue?.message ?? "Required" } };
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
