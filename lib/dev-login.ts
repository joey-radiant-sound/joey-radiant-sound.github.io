import "server-only";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

/**
 * Dev-only sign-in shortcut. Lets us click into any user without the
 * magic-link round trip while testing locally.
 *
 * SECURITY: this bypasses authentication entirely, so it MUST be
 * impossible to reach in production. Two independent conditions gate
 * it — the standard build env AND an explicit opt-in flag — and the
 * cookie is set non-secure (localhost http only). Both the dev page
 * and the dev action call isDevLoginEnabled() and bail otherwise.
 */
export function isDevLoginEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.ENABLE_DEV_LOGIN === "true"
  );
}

// Auth.js v5 default session cookie name in dev (no __Secure- prefix
// because that's only added under HTTPS). Verified against
// node_modules/@auth/core/lib/utils/cookie.js.
const SESSION_COOKIE = "authjs.session-token";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Mint a database Session row for `userId` and set the session cookie
 * to its raw token. Works with our `session: { strategy: "database" }`
 * config — Auth.js looks the token up in the Session table directly
 * (no JWT decode for the database strategy).
 */
export async function createDevSession(userId: string): Promise<void> {
  if (!isDevLoginEnabled()) {
    throw new Error("Dev login is not enabled.");
  }
  const sessionToken = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: { sessionToken, userId, expires },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires,
    secure: false,
  });
}
