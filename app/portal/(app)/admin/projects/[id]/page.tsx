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
      timeline: { orderBy: { sortOrder: "asc" } },
      music: { orderBy: [{ category: "asc" }, { sortOrder: "asc" }] },
      vendors: { orderBy: { sortOrder: "asc" } },
      equipmentNotes: { orderBy: { sortOrder: "asc" } },
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

      {/* Read-only planning-sheet view — Phase 2C. Only the couple
          can edit (via /portal/planning); admins see the snapshot. */}
      <PlanningReadOnly
        timeline={project.timeline}
        music={project.music}
        vendors={project.vendors}
        equipmentNotes={project.equipmentNotes}
      />
    </section>
  );
}

function PlanningReadOnly({
  timeline,
  music,
  vendors,
  equipmentNotes,
}: {
  timeline: { id: string; time: string | null; title: string; notes: string | null }[];
  music: { id: string; category: string; title: string; artist: string | null; notes: string | null }[];
  vendors: { id: string; role: string; name: string; company: string | null; phone: string | null; email: string | null; notes: string | null }[];
  equipmentNotes: { id: string; category: string; body: string }[];
}) {
  const total =
    timeline.length + music.length + vendors.length + equipmentNotes.length;

  return (
    <div className="mt-14">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
        Planning sheet (read-only)
      </h2>
      {total === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-black/15 bg-white p-4 text-sm text-muted">
          Couple hasn&rsquo;t started the planning sheet yet.
        </p>
      ) : (
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <ReadOnlyBlock
            heading="Timeline"
            empty="No events yet"
            rows={timeline.map((t) => ({
              key: t.id,
              left: t.time ?? "—",
              right: t.title + (t.notes ? ` — ${t.notes}` : ""),
            }))}
          />
          <ReadOnlyBlock
            heading="Music"
            empty="No music yet"
            rows={music.map((m) => ({
              key: m.id,
              left: m.category,
              right:
                m.title +
                (m.artist ? ` — ${m.artist}` : "") +
                (m.notes ? ` (${m.notes})` : ""),
            }))}
          />
          <ReadOnlyBlock
            heading="Vendors"
            empty="No vendors yet"
            rows={vendors.map((v) => ({
              key: v.id,
              left: v.role,
              right:
                v.name +
                (v.company ? ` · ${v.company}` : "") +
                (v.phone || v.email
                  ? ` (${[v.phone, v.email].filter(Boolean).join(", ")})`
                  : ""),
            }))}
          />
          <ReadOnlyBlock
            heading="Equipment / logistics"
            empty="No notes yet"
            rows={equipmentNotes.map((n) => ({
              key: n.id,
              left: n.category,
              right: n.body,
            }))}
          />
        </div>
      )}
    </div>
  );
}

function ReadOnlyBlock({
  heading,
  empty,
  rows,
}: {
  heading: string;
  empty: string;
  rows: { key: string; left: string; right: string }[];
}) {
  return (
    <div className="rounded-lg bg-white p-5 ring-1 ring-black/5">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
        {heading}
      </p>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {rows.map((r) => (
            <li key={r.key} className="grid grid-cols-[120px_1fr] gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                {r.left}
              </span>
              <span className="text-ink-soft">{r.right}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
