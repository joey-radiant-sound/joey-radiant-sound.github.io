/**
 * Money helpers for invoices. Amounts are stored as integer cents to
 * avoid floating-point rounding. Client- and server-safe (no imports).
 */

/** Format integer cents as "$1,234.56". */
export function formatCents(cents: number): string {
  const dollars = cents / 100;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

/** Parse a user-typed dollar string ("1,234.56", "$50", "50") to cents. */
export function parseDollarsToCents(input: string): number | null {
  const cleaned = input.replace(/[$,\s]/g, "").trim();
  if (cleaned === "") return 0;
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  return Math.round(parseFloat(cleaned) * 100);
}

/** Display number as RS-0001. */
export function invoiceNumber(n: number): string {
  return `RS-${String(n).padStart(4, "0")}`;
}

export const INVOICE_STATUSES = [
  { value: "DRAFT", label: "Draft" },
  { value: "SENT", label: "Sent" },
  { value: "PAID", label: "Paid" },
] as const;
