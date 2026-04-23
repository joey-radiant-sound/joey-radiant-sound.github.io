# TODO

Outstanding items for the Phase 1 marketing-site overhaul. Grouped by what's blocking which phase. Resolve before launch.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the structure and `~/.claude/plans/stateless-greeting-bunny.md` for the full phased plan.

---

## Needed from Joey (non-blocking during construction)

- [ ] **GitHub remote** — `gh auth login` then confirm where to push (`joecassata/radiant-sound-website` private?).
- [ ] **Vercel project** — create, link to GitHub repo, set production branch to `feat/overhaul-phase-1`. **Do NOT attach `radiantsoundwny.com` custom domain yet** — that happens at launch (Phase 1I).
- [ ] **SMTP credentials** (production) — either Joey's provider or Resend's free tier (3k emails/mo). Dev uses Ethereal/Mailtrap.
- [ ] **Social handles / URLs** for the two footers:
  - Weddings: Instagram, Facebook, The Knot, WeddingWire
  - A Cappella: YouTube, Instagram, SoundCloud / Bandcamp
- [ ] **Display font pick** — I'll propose 2–3 options in Phase 1D (wedding hero preview).
- [ ] **Hero highlight reel** — Joey editing; swap in when ready. Fallback YouTube URL: `https://www.youtube.com/watch?v=iK-JwYT6g-s`.
- [ ] **`legacy.radiantsoundwny.com` subdomain** — keep the old Jekyll site publicly accessible after launch, or let it retire? (Currently preserved on `legacy-jekyll` branch either way.)

---

## CONTENT.md — v2 items to resolve during construction

From `CONTENT.md` §8 "TODO items" + Joey's inline v2 comments:

- [ ] **§3.3 Roster** — put **Varsity Vocals** at the top.
- [ ] **§3.5 Service area** — "across the United States and even internationally" (replacing the Northeast/Midwest framing).
- [ ] **§3.6 A cappella testimonials** — **cut** ("scratch this").
- [ ] **§4.W Weddings About** — rewrite: stick closer to the info sheet, concise, not arrogant. The two paragraphs in v2 are flagged "bad".
- [ ] **§7 Taglines** — confirmed picks: [A] weddings, [B] a cappella.
- [ ] **Roster spelling / formatting** (§3.3) — Joey to confirm all institution names.
- [ ] **§2.5 Testimonials** — final list of curated wedding reviews + WeddingWire profile URL for link-out.
- [ ] **A cappella service area** — "a cappella festivals → will travel further?" Joey's note.

---

## Phase milestones (tracked here as they complete)

- [x] **Phase 1A** — Design tokens, Inter font, `ARCHITECTURE.md`, `TODO.md`, root layout wired.
- [x] Phase 1A (deferred) — GitHub push, Vercel project, first preview URL live at [radiant-sound-website.vercel.app](https://radiant-sound-website.vercel.app).
- [x] **Phase 1B** — Nav + footer + routing shell for all 6 sub-site routes. All routes click through; build + lint clean.
- [x] **Phase 1C** — Homepage chooser. Dual-path hover/tap panels on full-viewport gradient; Unsplash placeholders (TODO(1H): swap for real assets).
- [x] **Phase 1D** — Weddings content pages. Hero, 3 pillars, 3 principles, 4-step process, testimonials + WeddingWire link, service area, CTA. About page written as concise draft leaning on principles (flagged for Joey review — info-sheet source needed for final copy).
- [x] **Phase 1E** — A Cappella content pages. Hero, 3 pillars, featured Varsity Vocals + institution-grouped roster, why-book-us, service area, CTA. About page pulls §4.A verbatim. Tagline [B] "Production built for voices." locked in hero + footer.
- [x] **Phase 1F** — Contact forms + email. RHF-free `useActionState` + server actions with Zod validation, honeypot, IP rate limit (3/15min), Nodemailer SMTP. Both forms send tagged emails (`[WEDDINGS]`/`[A CAPPELLA]`) to joey@radiantsoundwny.com. See `.env.example` for SMTP dev/prod setup.
- [x] **Phase 1G** — Animation layer. Lenis smooth scroll wired at root; `ScrollReveal` IntersectionObserver + CSS transitions applied to all section-level content on `/weddings` and `/acappella`; sub-site nav bars become solid/blurred once scrolled. All honors `prefers-reduced-motion`. GSAP still available for Phase 2 layered-reveal moments.
- [~] **Phase 1H** — Asset integration (photo pass done). 7 raw photos processed to web sizes; HomeChooser + both hero backdrops now use real imagery; `images.remotePatterns` for Unsplash removed. **Pending Joey:** hero video curation/compression (2 raw `.mp4` files totalling ~4.4GB) and categorization of the remaining JPG originals. See `_assetdump/MANIFEST.md`.
- [ ] **Phase 1I** — SEO, Lighthouse polish, prod SMTP cutover, DNS flip, merge to `main`.

---

## Known inline markers

Search the codebase for `// TODO:` or `{/* TODO: */}` for placeholder references that need real content/assets before launch.
