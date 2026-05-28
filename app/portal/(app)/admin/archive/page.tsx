import Link from "next/link";
import { prisma } from "@/lib/db";
import { UnarchiveButton } from "./UnarchiveButton";

export const metadata = { title: "Archived weddings" };

export default async function ArchivedProjectsList() {
  const projects = await prisma.project.findMany({
    where: { archivedAt: { not: null } },
    orderBy: { archivedAt: "desc" },
    include: { _count: { select: { members: true } } },
  });

  return (
    <section>
      <Link
        href="/portal/admin"
        className="mb-6 inline-flex items-center text-sm font-medium text-muted hover:text-ink"
      >
        ← Active projects
      </Link>

      <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
        Archived weddings
      </h1>
      <p className="mt-2 text-base text-muted">
        Past weddings. Couples here have lost portal access. Unarchive to
        restore it.
      </p>

      {projects.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-black/15 bg-white p-12 text-center">
          <p className="text-base text-muted">Nothing archived yet.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl bg-white ring-1 ring-black/5">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 bg-surface-alt text-xs font-semibold uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Event date</th>
                <th className="px-5 py-3">Archived</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-black/5 last:border-0 hover:bg-surface-alt/50"
                >
                  <td className="px-5 py-4 font-medium text-ink">
                    <Link
                      href={`/portal/admin/projects/${p.id}`}
                      className="hover:underline"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-ink-soft">
                    {p.eventDate
                      ? p.eventDate.toISOString().slice(0, 10)
                      : "—"}
                  </td>
                  <td className="px-5 py-4 text-ink-soft">
                    {p.archivedAt
                      ? p.archivedAt.toISOString().slice(0, 10)
                      : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <UnarchiveButton id={p.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
