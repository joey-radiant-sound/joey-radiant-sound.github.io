# Architecture

Durable reference for how the Radiant Sound website is structured. Mirrors the execution plan at `~/.claude/plans/stateless-greeting-bunny.md` but lives with the code so it stays current as the site evolves.

See [README.md](./README.md) for stack/setup and [CONTENT.md](./CONTENT.md) for the copy source-of-truth draft.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 with `@theme` tokens in `app/globals.css` |
| Animations | GSAP + ScrollTrigger + Lenis (smooth scroll) + Intersection Observer |
| Forms | React Hook Form + Zod + Next.js Server Actions |
| Email (Phase 1) | Nodemailer via SMTP |
| Hosting | Vercel |
| Phase 2 | Auth.js v5 + Neon Postgres + Prisma + Cloudflare R2 |

---

## Routing tree

```
app/
├── layout.tsx                    Root: <html>, <body>, font, LenisProvider, base metadata
├── page.tsx                      "/"                    — HomeChooser
├── globals.css                   Tailwind + @theme tokens
├── not-found.tsx                 Shared 404
│
├── weddings/
│   ├── layout.tsx                WeddingsNav + WeddingsFooter; metadata template
│   ├── page.tsx                  "/weddings"
│   ├── about/page.tsx            "/weddings/about"
│   └── contact/
│       ├── page.tsx              "/weddings/contact"
│       └── actions.ts            server action: submitWeddingsContact()
│
└── acappella/
    ├── layout.tsx                AcappellaNav + AcappellaFooter
    ├── page.tsx                  "/acappella"
    ├── about/page.tsx            "/acappella/about"
    └── contact/
        ├── page.tsx              "/acappella/contact"
        └── actions.ts            server action: submitAcappellaContact()
```

Single root layout owns global concerns (fonts, smooth scroll, base metadata). Nested sub-site layouts own audience-specific chrome (nav, footer) and extend metadata via the `title` template. Homepage renders under the root layout only — no chrome, just the chooser on the gradient.

---

## Component inventory

```
components/
├── layout/
│   ├── WeddingsNav.tsx
│   ├── AcappellaNav.tsx
│   ├── WeddingsFooter.tsx
│   ├── AcappellaFooter.tsx
│   └── Container.tsx
│
├── ui/
│   ├── Button.tsx                Primary/secondary/ghost; <Link> or <button>
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   └── DatePicker.tsx
│
├── sections/
│   ├── HomeChooser.tsx           Two-panel gradient chooser (client)
│   ├── WeddingsHero.tsx
│   ├── AcappellaHero.tsx
│   ├── ServicePillars.tsx        Generic; props = { title, pillars[] }
│   ├── HowWeWork.tsx             Weddings 3 principles (§2.3)
│   ├── ProcessSteps.tsx          Weddings 4-step process (§2.4)
│   ├── Testimonials.tsx          Weddings + WeddingWire link-out (§2.5)
│   ├── ClientRoster.tsx          A cappella institution-grouped list (§3.3)
│   ├── WhyBookUs.tsx             A cappella bullets (§3.4)
│   ├── ServiceArea.tsx           Shared
│   └── CallToAction.tsx          Reusable CTA band
│
├── forms/
│   ├── WeddingsContactForm.tsx
│   └── AcappellaContactForm.tsx
│
└── animations/
    ├── LenisProvider.tsx
    ├── ScrollReveal.tsx
    ├── Parallax.tsx
    └── PinnedSection.tsx

lib/
├── email.ts                      Nodemailer transport + sendContactEmail()
├── rate-limit.ts                 In-memory IP token bucket
├── animations/
│   ├── gsap.ts                   Singleton gsap + ScrollTrigger registration
│   └── lenis.ts                  Lenis config factory
└── content/
    ├── weddings.ts               Typed copy modules
    └── acappella.ts
```

---

## CONTENT.md → code mapping

| CONTENT.md section | Consumed by |
|---|---|
| §1 Homepage chooser | `app/page.tsx` → `<HomeChooser />` |
| §2.1 Weddings hero | `lib/content/weddings.ts: hero` → `<WeddingsHero />` |
| §2.2 Pillars (3) | `lib/content/weddings.ts: pillars` → `<ServicePillars />` |
| §2.3 How we work (3 principles) | `lib/content/weddings.ts: principles` → `<HowWeWork />` |
| §2.4 Four-step process | `lib/content/weddings.ts: processSteps` → `<ProcessSteps />` |
| §2.5 Testimonials | `lib/content/weddings.ts: testimonials` → `<Testimonials />` |
| §2.6 Service area + CTA | `lib/content/weddings.ts: serviceArea` → `<ServiceArea />` + `<CallToAction />` |
| §3.1 A Cappella hero | `lib/content/acappella.ts: hero` → `<AcappellaHero />` |
| §3.2 Pillars (3) | `lib/content/acappella.ts: pillars` → `<ServicePillars />` |
| §3.3 Roster (Varsity Vocals first) | `lib/content/acappella.ts: roster` → `<ClientRoster />` |
| §3.4 Why groups book us | `lib/content/acappella.ts: whyBookUs` → `<WhyBookUs />` |
| §3.5 Service area + CTA | `lib/content/acappella.ts: serviceArea` → `<ServiceArea />` + `<CallToAction />` |
| §3.6 A cappella testimonials | **CUT** per v2 comment |
| §4.W Weddings About | `app/weddings/about/page.tsx` (concise, close to info sheet) |
| §4.A A Cappella About | `app/acappella/about/page.tsx` |
| §5.W Weddings form | `components/forms/WeddingsContactForm.tsx` + Zod in `app/weddings/contact/actions.ts` |
| §5.A A Cappella form | `components/forms/AcappellaContactForm.tsx` + Zod in `app/acappella/contact/actions.ts` |
| §6.W Weddings footer | `components/layout/WeddingsFooter.tsx` |
| §6.A A Cappella footer | `components/layout/AcappellaFooter.tsx` |
| §7 Weddings tagline [A] | `WeddingsHero` + `WeddingsFooter` |
| §7 A Cappella tagline [B] | `AcappellaHero` + `AcappellaFooter` |
| §8/§9 TODO items | `TODO.md` + inline `// TODO:` markers |

---

## Styling system

- **Design tokens** live in `app/globals.css` under `@theme`. Tailwind v4 auto-generates utilities (`bg-brand-500`, `text-ink`, `font-sans`, etc.) from them.
- **Brand palette**: blue scale anchored on legacy `#64baeb` / `#3a89c9`; neutrals `ink`, `ink-soft`, `muted`, `surface`, `surface-alt`; gradient stops for the homepage chooser.
- **Typography**: body `Inter` via `next/font/google`, wired through CSS variable `--font-inter`. Display font TBD (Phase 1D review).
- **Sub-site theming**: sub-site layouts apply `data-audience="weddings|acappella"` so audience-specific accent overrides can use CSS variable cascade.
- **No component libraries**. All primitives in `components/ui/`.

---

## Animation primitives

- `lib/animations/gsap.ts` — registers ScrollTrigger once, exports a singleton `gsap`.
- `LenisProvider` (client) — initializes Lenis on `<html>`, runs RAF loop, teaches ScrollTrigger about Lenis's virtual scroll.
- `ScrollReveal` — IntersectionObserver + GSAP fade/slide-in on enter; honors `prefers-reduced-motion`.
- `Parallax` — scroll-progress-tied translateY via ScrollTrigger.
- `PinnedSection` — ScrollTrigger `pin: true` for Apple-style layered reveals (later).

---

## Contact form data flow

```
[Browser]
  WeddingsContactForm (client)
    RHF + Zod client-side validation
    Honeypot field (name="company", hidden)
    Submit → server action submitWeddingsContact(formData)
              ↓
[Server]
  actions.ts
    1. Validate with Zod (server = source of truth)
    2. Honeypot check — silently "succeed" if filled
    3. Rate limit (IP-keyed, via lib/rate-limit.ts)
    4. lib/email.ts → sendContactEmail({ source: "weddings", ... })
         subject: "[WEDDINGS] New inquiry from {firstName} {lastName}"
         to: joey@radiantsoundwny.com
    5. Return { ok: true } or { ok: false, error }
              ↓
[Browser] inline success/error — no page navigation.
```

A cappella form is structurally identical with `source: "acappella"`.

---

## Deployment guardrail

Until Phase 1I launch:

- `radiantsoundwny.com` stays on GitHub Pages (the legacy Coming Soon page lives on `main` branch via the `CNAME` file).
- Vercel serves previews at `*.vercel.app` only — **do not attach `radiantsoundwny.com`** as a custom domain to the Vercel project.
- Vercel production branch is temporarily `feat/overhaul-phase-1`; it flips to `main` at launch after the overhaul merges.
- Never re-add the `CNAME` file to `feat/overhaul-phase-1` — its presence on `main` is what keeps GitHub Pages routing the live domain.

Launch sequence is documented in the plan file (`~/.claude/plans/stateless-greeting-bunny.md`, Phase 1I).

---

## Phase 2 (future — reserved)

Client portal under `/portal/*`. Auth.js v5, Neon Postgres, Prisma, Cloudflare R2, Google Calendar OAuth, `@react-pdf/renderer` for invoices, Argon2id for passwords. Not built in Phase 1.
