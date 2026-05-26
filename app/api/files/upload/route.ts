import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canAccessProject } from "@/lib/project-access";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  isAllowedMime,
  isValidProjectId,
  maxFileBytes,
  newStorageKey,
  writeUpload,
} from "@/lib/files";

/**
 * Multipart upload for ProjectFile. Body: `multipart/form-data` with a
 * `file` field and a `projectId` field. Authenticated; the caller
 * must be a member of `projectId` (or ADMIN). Validates mime + size.
 *
 * Server actions can't accept raw multipart streams, so the upload
 * endpoint lives here as a route handler. Delete / list stay as
 * server actions.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError(401, "Sign in required.");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session.user as any).role as string | undefined;

  // Cheap per-IP throttle to keep an authenticated user from saturating
  // the disk. 12 uploads / 15 min per IP.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const rl = checkRateLimit(`upload:${ip}`, 12, 15 * 60 * 1000);
  if (!rl.ok) {
    return jsonError(429, "Too many uploads. Try again in a few minutes.");
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError(400, "Invalid form data.");
  }

  const projectId = (form.get("projectId") ?? "").toString();
  if (!isValidProjectId(projectId)) {
    return jsonError(400, "Missing or invalid projectId.");
  }
  if (!(await canAccessProject(session.user.id, role, projectId))) {
    return jsonError(403, "Not authorized for this project.");
  }

  const fileField = form.get("file");
  if (!(fileField instanceof File)) {
    return jsonError(400, "No file provided.");
  }

  if (!isAllowedMime(fileField.type)) {
    return jsonError(
      415,
      `Unsupported file type (${fileField.type || "unknown"}). Allowed: PDF, JPG, PNG, WEBP, GIF, MP3, M4A, WAV, MP4, MOV.`,
    );
  }
  if (fileField.size > maxFileBytes()) {
    const mb = (maxFileBytes() / (1024 * 1024)).toFixed(0);
    return jsonError(413, `File too large. Max ${mb} MB.`);
  }
  if (fileField.size === 0) {
    return jsonError(400, "Empty file.");
  }

  const storageKey = newStorageKey(fileField.type);

  let sizeBytes: number;
  try {
    sizeBytes = await writeUpload(projectId, storageKey, fileField);
  } catch (err) {
    console.error("[files upload] write failed", err);
    return jsonError(500, "Failed to save file.");
  }

  const row = await prisma.projectFile.create({
    data: {
      projectId,
      uploadedById: session.user.id,
      storageKey,
      name: sanitizeDisplayName(fileField.name),
      mimeType: fileField.type,
      sizeBytes,
    },
  });

  return Response.json({
    id: row.id,
    name: row.name,
    sizeBytes: row.sizeBytes,
  });
}

function jsonError(status: number, message: string): Response {
  return Response.json({ error: message }, { status });
}

/**
 * Trim the original filename and drop anything that would mess with
 * Content-Disposition (newlines, quotes). Keeps the extension.
 */
function sanitizeDisplayName(raw: string): string {
  return raw
    .replace(/[\r\n"]/g, "")
    .trim()
    .slice(0, 200) || "upload";
}
