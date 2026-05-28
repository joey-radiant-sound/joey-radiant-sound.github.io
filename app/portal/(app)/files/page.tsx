import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { FilesPanel, type FileRow } from "./FilesPanel";

export const metadata = { title: "Files" };

/**
 * Couple-facing files page. Admins see the same data embedded on the
 * project detail page — they get bounced to /portal/admin here.
 */
export default async function FilesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/portal/sign-in");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session.user as any).role as string | undefined;
  if (role === "ADMIN") redirect("/portal/admin");

  const membership = await prisma.projectMember.findFirst({
    where: { userId: session.user.id, project: { archivedAt: null } },
    include: { project: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" },
  });
  if (!membership) {
    return (
      <Container className="py-16">
        <p className="text-base text-muted">
          No wedding linked to your account yet. Joey will set you up soon.
        </p>
      </Container>
    );
  }

  const rows = await prisma.projectFile.findMany({
    where: { projectId: membership.projectId },
    orderBy: { createdAt: "desc" },
    include: {
      uploadedBy: {
        select: { firstName: true, lastName: true, email: true, role: true },
      },
    },
  });

  const myUserId = session.user.id;
  const files: FileRow[] = rows.map((f) => {
    const name = f.uploadedBy
      ? [f.uploadedBy.firstName, f.uploadedBy.lastName]
          .filter(Boolean)
          .join(" ") ||
        (f.uploadedBy.role === "ADMIN" ? "Radiant Sound" : f.uploadedBy.email)
      : null;
    return {
      id: f.id,
      name: f.name,
      mimeType: f.mimeType,
      sizeBytes: f.sizeBytes,
      createdAt: f.createdAt.toISOString(),
      uploadedByName: name,
      isMine: f.uploadedById === myUserId,
    };
  });

  return (
    <Container className="py-10 md:py-14">
      <Link
        href="/portal"
        className="mb-6 inline-flex items-center text-sm font-medium text-muted hover:text-ink"
      >
        ← Dashboard
      </Link>

      <header className="mb-8">
        <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-600">
          Files
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          {membership.project.title}
        </h1>
        <p className="mt-2 text-base text-muted">
          Share contracts, invoices, vendor docs, photos. Anything we both
          need lives here.
        </p>
      </header>

      <FilesPanel projectId={membership.projectId} files={files} />
    </Container>
  );
}
