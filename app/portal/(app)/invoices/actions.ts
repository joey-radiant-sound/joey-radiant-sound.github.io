"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseDollarsToCents } from "./_money";

export type InvoiceState = { ok: boolean; message?: string };

async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (session?.user as any)?.role === "ADMIN";
}

function revalidate(projectId: string, invoiceId?: string) {
  revalidatePath(`/portal/admin/projects/${projectId}`);
  revalidatePath("/portal/invoices");
  if (invoiceId) revalidatePath(`/portal/invoices/${invoiceId}`);
}

/* ───── Invoice create / status / delete (admin only) ───── */

export async function createInvoice(projectId: string): Promise<InvoiceState> {
  if (!(await requireAdmin())) return { ok: false, message: "Not authorized." };

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return { ok: false, message: "Project not found." };

  // Sequential per-portal number. Solo-admin volume — a simple max+1.
  const last = await prisma.invoice.findFirst({
    orderBy: { number: "desc" },
    select: { number: true },
  });
  await prisma.invoice.create({
    data: {
      projectId,
      number: (last?.number ?? 0) + 1,
      status: "DRAFT",
      issuedAt: new Date(),
    },
  });

  revalidate(projectId);
  return { ok: true };
}

const STATUSES = ["DRAFT", "SENT", "PAID"] as const;

export async function setInvoiceStatus(
  invoiceId: string,
  status: string,
): Promise<InvoiceState> {
  if (!(await requireAdmin())) return { ok: false, message: "Not authorized." };
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
    return { ok: false, message: "Invalid status." };
  }
  const inv = await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status },
  });
  revalidate(inv.projectId, invoiceId);
  return { ok: true };
}

export async function deleteInvoice(invoiceId: string): Promise<InvoiceState> {
  if (!(await requireAdmin())) return { ok: false, message: "Not authorized." };
  const inv = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!inv) return { ok: true };
  await prisma.invoice.delete({ where: { id: invoiceId } });
  revalidate(inv.projectId);
  return { ok: true };
}

const invoiceMetaSchema = z.object({
  dueAt: z.string().trim().max(40).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export async function updateInvoiceMeta(
  invoiceId: string,
  formData: FormData,
): Promise<InvoiceState> {
  if (!(await requireAdmin())) return { ok: false, message: "Not authorized." };
  const parsed = invoiceMetaSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }
  const inv = await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
      notes: parsed.data.notes || null,
    },
  });
  revalidate(inv.projectId, invoiceId);
  return { ok: true };
}

/* ───── Line items (admin only) ───── */

const lineItemSchema = z.object({
  description: z.string().trim().min(1, "Description required").max(300),
  quantity: z.coerce.number().int().min(1).max(10000),
  unitDollars: z.string().trim().max(20),
});

export async function addLineItem(
  invoiceId: string,
  _prev: InvoiceState,
  formData: FormData,
): Promise<InvoiceState> {
  if (!(await requireAdmin())) return { ok: false, message: "Not authorized." };

  const parsed = lineItemSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid" };
  }
  const cents = parseDollarsToCents(parsed.data.unitDollars);
  if (cents === null) {
    return { ok: false, message: "Enter a valid dollar amount." };
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    select: { id: true, projectId: true },
  });
  if (!invoice) return { ok: false, message: "Invoice not found." };

  const last = await prisma.invoiceLineItem.findFirst({
    where: { invoiceId },
    orderBy: { sortOrder: "desc" },
  });
  await prisma.invoiceLineItem.create({
    data: {
      invoiceId,
      description: parsed.data.description,
      quantity: parsed.data.quantity,
      unitCents: cents,
      sortOrder: (last?.sortOrder ?? 0) + 10,
    },
  });

  revalidate(invoice.projectId, invoiceId);
  return { ok: true };
}

export async function deleteLineItem(
  lineItemId: string,
): Promise<InvoiceState> {
  if (!(await requireAdmin())) return { ok: false, message: "Not authorized." };
  const li = await prisma.invoiceLineItem.findUnique({
    where: { id: lineItemId },
    include: { invoice: { select: { id: true, projectId: true } } },
  });
  if (!li) return { ok: true };
  await prisma.invoiceLineItem.delete({ where: { id: lineItemId } });
  revalidate(li.invoice.projectId, li.invoice.id);
  return { ok: true };
}
