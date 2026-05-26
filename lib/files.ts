import "server-only";

import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Server-only filesystem helpers for ProjectFile uploads/downloads.
 *
 * Storage layout:
 *   {UPLOAD_ROOT}/<projectId>/<storageKey>
 * where storageKey = "{cuid}.{ext}" — no original filename leaks.
 *
 * Path resolution: `process.cwd()` is the Next.js project root in dev
 * (where `data/` already lives via the Prisma SQLite path) and `/app`
 * in the Docker container. Both resolve `data/uploads/...` correctly.
 */

export const UPLOAD_ROOT = path.join(process.cwd(), "data", "uploads");

/**
 * MIME types couples + admins can upload. Deliberately conservative:
 * no SVG (XSS via embedded scripts), no generic application/octet-
 * stream, no archives.
 */
const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  // Documents
  "application/pdf": "pdf",
  // Images
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  // Audio
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/wav": "wav",
  // Video — large; subject to MAX_FILE_BYTES
  "video/mp4": "mp4",
  "video/quicktime": "mov",
};

export function isAllowedMime(mime: string): boolean {
  return mime in ALLOWED_MIME_TO_EXT;
}

export function extensionForMime(mime: string): string {
  return ALLOWED_MIME_TO_EXT[mime] ?? "bin";
}

/** Max bytes per file, from env. Default 50 MB. */
export function maxFileBytes(): number {
  const raw = process.env.MAX_FILE_BYTES;
  if (!raw) return 50 * 1024 * 1024;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 50 * 1024 * 1024;
}

/**
 * Build a fresh storage key for an upload. 32 hex chars from
 * `node:crypto` — collision-free for the scales we care about, no
 * dependency on a separate cuid library. Matches the
 * `[a-z0-9]{20,40}` shape the project-id validator expects.
 */
export function newStorageKey(mime: string): string {
  return `${randomBytes(16).toString("hex")}.${extensionForMime(mime)}`;
}

/** Absolute path on disk for a given (projectId, storageKey). */
export function diskPath(projectId: string, storageKey: string): string {
  return path.join(UPLOAD_ROOT, projectId, storageKey);
}

/**
 * Validate a projectId before using it in filesystem paths. Cuids are
 * `[a-z0-9]+`, no separators — anything else (`..`, `/`, dots) is
 * rejected so an attacker can't walk out of the uploads directory.
 */
export function isValidProjectId(projectId: string): boolean {
  return /^[a-z0-9]{20,40}$/.test(projectId);
}

/**
 * Stream a multipart `File` (web spec, exposed by Request.formData())
 * to disk and return its byte size. Creates the project directory
 * lazily.
 */
export async function writeUpload(
  projectId: string,
  storageKey: string,
  file: File,
): Promise<number> {
  if (!isValidProjectId(projectId)) {
    throw new Error("Invalid projectId");
  }
  const dir = path.join(UPLOAD_ROOT, projectId);
  await fs.mkdir(dir, { recursive: true });
  const dest = path.join(dir, storageKey);
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(dest, bytes);
  return bytes.byteLength;
}

/** Best-effort delete; swallows ENOENT so stale rows can be cleaned. */
export async function deleteFromDisk(
  projectId: string,
  storageKey: string,
): Promise<void> {
  try {
    await fs.unlink(diskPath(projectId, storageKey));
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: string }).code === "ENOENT"
    ) {
      return;
    }
    throw err;
  }
}

/** Read whole file into a Buffer for the download route. */
export async function readForDownload(
  projectId: string,
  storageKey: string,
): Promise<Buffer> {
  return fs.readFile(diskPath(projectId, storageKey));
}
