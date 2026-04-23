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
| 1G | Animation layer (Lenis, GSAP, scroll reveals) | 🔨 Up next |
| 1H | Asset integration (real photos/videos) | ⏳ Pending |
| 1I | SEO, polish, DNS flip, launch | ⏳ Pending |

## License

Copyright © Radiant Sound, LLC. All rights reserved.
