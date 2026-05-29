"use client";

import Link from "next/link";
import { useActionState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatCents, invoiceNumber, INVOICE_STATUSES } from "./_money";
import {
  createInvoice,
  setInvoiceStatus,
  deleteInvoice,
  addLineItem,
  deleteLineItem,
  type InvoiceState,
} from "./actions";

export type LineItemRow = {
  id: string;
  description: string;
  quantity: number;
  unitCents: number;
};

export type InvoiceRow = {
  id: string;
  number: number;
  status: string;
  lineItems: LineItemRow[];
};

const initial: InvoiceState = { ok: false };

/**
 * Admin invoice management for one project. Create invoices, edit line
 * items, set status, view the print page. Admin-only — rendered on the
 * project detail page.
 */
export function InvoicesPanel({
  projectId,
  invoices,
}: {
  projectId: string;
  invoices: InvoiceRow[];
}) {
  const [, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Button
          type="button"
          size="md"
          onClick={() =>
            startTransition(async () => {
              await createInvoice(projectId);
            })
          }
        >
          New invoice
        </Button>
      </div>

      {invoices.length === 0 ? (
        <p className="rounded-md border border-dashed border-black/15 px-4 py-3 text-sm text-muted">
          No invoices yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {invoices.map((inv) => (
            <InvoiceCard key={inv.id} invoice={inv} />
          ))}
        </ul>
      )}
    </div>
  );
}

function InvoiceCard({ invoice }: { invoice: InvoiceRow }) {
  const [, startTransition] = useTransition();
  const total = invoice.lineItems.reduce(
    (s, li) => s + li.quantity * li.unitCents,
    0,
  );

  return (
    <li className="rounded-xl bg-white p-5 ring-1 ring-black/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/portal/invoices/${invoice.id}`}
            className="text-sm font-semibold text-ink hover:underline"
          >
            {invoiceNumber(invoice.number)}
          </Link>
          <span className="text-sm text-muted">{formatCents(total)}</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Status selector */}
          <select
            defaultValue={invoice.status}
            onChange={(e) =>
              startTransition(async () => {
                await setInvoiceStatus(invoice.id, e.target.value);
              })
            }
            className="rounded-md border border-black/10 bg-white px-2 py-1 text-xs font-medium text-ink"
          >
            {INVOICE_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <Link
            href={`/portal/invoices/${invoice.id}`}
            className="text-xs font-medium text-brand-700 hover:text-brand-900"
          >
            View
          </Link>
          <button
            type="button"
            onClick={() =>
              startTransition(async () => {
                await deleteInvoice(invoice.id);
              })
            }
            className="text-xs font-medium text-muted hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Line items */}
      {invoice.lineItems.length > 0 && (
        <ul className="mt-4 flex flex-col gap-1.5">
          {invoice.lineItems.map((li) => (
            <li
              key={li.id}
              className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 text-sm"
            >
              <span className="text-ink">{li.description}</span>
              <span className="text-muted">×{li.quantity}</span>
              <span className="text-ink-soft">
                {formatCents(li.quantity * li.unitCents)}
              </span>
              <button
                type="button"
                onClick={() =>
                  startTransition(async () => {
                    await deleteLineItem(li.id);
                  })
                }
                className="text-xs font-medium text-muted hover:text-red-600"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <AddLineItemForm invoiceId={invoice.id} />
    </li>
  );
}

function AddLineItemForm({ invoiceId }: { invoiceId: string }) {
  const action = addLineItem.bind(null, invoiceId);
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form
      action={formAction}
      className="mt-4 grid gap-2 border-t border-black/5 pt-4 sm:grid-cols-[1fr_70px_110px_auto] sm:items-end"
    >
      <Input label="Description" name="description" required />
      <Input label="Qty" name="quantity" type="number" min={1} defaultValue="1" />
      <Input label="Unit $" name="unitDollars" placeholder="0.00" required />
      <Button type="submit" size="md" disabled={pending}>
        {pending ? "Adding…" : "Add"}
      </Button>
      {!state.ok && state.message && (
        <p className="sm:col-span-4 text-sm font-medium text-red-600">
          {state.message}
        </p>
      )}
    </form>
  );
}
