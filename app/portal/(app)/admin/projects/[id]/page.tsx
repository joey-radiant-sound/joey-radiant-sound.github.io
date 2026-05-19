import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { InviteCoupleForm } from "./InviteCoupleForm";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      members: {
        include: { user: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!project) notFound();

  return (
    <section>
      <Link
        href="/portal/admin"
        className="mb-6 inline-flex items-center text-sm font-medium text-muted hover:text-ink"
      >
        ← All projects
      </Link>

      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            {project.title}
          </h1>
          <p className="mt-2 text-base text-muted">
            {project.eventDate
              ? project.eventDate.toISOString().slice(0, 10)
              : "Date TBD"}
            {project.venueName && ` · ${project.venueName}`}
            {project.venueCity && `, ${project.venueCity}`}
          </p>
        </div>
        <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100">
          {project.status}
        </span>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_3fr]">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
            Members
          </h2>
          {project.members.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-black/15 bg-white p-4 text-sm text-muted">
              No members yet. Invite the couple →
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-black/5 rounded-lg bg-white ring-1 ring-black/5">
              {project.members.map((m) => (
                <li key={m.id} className="px-4 py-3">
                  <p className="text-sm font-medium text-ink">
                    {[m.user.firstName, m.user.lastName]
                      .filter(Boolean)
                      .join(" ") || m.user.email}
                  </p>
                  <p className="text-xs text-muted">{m.user.email}</p>
                  <p className="mt-1 text-xs text-muted/70">
                    {m.role} ·{" "}
                    {m.user.emailVerified
                      ? "Signed in once"
                      : "Invite pending"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
            Invite a couple
          </h2>
          <div className="mt-4 rounded-lg bg-white p-6 ring-1 ring-black/5">
            <InviteCoupleForm projectId={project.id} />
          </div>
        </div>
      </div>
    </section>
  );
}
