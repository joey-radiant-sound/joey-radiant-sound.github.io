import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canAccessProject } from "@/lib/project-access";
import { readForDownload } from "@/lib/files";

/**
 * Authenticated download of a ProjectFile. The caller must be a
 * member of the file's project, or an ADMIN. We attach the original
 * `name` via Content-Disposition so the browser saves it sensibly,
 * but the URL itself only ever carries the row id.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Sign in required.", { status: 401 });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session.user as any).role as string | undefined;

  const file = await prisma.projectFile.findUnique({ where: { id } });
  if (!file) return new Response("Not found.", { status: 404 });

  if (!(await canAccessProject(session.user.id, role, file.projectId))) {
    return new Response("Forbidden.", { status: 403 });
  }

  let bytes: Buffer;
  try {
    bytes = await readForDownload(file.projectId, file.storageKey);
  } catch (err) {
    console.error("[files download] disk read failed", err);
    return new Response("File missing on disk.", { status: 410 });
  }

  // Force download (don't render inline) — defense-in-depth against
  // anything mime-sniffed by the browser.
  const safeName = file.name.replace(/"/g, "");
  const buf = new Uint8Array(bytes);
  return new Response(buf, {
    status: 200,
    headers: {
      "Content-Type": file.mimeType || "application/octet-stream",
      "Content-Length": String(bytes.byteLength),
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
