# Phase 2 — Client Portal

A logged-in `/portal/*` area for wedding couples. Invite-only, magic-link auth, weddings only for v1. **Self-hosted on a single VPS** alongside the marketing site — no managed-database or managed-hosting dependencies.

## Locked scope (per Joey)

| Area | Decision |
|---|---|
| Features (MVP) | Planning sheet · Files · Invoicing · Calendar + messaging |
| Audience | Weddings only |
| Auth | Magic link via email (Auth.js v5 Email provider) |
| Launch mode | Invite-only (Joey creates accounts; no public sign-up) |
| Hosting | Self-hosted on one VPS (Hetzner / DigitalOcean / Vultr — ~$5–12/mo) |
| Database | SQLite — single file on the VPS disk |
| ORM | Prisma |
| File storage | Local disk under `data/uploads/` (Phase 2D) |
| PDFs | `@react-pdf/renderer` for invoices |
| Reverse proxy | Caddy v2 (auto-HTTPS via Let's Encrypt) |
| Process supervisor | Docker Compose (`restart: unless-stopped`) |
| Backups | Nightly `sqlite3 .backup` to a second host path via cron |

## Why self-host

- **Own your data.** The SQLite file is on your disk. No managed-DB provider can suspend, price-hike, or deprecate you.
- **One bill, one box.** No "infrastructure sprawl" across Vercel + Neon + R2.
- **Maximum learning surface.** You'll touch Linux, systemd, Docker, Caddy, reverse proxies, TLS via Let's Encrypt, cron, SQLite ops, and deployment from end to end.
- **Cheaper.** A $5 VPS replaces ~$0–25/mo of managed services depending on usage.

We still pay for:
- **A VPS host.** Lowest-possible dependency: a Linux box on the public internet.
- **A domain registrar.** You can't own a TLD.
- **An SMTP provider** for outbound email. Deliverability is a years-of-reputation problem.
- **Optional Phase 3 integrations** (Stripe for real payments, Google Maps for address autofill) — these are *features*, not infrastructure.

## Sub-phases

Each ends with a runnable preview locally and (once the VPS is live) at the production domain.

### 2A — Foundation *(complete)*
- Prisma + Auth.js v5 + Prisma adapter installed
- `prisma/schema.prisma` with Auth.js tables + initial `Project` + `ProjectMember` domain models (SQLite-compatible)
- `lib/db.ts` (Prisma client singleton)
- `lib/auth.ts` (Auth.js config — Nodemailer email provider over existing SMTP, Prisma adapter)
- `/portal/sign-in` + `/portal/check-email` unauthenticated pages
- `/portal` gated dashboard placeholder
- `Dockerfile` (multi-stage build, Next.js standalone output)
- `docker-compose.yml` (app + Caddy + named volumes for SQLite & TLS state)
- `Caddyfile` (reverse proxy + auto-HTTPS)
- `scripts/backup.sh` (sqlite3 .backup with 30-day retention)
- README "Portal Setup (self-hosted)" runbook
- **Blocker for production:** Joey provisions a VPS, runs through the runbook.

### 2B — Couples + projects admin
- `Project` (wedding) creation flow from Joey side
- "Invite couple to portal" — admin action that creates a User and triggers the magic-link email
- `/portal/admin/*` gated to Joey's email
- `signIn` allowlist callback that rejects emails not on the User table → invite-only enforced

### 2C — Planning sheet
- Structured replacement for the planning Google Sheet
- Schema: `Timeline`, `MusicSelection`, `VendorContact`, `Equipment` rows per Project
- Auto-save server actions
- Read-only "Joey view" + edit "couple view"

### 2D — File sharing (local disk)
- Multipart upload to a Next.js route handler → writes under `data/uploads/<projectId>/`
- Authenticated download via signed paths (`/api/files/[id]`)
- Volume-mounted in `docker-compose.yml` alongside the SQLite db
- Backup script includes uploads

### 2E — Invoicing
- `@react-pdf/renderer` invoice template, server-rendered to PDF
- Schema: `Invoice` with line items + status (draft / sent / paid)
- Joey marks paid manually; Stripe integration deferred (Phase 3 — third-party but a *feature*, not infrastructure)

### 2F — Calendar + messaging
- Couple-facing timeline of milestones (deposit due, planning sheet due, day-of)
- Lightweight in-portal message thread per Project (replaces email back-and-forth for small questions)

---

## What's NOT in Phase 2

- A cappella portal — same stack, different content; revisit after weddings MVP proves out
- Public sign-up — invite-only forever (or until volume justifies otherwise)
- Stripe / actual payments — capture status only, no payment processing (Phase 3)
- Two-factor auth — magic link is the security model; OK for this use case
- Off-site backups — initial cron writes to a second path on the same VPS. Add rsync to a NAS or S3 in Phase 3.
