import nodemailer from "nodemailer";

/**
 * Nodemailer transport + helpers for contact-form emails.
 *
 * Env vars (see .env.example):
 * - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
 * - CONTACT_FORM_TO — inbox that receives submissions
 * - CONTACT_FORM_FROM — From: header (defaults to SMTP_USER)
 *
 * Dev: point at Ethereal or Mailtrap. Prod: Joey's SMTP or Resend.
 */

type Source = "weddings" | "acappella";

let cachedTransport: nodemailer.Transporter | null = null;

function getTransport() {
  if (cachedTransport) return cachedTransport;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error(
      "SMTP env vars missing. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD in .env.local.",
    );
  }

  cachedTransport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return cachedTransport;
}

export type ContactPayload = {
  source: Source;
  fields: Record<string, string | string[] | number | undefined>;
};

function formatValue(v: string | string[] | number | undefined): string {
  if (v === undefined || v === "") return "—";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
  return String(v);
}

function renderPlainText({ source, fields }: ContactPayload) {
  const lines = [
    `New ${source === "weddings" ? "wedding" : "a cappella"} inquiry from the Radiant Sound website.`,
    "",
    ...Object.entries(fields).map(([k, v]) => `${k}: ${formatValue(v)}`),
  ];
  return lines.join("\n");
}

function renderHtml({ source, fields }: ContactPayload) {
  const rows = Object.entries(fields)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;font-weight:600;vertical-align:top;">${k}</td><td style="padding:4px 0;">${formatValue(v)}</td></tr>`,
    )
    .join("");
  return `
    <div style="font-family:system-ui,sans-serif;color:#111;">
      <p>New ${source === "weddings" ? "wedding" : "a cappella"} inquiry from the Radiant Sound website.</p>
      <table style="border-collapse:collapse;">${rows}</table>
    </div>
  `;
}

export async function sendContactEmail(payload: ContactPayload) {
  const transport = getTransport();
  const to = process.env.CONTACT_FORM_TO ?? "joey@radiantsoundwny.com";
  const from = process.env.CONTACT_FORM_FROM ?? process.env.SMTP_USER!;
  const tag = payload.source === "weddings" ? "[WEDDINGS]" : "[A CAPPELLA]";
  const first = payload.fields.firstName ?? "";
  const last = payload.fields.lastName ?? "";

  await transport.sendMail({
    from,
    to,
    replyTo:
      typeof payload.fields.email === "string" ? payload.fields.email : undefined,
    subject: `${tag} New inquiry from ${first} ${last}`.trim(),
    text: renderPlainText(payload),
    html: renderHtml(payload),
  });
}
