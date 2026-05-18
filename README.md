# Radiant Sound Website

Marketing site and future client portal for [Radiant Sound](https://radiantsoundwny.com) — live sound, lighting, and DJ services for weddings and college a cappella productions.

## Stack

- **Framework:** Next.js 16 (App Router) · React 19 · TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP + Lenis (smooth scroll) + Intersection Observer
- **Forms:** React Hook Form + Zod (Phase 1)
- **Email:** Nodemailer + SMTP (Phase 1)
- **Auth:** Auth.js v5 (Phase 2)
- **Database:** Neon Postgres + Prisma (Phase 2)
- **File storage:** Cloudflare R2 (Phase 2)
- **Hosting:** Vercel

## Preview URL

**[https://radiant-sound-website.vercel.app](https://radiant-sound-website.vercel.app)**

This URL updates automatically on every push to the `overhaul` branch. Use it to review progress on any device. The live production site (`radiantsoundwny.com`) is unaffected until launch day.

## Structure

```
app/                     # Next.js App Router pages + server actions
  layout.tsx             # Root layout, metadata, fonts
  page.tsx               # Homepage — dual-path chooser (Weddings / A Cappella)
  weddings/              # Weddings sub-site
  acappella/             # A Cappella sub-site

components/
  ui/                    # Buttons, inputs, primitives
  layout/                # Nav, Footer, Container
  animations/            # Reusable GSAP/Lenis wrappers
  sections/              # Hero, Testimonials, ServiceGrid, etc.
  forms/                 # Contact forms (RHF + Zod)

lib/
  animations/            # GSAP + Lenis helpers
  content/               # Typed copy modules (weddings.ts, acappella.ts)
  email.ts               # Contact form email send
  rate-limit.ts          # IP-keyed token bucket for form submissions

public/
  images/{weddings,acappella,shared}/
  videos/{weddings,acappella}/
  favicon-*.png, apple-touch-icon.png, icon-192.png

_assetdump/              # Raw asset drop zone (gitignored — see MANIFEST.md)
CONTENT.md               # Copy source-of-truth draft
ARCHITECTURE.md          # Routing tree, component inventory, content mapping
TODO.md                  # Outstanding items and open questions
```

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # ESLint
```

Deploy to preview URL:
```bash
npx vercel --prod
```

## Environment Variables

Goes in `.env.local` (gitignored). Copy `.env.example` and fill in values.

Required for Phase 1 (contact forms):

```
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
CONTACT_FORM_TO=      # where inbound form submissions go
```

Dev email: use [Ethereal](https://ethereal.email) or [Mailtrap](https://mailtrap.io) — captures emails without sending.

## Branching

- `legacy-jekyll` — snapshot of the pre-overhaul Jekyll site. **Do not modify.**
- `main` — serves `radiantsoundwny.com` via GitHub Pages. Do not touch until launch.
- `overhaul` — all Phase 1 construction work. Auto-deploys to the Vercel preview URL.

**Live site guardrail:** `radiantsoundwny.com` is on GitHub Pages (`main` branch). The Vercel project does NOT have the custom domain attached — that happens at launch only (Phase 1I).

## Phase Status

| Phase | Description | Status |
|---|---|---|
| 1A | Design tokens, fonts, ARCHITECTURE.md, TODO.md | ✅ Done |
| 1B | Nav, footer, routing shell (all 6 routes) | ✅ Done |
| 1C | Homepage chooser | ✅ Done |
| 1D | Weddings content pages | ✅ Done |
| 1E | A Cappella content pages | ✅ Done |
| 1F | Contact forms + email | ✅ Done |
| 1G | Animation layer (Lenis, GSAP, scroll reveals) | ✅ Done |
| 1H | Asset integration (real photos/videos) | ✅ Done (photos) — videos pending Joey |
| 1I | SEO, polish, DNS flip, launch | ✅ Done (code) — awaiting Joey's launch signal |
| 2A | Portal foundation (Prisma, Auth.js magic-link, /portal shell) | ✅ Done (code) — awaiting Joey's Neon DB |
| 2B | Couples + projects admin | ⏳ Pending |
| 2C | Planning sheet | ⏳ Pending |
| 2D | File sharing (R2) | ⏳ Pending |
| 2E | Invoicing (react-pdf) | ⏳ Pending |
| 2F | Calendar + messaging | ⏳ Pending |

See [PHASE2.md](./PHASE2.md) for the portal sub-phase breakdown.

## Portal Setup (Phase 2A — required before /portal works)

The portal at `/portal/*` is wired up but inert until Joey provisions a database. One-time setup:

1. **Create Neon project** at https://console.neon.tech → New project. Free tier is fine. Region: pick one close to Vercel's default (us-east-1).
2. **Copy the pooled connection string** (Connection details → Pooled connection). It looks like `postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require`.
3. **Generate an Auth.js secret:** `openssl rand -base64 32`
4. **Add to `.env.local`:**
   ```
   DATABASE_URL=postgresql://...
   AUTH_SECRET=...
   ```
5. **Push the schema to Neon:** `npx prisma db push` (creates all tables without migrations — fine for now; switch to `prisma migrate` once schema stabilizes).
6. **Add the same env vars to Vercel** → Project → Settings → Environment Variables → both Production and Preview scopes.
7. **Re-deploy** so Vercel picks up the new env: `npx vercel --prod --yes`.

After that, visiting `/portal` redirects to `/portal/sign-in`, where any email submission sends a magic link via the existing SMTP transport. (Allowlist + admin invite UI lands in Phase 2B.)

## Launch Runbook (Phase 1I)

When Joey gives the go:

1. **Final SMTP swap** — set production `SMTP_*` + `CONTACT_FORM_TO` env
   vars in Vercel → Settings → Environment Variables (Production scope).
   Test with a real submission to the preview URL.
2. **Verify Lighthouse** on preview URL — target 95+/100/100/100.
3. **Attach domain** — Vercel → Project → Settings → Domains → add
   `radiantsoundwny.com` + `www.radiantsoundwny.com`. Vercel gives DNS
   targets (A for apex, CNAME for www).
4. **Update DNS** at Joey's registrar: replace GitHub Pages A records
   with Vercel's, point `www` CNAME at Vercel.
5. **Wait** for propagation + SSL cert issuance (usually <15 min).
6. **Verify** `radiantsoundwny.com` serves the Vercel build and SSL is
   green. Test a real contact form submission end-to-end.
7. **Merge** `overhaul` → `main` via PR (keeps clean history). Change
   Vercel's production branch from `overhaul` to `main`.
8. **Disable GitHub Pages** (Settings → Pages → source: None) — Vercel
   now owns the domain. The `legacy-jekyll` branch remains as archive.

Guardrail preserved until step 3: `radiantsoundwny.com` keeps serving
the legacy Jekyll site from GitHub Pages.

## License

Copyright © Radiant Sound, LLC. All rights reserved.
