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
- [ ] Phase 1A (deferred) — GitHub push, Vercel project, first preview URL.
- [ ] **Phase 1B** — Nav + footer + routing shell for all 6 sub-site routes.
- [ ] **Phase 1C** — Homepage chooser.
- [ ] **Phase 1D** — Weddings content pages (`/weddings`, `/weddings/about`).
- [ ] **Phase 1E** — A Cappella content pages (`/acappella`, `/acappella/about`).
- [ ] **Phase 1F** — Contact forms + email (both sub-sites).
- [ ] **Phase 1G** — Animation layer (Lenis + ScrollReveal + Parallax + nav behavior).
- [ ] **Phase 1H** — Asset integration (swap placeholders for real photos/videos from `_assetdump/`).
- [ ] **Phase 1I** — SEO, Lighthouse polish, prod SMTP cutover, DNS flip, merge to `main`.

---

## Known inline markers

Search the codebase for `// TODO:` or `{/* TODO: */}` for placeholder references that need real content/assets before launch.
