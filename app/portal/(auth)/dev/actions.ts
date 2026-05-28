"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isDevLoginEnabled, createDevSession } from "@/lib/dev-login";

/**
 * Sign in as an arbitrary user without a magic link. Dev-only — guarded
 * by isDevLoginEnabled(); a no-op in any other environment.
 */
export async function signInAsDev(userId: string): Promise<void> {
  if (!isDevLoginEnabled()) return;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  await createDevSession(userId);
  redirect("/portal");
}
