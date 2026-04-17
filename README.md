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

## Structure

```
app/                     # Next.js App Router pages + server actions
  layout.tsx             # Root layout, metadata, fonts
  page.tsx               # Homepage — dual-path chooser (Weddings / A Cappella)
  weddings/              # Weddings sub-site
  acappella/             # A Cappella sub-site
  about/                 # About Us
  services/              # Services
  contact/               # Contact form + server action

components/
  ui/                    # Buttons, inputs, primitives
  layout/                # Nav, Footer, Container
  animations/            # Reusable GSAP/Lenis wrappers
  sections/              # Hero, Testimonials, ServiceGrid, etc.

lib/
  animations/            # GSAP scroll-trigger helpers, Lenis setup
  email.ts               # Contact form email send

public/
  images/{weddings,acappella,shared}/
  videos/{weddings,acappella}/
  favicon-*.png, apple-touch-icon.png, icon-192.png

_assetdump/              # Raw asset drop zone (gitignored — see MANIFEST.md)
CONTENT.md               # First-pass copy for all sections (review/edit before design)
```

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # ESLint
```

Environment variables go in `.env.local` (gitignored). Required for Phase 1:

```
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
CONTACT_FORM_TO=      # where inbound form submissions go
```

## Branching

- `legacy-jekyll` — snapshot of the pre-overhaul Jekyll site. **Do not modify.** Reference only.
- `main` — production branch. Auto-deploys to `radiantsoundwny.com`.
- `feat/*` — feature branches. Auto-deploy to Vercel preview URLs.

Phase 1 overhaul work lives on `feat/overhaul-phase-1` and merges into `main` at launch.

## Deployment

- Vercel connected to `main` branch → production.
- DNS: `radiantsoundwny.com` points at Vercel (apex + `www` CNAME).
- Legacy Jekyll site preserved on the `legacy-jekyll` branch; optionally serve at `legacy.radiantsoundwny.com` if needed.

## Project Status

**Phase 1 (Marketing Site):** in progress on `feat/overhaul-phase-1`.

Current step: awaiting content sign-off in [`CONTENT.md`](./CONTENT.md) before design work begins.

See [plan](~/.claude/plans/stateless-greeting-bunny.md) for full roadmap.

## License

Copyright © Radiant Sound, LLC. All rights reserved.
