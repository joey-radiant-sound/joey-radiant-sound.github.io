import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { formatCents, invoiceNumber } from "./_money";

export const metadata = { title: "Invoices" };

/**
 * Couple-facing invoice list. Admins are redirected to /portal/admin
 * (they manage invoices on the project detail page).
 */
export default async function InvoicesPage() {
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

  const invoices = await prisma.invoice.findMany({
    where: { projectId: membership.projectId, status: { not: "DRAFT" } },
    orderBy: { number: "desc" },
    include: { lineItems: { select: { quantity: true, unitCents: true } } },
  });

  return (
    <Container className="py-10 md:py-14">
      <Link
        href="/portal"
        className="mb-6 inline-flex items-center text-sm font-medium text-muted hover:text-ink"
      >
        ← Dashboard
      </Link>

      <header className="mb-8">
        <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-600">
          Invoices
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          {membership.project.title}
        </h1>
      </header>

      {invoices.length === 0 ? (
        <p className="rounded-md border border-dashed border-black/15 px-4 py-3 text-sm text-muted">
          No invoices yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {invoices.map((inv) => {
            const total = inv.lineItems.reduce(
              (s, li) => s + li.quantity * li.unitCents,
              0,
            );
            return (
              <li
                key={inv.id}
                className="flex items-center justify-between gap-4 rounded-lg border-l-4 border-brand-400 bg-white px-4 py-3 ring-1 ring-black/5"
              >
                <div>
                  <Link
                    href={`/portal/invoices/${inv.id}`}
                    className="text-sm font-medium text-ink hover:underline"
                  >
                    {invoiceNumber(inv.number)}
                  </Link>
                  <p className="text-xs text-muted">
                    {formatCents(total)} ·{" "}
                    <span
                      className={
                        inv.status === "PAID"
                          ? "text-green-700"
                          : "text-brand-700"
                      }
                    >
                      {inv.status}
                    </span>
                  </p>
                </div>
                <Link
                  href={`/portal/invoices/${inv.id}`}
                  className="text-xs font-medium text-brand-700 hover:text-brand-900"
                >
                  View →
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}
