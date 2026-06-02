# Quick Commands

Copy-paste reference for the Radiant Sound site. Every block assumes you're in the project root:

```bash
cd "/Users/joeymac2/Desktop/Claude Workspace/repos/personal/radiant-sound-website"
```

> Tip: paste blocks **without** the `#` comment lines if your shell complains — zsh sometimes chokes on apostrophes inside comments.

---

## Run the site locally

```bash
npm run dev
```
Then open <http://localhost:3000>. Stop it with **Ctrl+C** in that terminal.

If the page won't load ("can't connect"), the dev server just isn't running — start it again with the command above.

### Run it and keep a log file (lets Claude read errors)
```bash
npm run dev:log
```
Same thing, but also writes everything to `.logs/dev.log`. If you hit an error, tell Claude "check the log."

---

## If localhost is stuck or "port already in use"

Kill any orphaned servers, then restart:
```bash
pkill -f "next dev"; pkill -f "next-server"
npm run dev
```

---

## Portal database (SQLite)

```bash
npm run db:push      # apply schema changes to the database
npm run db:seed      # reset to a clean test state (admin + test couple + 1 project)
npm run db:studio    # open a visual browser of the database
```

**Important:** stop the dev server (Ctrl+C) before `db:push` or `db:seed` — a running server holds the database file open.

---

## Test the portal fast

1. Start the server: `npm run dev`
2. Go to <http://localhost:3000/portal/dev>
3. Click **Sign in** next to admin or the test couple — no email needed
4. To switch roles, go back to `/portal/dev` and pick the other one

(Only works locally — the dev login is disabled in production.)

---

## Save & push your work to GitHub

```bash
git add -A
git commit -m "describe what changed"
git push origin overhaul
```

See what's changed before committing:
```bash
git status
```

---

## Check the code is healthy

```bash
npm run lint     # catch code-style / bug issues
npm run build    # full production build (also type-checks everything)
```

---

## Preview site (Vercel, marketing pages only)

Live preview URL: <https://radiant-sound-website.vercel.app>

Deploy the current commit to it:
```bash
npx vercel --prod --yes
```

---

## Where things live

| What | Path |
|---|---|
| Marketing pages | `app/weddings/`, `app/acappella/`, `app/page.tsx` |
| Portal | `app/portal/` |
| Database schema | `prisma/schema.prisma` |
| Local secrets (gitignored) | `.env.local` |
| Phase plan + status | `PHASE2.md`, `README.md` (Work Queue section) |
| Outstanding tasks | `TODO.md` |
