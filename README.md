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
- **Hosting:** Self-hosted on a single VPS (Docker Compose + Caddy reverse proxy)
- **Portal database:** SQLite (`data/radiant.db`)

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
| 2A | Portal foundation (Prisma, Auth.js magic-link, /portal shell) | ✅ Done — self-hosted SQLite + Docker |
| 2B | Couples + projects admin | ✅ Done — set ADMIN_EMAILS in .env.local to use |
| 2C | Planning sheet (timeline + music + vendors + logistics) | ✅ Done |
| 2D | File sharing (local disk, contracts/invoices/vendor docs) | ✅ Done |
| 2E | Invoicing (HTML + print-to-PDF, no dependency) | ✅ Done |
| 2C | Planning sheet | ⏳ Pending |
| 2D | File sharing (R2) | ⏳ Pending |
| 2E | Invoicing (react-pdf) | ⏳ Pending |
| 2F | Calendar + messaging | ⏳ Pending |

See [PHASE2.md](./PHASE2.md) for the portal sub-phase breakdown.

## Portal Setup (Phase 2A — self-hosted)

The portal at `/portal/*` is wired but inert until you stand up a Linux box and bring the Docker stack up. **No third-party database service required** — the entire stateful backend is a SQLite file on the VPS disk.

### Local dev (no VPS needed)

```bash
# 1. Set env
cp .env.example .env.local
# Edit .env.local: set AUTH_SECRET (openssl rand -base64 32), SMTP_* vars

# 2. Create the SQLite file + tables. Use `npm run db:push`, NOT
#    bare `npx prisma db push` — the npm script loads .env.local
#    first so DATABASE_URL reaches Prisma. (Bare prisma only reads
#    .env, which won't have what you need.)
#    Also available: `npm run db:studio`, `npm run db:generate`,
#    and `npm run db -- <anything>` for arbitrary prisma commands.
npm run db:push

# 3. Run dev server
npm run dev
# → http://localhost:3000/portal
```

The DB file lives at `data/radiant.db` (gitignored). Wipe it any time with `rm data/radiant.db && npx prisma db push`.

### Production setup (one-time)

1. **Provision a VPS.** Recommended: Hetzner CX22 (€4.50/mo, EU), DigitalOcean Basic Droplet ($6/mo), or Vultr ($5/mo). 1 vCPU + 2 GB RAM + 20 GB SSD is plenty for this workload. Ubuntu 24.04 LTS or Debian 12.
2. **DNS:** point `radiantsoundwny.com` (apex A record) and `www.radiantsoundwny.com` (CNAME or A) at the VPS IP. Caddy will auto-provision TLS on first request.
3. **SSH in and install Docker:**
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER  # log out + back in
   ```
4. **Clone the repo:**
   ```bash
   sudo mkdir -p /opt/radiantsound && sudo chown $USER /opt/radiantsound
   cd /opt/radiantsound
   git clone https://github.com/joey-radiant-sound/joey-radiant-sound.github.io.git .
   git checkout overhaul  # until we merge to main at launch
   ```
5. **Create `.env`** (gitignored) at the repo root:
   ```bash
   cat > .env <<'EOF'
   AUTH_SECRET=$(openssl rand -base64 32)
   AUTH_URL=https://radiantsoundwny.com
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=joey@radiantsoundwny.com
   SMTP_PASSWORD=...
   CONTACT_FORM_TO=joey@radiantsoundwny.com
   CONTACT_FORM_FROM=joey@radiantsoundwny.com
   AUTH_EMAIL_FROM=joey@radiantsoundwny.com
   EOF
   ```
6. **Bring the stack up:**
   ```bash
   docker compose up -d --build
   ```
7. **Initialize the database** (one-time, inside the running container):
   ```bash
   docker compose exec app npx prisma db push
   ```
8. **Verify:** visit `https://radiantsoundwny.com` (marketing site) and `https://radiantsoundwny.com/portal` (redirects to sign-in). First TLS cert issuance takes ~30s.
9. **Schedule nightly backups:**
   ```bash
   sudo cp scripts/backup.sh /usr/local/bin/radiantsound-backup
   sudo chmod +x /usr/local/bin/radiantsound-backup
   echo "0 3 * * * /usr/local/bin/radiantsound-backup >> /var/log/radiantsound-backup.log 2>&1" | sudo tee -a /etc/crontab
   ```

### Updates (after first deploy)

On the VPS:
```bash
cd /opt/radiantsound
git pull
docker compose up -d --build
# If schema changed:
docker compose exec app npx prisma db push
```

### Vercel — what to do

Vercel continues to host preview builds at https://radiant-sound-website.vercel.app for the **marketing-site routes only**. The portal will error there (no SQLite filesystem persistence on Vercel serverless). Production traffic goes to the VPS once DNS is cut over.

After the VPS is verified working at the production domain:
- Delete the Vercel project (or keep for previews; it's free)
- The `radiantsoundwny.com` DNS A record now points at the VPS, not Vercel

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
## Work Queue

_Updated: 2026-05-20 by Claude — Phase 1 marketing site shipped; Phase 2 portal at end of 2C polish. See `TODO.md` for the full launch-blocking checklist and `PHASE2.md` for the portal sub-phase map._

### ⏸ Awaiting Review
- [ ] **In-browser test of 2C planning-sheet polish** — exercise auto-save, Edit/Done flow, shuttle conditional, wedding-party reorder, `peopleInvolved` field
  - _Checkpoint:_ confirm 6-item batch lands as intended before 2D begins
- [ ] **WeddingsHero slideshow curation** — final 5-photo list (not used elsewhere on the site)
  - _Checkpoint:_ filenames from `_assetdump/originals/` or new uploads
- [ ] **Display font pick** — propose 2-3 display-font options (Phase 1D follow-up)
- [ ] **Hero highlight reel** — Joey editing; swap in when ready
- [ ] **`legacy.radiantsoundwny.com` subdomain** — keep accessible after launch or retire?
- [ ] **Social handles / URLs** for both footers (Weddings: IG/FB/Knot/WeddingWire; A Cappella: YT/IG/SoundCloud/Bandcamp)
- [ ] **VPS provisioning** — Joey runs the README "Portal Setup (self-hosted)" runbook ($5/mo Hetzner or DO box) so the portal can go live

### ▶ Ready to Work
- [ ] **Phase 2F: calendar + messaging** — couple-facing milestone timeline + lightweight in-portal message thread per project
- [x] **Rate-limit portal magic-link requests** — `requestMagicLink` (5/15min per IP) + admin invite (10/15min per IP) now use `lib/rate-limit.ts`. ✅ Done.

### 🚧 In Progress
_None mid-stream. Last push (`feat(2C): planning sheet polish — auto-save, edit mode, restyle`) is on `overhaul` cleanly; dev server running locally on :3000 for Joey's eyeball test._

### ✅ Recently Completed
- **Phase 2E** — invoicing: `Invoice` + `InvoiceLineItem` (integer cents), admin InvoicesPanel on the project page (create / line items / status DRAFT→SENT→PAID / delete), couple invoice list (DRAFT hidden), shared print-styled invoice view with browser print-to-PDF (`print:hidden` chrome). Zero new dependencies per Joey's minimize-third-party call.
- **Admin planning + archive** — admins edit any project's planning sheet via `?project=` (collision-safe); `Project.archivedAt` archives old weddings (couple loses access) with a separate `/portal/admin/archive` page.
- **Security** — magic-link sign-in + admin invite are IP rate-limited.
- **Dev tooling** — `/portal/dev` one-click login + `npm run db:seed`.
- **Phase 2D** — file sharing: `ProjectFile` model + `/api/files/upload` route handler + `/api/files/[id]` download + `/portal/files` couple view + Files panel embedded on admin project detail. PDF / image / audio / MP4 / MOV allowlist, 50 MB cap (`MAX_FILE_BYTES`), per-IP upload rate limit, auth scoped by `canAccessProject`. Backup script now archives `data/uploads/` alongside the SQLite db.
- **Modularity sweep** — split `EventsClient` (441 → 46 lines) into 4 focused files; extracted `<PlanningReadOnly>` from admin project page (351 → ~110 lines); shared client `_utils.ts`; new `parseAndAuth()` helper in `_server.ts`.
- **Phase 2C polish** — auto-save hook, display+Edit row pattern, light blue card styling, wedding-party Description + reorder, shuttle conditional field, events `peopleInvolved` replacing scripted announcement
- **Phase 2C** — spreadsheet-aligned planning sheet (6 sub-routes matching the MASTER xlsx tabs: General / Party / Events / Ceremony / Line Dances / Itinerary), with idempotent seeders for default events / ceremony segments / line dances / itinerary slots
- **Phase 2B** — admin invite flow + email allowlist + admin route group with role gating
- **Phase 2A** — portal foundation: Prisma + SQLite, Auth.js v5 magic-link via Nodemailer, `/portal/sign-in` + `/portal/check-email` + `/portal` gated dashboard, route-group layout split to kill the redirect loop
- **Portal infra** — self-hosted Docker + Caddy stack (replaces Vercel + Neon plan), `data/radiant.db` on disk, nightly `sqlite3 .backup` cron, dev SMTP fallback prints magic links to terminal
- **SMTP wired** — Google Workspace via `smtp.gmail.com` with app password; magic-link + contact-form emails sending from `joey@radiantsoundwny.com`
- **scripts/db.sh hardened** — no longer breaks on spaces / `<addr>` shell metacharacters in env values
- **npm db:push / db:studio / db:generate** — convenience scripts that load `.env.local` (Prisma CLI only reads `.env` by default)
- **Phase 1A–1I** — full marketing-site overhaul (homepage chooser, weddings + a cappella content, contact forms, animations, SEO, launch runbook)

