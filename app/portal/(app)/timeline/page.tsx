import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui/Container";

export const metadata = { title: "Timeline" };

/**
 * Couple-facing read-only milestone timeline. Admins are redirected to
 * /portal/admin (they manage milestones on the project detail page).
 */
export default async function TimelinePage() {
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

  const milestones = await prisma.milestone.findMany({
    where: { projectId: membership.projectId },
    orderBy: [{ dueAt: "asc" }, { sortOrder: "asc" }],
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
          Timeline
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          {membership.project.title}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Key dates and to-dos on the road to your wedding.
        </p>
      </header>

      {milestones.length === 0 ? (
        <p className="rounded-md border border-dashed border-black/15 px-4 py-3 text-sm text-muted">
          No milestones yet — we&rsquo;ll add them as your date approaches.
        </p>
      ) : (
        <ol className="relative flex flex-col gap-1 border-l-2 border-brand-200 pl-6">
          {milestones.map((m) => (
            <li key={m.id} className="relative py-3">
              <span
                className={`absolute -left-[31px] top-4 h-3.5 w-3.5 rounded-full ring-4 ring-surface ${
                  m.done ? "bg-brand-500" : "bg-brand-200"
                }`}
                aria-hidden
              />
              <p
                className={`text-sm font-medium ${
                  m.done ? "text-muted line-through" : "text-ink"
                }`}
              >
                {m.title}
              </p>
              <p className="text-xs text-muted">
                {m.dueAt ? m.dueAt.toISOString().slice(0, 10) : "Date TBD"}
                {m.done && " · done"}
              </p>
            </li>
          ))}
        </ol>
      )}
    </Container>
  );
}
