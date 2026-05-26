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

### 2D — File sharing (local disk) — detailed plan

**Purpose.** Couples upload PDFs / images (contracts, planning printouts, song lists, inspiration boards) and download whatever the admin uploads to them (invoices, signed contracts, playlists). Admins see and manage all files per project. No external object store — files live on the same VPS disk as the SQLite database.

**Locked scope (v1):**
- Per-project file list (no global library)
- Both directions: couples upload + admins upload, both see everyone's uploads on the same project
- Common types only: PDF, JPG, PNG, WEBP, MP3, MP4, MOV. No size limit beyond a server cap (50 MB/file default — tunable).
- No previews beyond image thumbnails the browser renders natively
- No virus scanning in v1 (flag for Phase 3 — `clamav` sidecar if abuse becomes a real risk)
- No expiring share links — auth gate is the protection

**Out of scope for 2D:**
- Public/anonymous file sharing
- Folders or tags
- Versioning
- Drag-to-reorder
- Inline preview of non-image files

**Schema:**
```prisma
model ProjectFile {
  id          String   @id @default(cuid())
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  uploadedById String?            // who uploaded — User or null if user deleted
  uploadedBy   User?   @relation("ProjectFileUploadedBy", fields: [uploadedById], references: [id])

  /// Stored filename on disk (cuid + extension). Never exposes the
  /// original name to the URL — the user-facing name lives in `name`.
  storageKey   String   @unique
  /// Human-readable original filename for display + download.
  name         String
  mimeType     String
  /// Size in bytes — pulled from the upload at write time.
  sizeBytes    Int

  createdAt    DateTime @default(now())
}
```

**Storage layout** (under the `portal_data` Docker volume, alongside the SQLite db):
```
/app/data/
├── radiant.db
└── uploads/
    └── <projectId>/
        └── <storageKey>          # e.g. clxxx123.pdf
```
- The directory tree mirrors the database — easy mental model + easy rsync backups.
- `storageKey` is `cuid() + originalExtension` so collisions are impossible and the URL never reveals the original filename.

**Upload flow:**
1. Client POSTs `multipart/form-data` to `POST /api/files/upload?projectId=…`.
2. Route handler:
   a. `auth()` → must be signed in.
   b. Resolve `projectId`; verify the caller is either a `ProjectMember` of that project, or `ADMIN`. Reject 403 otherwise.
   c. Parse the file from the form. Validate `mimeType` against the allowlist; reject 415 if not allowed. Reject 413 if `size > MAX_FILE_BYTES` (default 50 MB).
   d. Generate `storageKey = cuid() + extension`.
   e. Stream the file to `data/uploads/<projectId>/<storageKey>`, creating the directory if missing.
   f. Insert a `ProjectFile` row.
   g. Return `{ id, name, sizeBytes }`.
3. Client revalidates the project's file list.

**Download flow:**
1. `GET /api/files/[id]`.
2. Route handler:
   a. `auth()` → must be signed in.
   b. Look up the `ProjectFile`; verify caller is a member of `file.projectId` or `ADMIN`.
   c. `Response` with the file streamed from disk + `Content-Type` from `mimeType` + `Content-Disposition: attachment; filename="<name>"` so browsers download with the original name.

**Delete:**
- Server action `deleteProjectFile(id)` — same auth check, removes row + unlinks the disk file.
- Only the uploader OR an admin can delete (couples can't delete each other's uploads if they share a project).

**UI surface:**
- **Couple view** at `/portal/files` (new sub-route): list of files for their project, upload button, download links, delete on own uploads.
- **Admin view** on `/portal/admin/projects/[id]`: new "Files" section, same list + upload + delete for any file on that project.
- One reusable `<FilesPanel projectId={…} canManageAll={role === "ADMIN"} />` client component used in both views.

**Server-action / route boundaries:**
- Multipart uploads need a route handler (server actions don't accept `multipart/form-data` raw streams) → `app/api/files/upload/route.ts`.
- Downloads same — need a route handler that streams bytes → `app/api/files/[id]/route.ts`.
- Delete + list can stay as server actions / server-component data fetches (no multipart).

**Security checklist for 2D:**
- Auth on both endpoints (`auth()` from `@/lib/auth`).
- Per-project authorization — verify membership/ADMIN BEFORE any disk access.
- Mime-type allowlist + size limit enforced server-side.
- `storageKey` is opaque — original filename never appears in URLs.
- `Content-Disposition: attachment` on download (avoids inline-rendered scripts in case of crafted SVG/HTML uploads — also reject `image/svg+xml` from the allowlist for safety).
- Rate-limit uploads per IP (reuse `lib/rate-limit.ts`).
- Path-traversal defense: validate `projectId` is a cuid (regex), `storageKey` from DB only — never accept a client-supplied path.

**Infra updates:**
- `docker-compose.yml`: already mounts `portal_data:/app/data` — covers `data/uploads/` automatically. No change needed.
- `scripts/backup.sh`: extend to `tar -czf radiant-uploads-<ts>.tgz /app/data/uploads/` alongside the SQLite backup. Same 30-day retention.
- `.env.example`: add `MAX_FILE_BYTES=52428800` (50 MB) so the cap is configurable per environment.

**Modularity follow-through (using sweep deliverables):**
- New server actions use `parseAndAuth()` from `_server.ts`.
- Client form uses `s()` from `_utils.ts` if needed.
- Files panel split: `FilesPanel.tsx` (list rendering) + `FileUploadForm.tsx` (the multipart form) + `actions.ts` + `route.ts` for the HTTP endpoints. No file > ~200 lines.

**Files this phase creates/modifies:**
```
prisma/schema.prisma                                 # +ProjectFile model + Project relation
app/api/files/upload/route.ts                        # POST handler
app/api/files/[id]/route.ts                          # GET (download) handler
app/portal/(app)/files/page.tsx                      # couple view
app/portal/(app)/files/FilesPanel.tsx                # shared list component
app/portal/(app)/files/FileUploadForm.tsx            # multipart form (client)
app/portal/(app)/files/actions.ts                    # listFiles, deleteProjectFile
app/portal/(app)/admin/projects/[id]/page.tsx        # +<FilesPanel canManageAll />
app/portal/(app)/layout.tsx                          # +nav link to /portal/files for couples
.env.example                                         # +MAX_FILE_BYTES
scripts/backup.sh                                    # +tar uploads
```

**Acceptance tests (manual, since we still have no test harness):**
1. Couple uploads a PDF → appears in their list → admin sees it on the project detail page.
2. Admin uploads a JPG → couple sees it on `/portal/files`.
3. Couple A signs in → cannot download Couple B's file by guessing the id (403).
4. Upload > 50 MB → 413 with a friendly message.
5. Upload an `.exe` (or any disallowed mime) → 415, no file written to disk.
6. Couple deletes own file → row + disk file both gone. Couple cannot delete admin uploads.
7. Restart the container → uploaded files survive (volume mount works).
8. Run `scripts/backup.sh` → archive contains both `radiant-*.db` and the uploads tarball.

**Rough sub-order during implementation:**
1. Schema + db push
2. Upload route + storage helpers
3. Download route
4. `actions.ts` (list + delete) using `parseAndAuth`
5. `FilesPanel` + `FileUploadForm`
6. Couple route at `/portal/files`
7. Admin embed on project detail
8. Backup script update
9. Build + lint + dev-server smoke test of the 8 acceptance items

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
