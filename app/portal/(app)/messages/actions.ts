"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canAccessProject } from "@/lib/project-access";

export type MessageState = { ok: boolean; message?: string };

const schema = z.object({
  body: z.string().trim().min(1, "Write a message").max(4000),
});

/**
 * Post a message to a project's thread. Any project member or an admin
 * may post; archived projects are inaccessible to couples (enforced by
 * canAccessProject).
 */
export async function postMessage(
  projectId: string,
  _prev: MessageState,
  formData: FormData,
): Promise<MessageState> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, message: "Not authorized." };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session.user as any).role as string | undefined;

  if (!(await canAccessProject(session.user.id, role, projectId))) {
    return { ok: false, message: "Not authorized." };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  await prisma.message.create({
    data: {
      projectId,
      authorId: session.user.id,
      body: parsed.data.body,
    },
  });

  revalidatePath("/portal/messages");
  revalidatePath(`/portal/admin/projects/${projectId}`);
  return { ok: true };
}
