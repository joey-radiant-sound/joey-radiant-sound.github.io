import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { MessageThread } from "./MessageThread";
import { messageAuthorInclude, toMessageRows } from "./_rows";

export const metadata = { title: "Messages" };

/**
 * Couple-facing message thread. Admins are redirected to /portal/admin
 * (they message from the project detail page).
 */
export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/portal/sign-in");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session.user as any).role as string | undefined;
  if (role === "ADMIN") redirect("/portal/admin");

  const membership = await prisma.projectMember.findFirst({
    where: { userId: session.user.id, project: { archivedAt: null } },
    select: { projectId: true, project: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
  });
  if (!membership) {
    return (
      <Container className="py-16">
        <p className="text-base text-muted">
          No wedding linked to your account yet.
        </p>
      </Container>
    );
  }

  const messages = await prisma.message.findMany({
    where: { projectId: membership.projectId },
    orderBy: { createdAt: "asc" },
    include: messageAuthorInclude,
  });

  return (
    <Container width="narrow" className="py-10 md:py-14">
      <Link
        href="/portal"
        className="mb-6 inline-flex items-center text-sm font-medium text-muted hover:text-ink"
      >
        ← Dashboard
      </Link>

      <header className="mb-8">
        <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-600">
          Messages
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          {membership.project.title}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Quick questions for the Radiant Sound team. We&rsquo;ll reply here.
        </p>
      </header>

      <MessageThread
        projectId={membership.projectId}
        messages={toMessageRows(messages, session.user.id)}
      />
    </Container>
  );
}
