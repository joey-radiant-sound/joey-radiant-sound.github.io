# Phase 2 — Client Portal

A logged-in `/portal/*` area for wedding couples. Invite-only, magic-link auth, weddings only for v1.

## Locked scope (per Joey)

| Area | Decision |
|---|---|
| Features (MVP) | Planning sheet · Files · Invoicing · Calendar + messaging |
| Audience | Weddings only |
| Auth | Magic link via email (Auth.js v5 Email provider) |
| Launch mode | Invite-only (Joey creates accounts; no public sign-up button) |
| Database | Neon Postgres (free tier) |
| ORM | Prisma |
| File storage | Cloudflare R2 (S3-compatible) |
| PDFs | `@react-pdf/renderer` for invoices |

## Sub-phases

Each ends with a runnable preview at https://radiant-sound-website.vercel.app and a clean commit.

### 2A — Foundation *(this phase)*
- Install Prisma + Auth.js v5 + Prisma adapter
- `prisma/schema.prisma` with Auth.js tables + initial `Project` (wedding) + `Couple` domain models
- `lib/db.ts` (Prisma client singleton)
- `lib/auth.ts` (Auth.js config — Email provider over existing SMTP, Prisma adapter)
- `middleware.ts` protecting `/portal/*` (redirect to sign-in)
- `/portal/sign-in` page — email-only form, server action sends magic link
- `/portal` placeholder dashboard ("Hi {firstName}, more soon…")
- `.env.example` updated with `DATABASE_URL` + `AUTH_SECRET`
- README: "Set up Neon" steps
- **Blocker for actually running:** Joey to provision Neon DB + set DATABASE_URL in Vercel + .env.local

### 2B — Couples + projects admin
- `Project` (wedding) creation flow from Joey side
- "Invite couple to portal" — admin action that creates a User + sends the magic-link email
- `/portal/admin/*` gated to Joey's email only
- Schema: link User ↔ Project (so each couple sees only their wedding)

### 2C — Planning sheet
- Structured replacement for the planning Google Sheet
- Schema: `Timeline`, `MusicSelection`, `VendorContact`, `Equipment` rows per Project
- Auto-save server actions
- Read-only "Joey view" + edit "couple view"

### 2D — File sharing (Cloudflare R2)
- Direct-to-R2 upload via presigned URLs
- Per-project file list (contracts, planning PDFs, song lists, etc.)
- Download with signed URL

### 2E — Invoicing
- `@react-pdf/renderer` invoice template
- Schema: `Invoice` with line items + status (draft / sent / paid)
- Joey marks paid manually; Stripe integration deferred (Phase 2F+)

### 2F — Calendar + messaging
- Couple-facing timeline of milestones (deposit due, planning sheet due, day-of)
- Lightweight in-portal message thread per Project (replaces email back-and-forth for small questions)

---

## What's NOT in Phase 2

- A cappella portal — same stack, different content; revisit after weddings MVP proves out
- Public sign-up — invite-only forever (or until volume justifies otherwise)
- Stripe / actual payments — capture status only, no payment processing
- Role/permission system beyond `Couple` and `Admin` (Joey)
- Two-factor auth — magic link is the security model; OK for this use case
