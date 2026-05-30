import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui/Container";

export default async function PortalDashboard() {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session?.user as any)?.role;

  // Admins land in /portal/admin instead of seeing the couple view.
  if (role === "ADMIN") {
    redirect("/portal/admin");
  }

  // Couple view: show their project. For v1 we assume one project per
  // couple — pick the most-recently-attached.
  const userId = session?.user?.id;
  const membership = userId
    ? await prisma.projectMember.findFirst({
        // Archived weddings drop off the couple's dashboard.
        where: { userId, project: { archivedAt: null } },
        include: { project: true },
        orderBy: { createdAt: "desc" },
      })
    : null;

  const firstName =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (session?.user as any)?.firstName ??
    session?.user?.name ??
    session?.user?.email;

  return (
    <section className="py-16 md:py-24">
      <Container>
        <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-600">
          Welcome
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          Hi {firstName}.
        </h1>

        {membership ? (
          <div className="mt-8 rounded-xl bg-white p-6 ring-1 ring-black/5 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Your wedding
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              {membership.project.title}
            </p>
            <p className="mt-2 text-base text-muted">
              {membership.project.eventDate
                ? membership.project.eventDate.toISOString().slice(0, 10)
                : "Date TBD"}
              {membership.project.venueName &&
                ` · ${membership.project.venueName}`}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/portal/planning"
                className="inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600"
              >
                Open planning sheet →
              </Link>
              <Link
                href="/portal/files"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-inset ring-brand-500/20 transition-colors hover:ring-brand-500/40"
              >
                Files →
              </Link>
              <Link
                href="/portal/invoices"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-inset ring-brand-500/20 transition-colors hover:ring-brand-500/40"
              >
                Invoices →
              </Link>
              <Link
                href="/portal/timeline"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-inset ring-brand-500/20 transition-colors hover:ring-brand-500/40"
              >
                Timeline →
              </Link>
              <Link
                href="/portal/messages"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-inset ring-brand-500/20 transition-colors hover:ring-brand-500/40"
              >
                Messages →
              </Link>
            </div>
          </div>
        ) : (
          <p className="mt-8 max-w-xl text-lg text-muted">
            Your wedding planning workspace is being set up. We&rsquo;ll email
            you when it&rsquo;s ready.
          </p>
        )}

        <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 ring-1 ring-brand-100">
          Phase 2C · Planning sheet
        </p>
      </Container>
    </section>
  );
}
