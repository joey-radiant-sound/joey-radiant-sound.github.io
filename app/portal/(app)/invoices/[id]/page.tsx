import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canAccessProject } from "@/lib/project-access";
import { Container } from "@/components/ui/Container";
import { PrintButton } from "../PrintButton";
import { formatCents, invoiceNumber } from "../_money";

export const metadata = { title: "Invoice", robots: { index: false } };

/**
 * Print-styled invoice view. Visible to the project's couple members
 * and to admins. "Download / Print PDF" uses the browser print dialog
 * (no stored binary). The on-screen chrome is hidden in print via
 * `print:hidden`.
 */
export default async function InvoiceView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/portal/sign-in");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session.user as any).role as string | undefined;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, title: true } },
      lineItems: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!invoice) notFound();

  if (!(await canAccessProject(session.user.id, role, invoice.projectId))) {
    redirect("/portal");
  }

  const total = invoice.lineItems.reduce(
    (sum, li) => sum + li.quantity * li.unitCents,
    0,
  );

  return (
    <Container width="narrow" className="py-10 md:py-14">
      {/* On-screen chrome — hidden when printing */}
      <div className="mb-8 flex items-center justify-between gap-4 print:hidden">
        <Link
          href={role === "ADMIN" ? `/portal/admin/projects/${invoice.projectId}` : "/portal/invoices"}
          className="text-sm font-medium text-muted hover:text-ink"
        >
          ← Back
        </Link>
        <PrintButton />
      </div>

      {/* The invoice sheet */}
      <article className="rounded-xl bg-white p-8 ring-1 ring-black/5 md:p-12 print:rounded-none print:p-0 print:ring-0">
        <header className="flex items-start justify-between gap-6">
          <div>
            <p className="text-lg font-semibold tracking-tight text-ink">
              Radiant Sound, LLC
            </p>
            <p className="mt-1 text-sm text-muted">
              Western New York · joey@radiantsoundwny.com
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold tracking-tight text-ink">
              Invoice
            </p>
            <p className="mt-1 text-sm font-medium text-ink-soft">
              {invoiceNumber(invoice.number)}
            </p>
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                invoice.status === "PAID"
                  ? "bg-green-100 text-green-700"
                  : invoice.status === "SENT"
                    ? "bg-brand-50 text-brand-700"
                    : "bg-surface-alt text-muted"
              }`}
            >
              {invoice.status}
            </span>
          </div>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Billed for
            </p>
            <p className="mt-1 text-sm text-ink">{invoice.project.title}</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Dates
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Issued:{" "}
              {invoice.issuedAt
                ? invoice.issuedAt.toISOString().slice(0, 10)
                : "—"}
            </p>
            <p className="text-sm text-ink-soft">
              Due:{" "}
              {invoice.dueAt ? invoice.dueAt.toISOString().slice(0, 10) : "—"}
            </p>
          </div>
        </div>

        <table className="mt-8 w-full text-left text-sm">
          <thead className="border-b border-black/10 text-xs font-semibold uppercase tracking-wider text-muted">
            <tr>
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Unit</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-muted">
                  No line items yet.
                </td>
              </tr>
            ) : (
              invoice.lineItems.map((li) => (
                <tr key={li.id} className="border-b border-black/5">
                  <td className="py-3 text-ink">{li.description}</td>
                  <td className="py-3 text-right text-ink-soft">
                    {li.quantity}
                  </td>
                  <td className="py-3 text-right text-ink-soft">
                    {formatCents(li.unitCents)}
                  </td>
                  <td className="py-3 text-right text-ink">
                    {formatCents(li.quantity * li.unitCents)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="pt-4 text-right text-sm font-semibold text-ink">
                Total
              </td>
              <td className="pt-4 text-right text-lg font-semibold text-ink">
                {formatCents(total)}
              </td>
            </tr>
          </tfoot>
        </table>

        {invoice.notes && (
          <div className="mt-8 border-t border-black/10 pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">
              Notes
            </p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-ink-soft">
              {invoice.notes}
            </p>
          </div>
        )}
      </article>
    </Container>
  );
}
