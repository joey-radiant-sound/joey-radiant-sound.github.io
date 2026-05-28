import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/Button";

export default async function AdminProjectsList() {
  const [projects, archivedCount] = await Promise.all([
    prisma.project.findMany({
      where: { archivedAt: null },
      orderBy: [{ eventDate: "asc" }, { createdAt: "desc" }],
      include: { _count: { select: { members: true } } },
    }),
    prisma.project.count({ where: { archivedAt: { not: null } } }),
  ]);

  return (
    <section>
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Projects
          </h1>
          <p className="mt-2 text-base text-muted">
            Active weddings.{" "}
            {archivedCount > 0 && (
              <Link
                href="/portal/admin/archive"
                className="font-medium text-brand-600 hover:text-brand-700"
              >
                Archived ({archivedCount}) →
              </Link>
            )}
          </p>
        </div>
        <Button href="/portal/admin/projects/new" size="md">
          New project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/15 bg-white p-12 text-center">
          <p className="text-base text-muted">
            No projects yet. Create the first one to get rolling.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/5">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 bg-surface-alt text-xs font-semibold uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Event date</th>
                <th className="px-5 py-3">Venue</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Members</th>
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
                    {[p.venueName, p.venueCity].filter(Boolean).join(", ") ||
                      "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-ink-soft">{p._count.members}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
