import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { InviteCoupleForm } from "./InviteCoupleForm";
import {
  EVENT_LABEL_BY_KEY,
  CEREMONY_SEGMENT_LABEL,
  PLAYLIST_TYPES,
} from "../../../planning/_constants";

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
      details: true,
      partyMembers: { orderBy: { sortOrder: "asc" } },
      announcements: { orderBy: { sortOrder: "asc" } },
      playlistSongs: {
        orderBy: [{ listType: "asc" }, { sortOrder: "asc" }],
      },
      ceremonyMusic: { orderBy: { sortOrder: "asc" } },
      lineDances: { orderBy: { sortOrder: "asc" } },
      itineraryItems: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!project) notFound();

  const d = project.details;

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

      {/* Read-only planning-sheet snapshot. Couple edits via
          /portal/planning; we just display here. */}
      <div className="mt-14">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
          Planning sheet (read-only)
        </h2>

        {d ? (
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <ReadOnlyKV
              heading="General Info"
              rows={[
                ["Wedding date", fmtDate(d.weddingDate)],
                [
                  "Couple",
                  joinSp(
                    [d.brideFirstName, d.brideLastName].filter(Boolean).join(" "),
                    [d.groomFirstName, d.groomLastName].filter(Boolean).join(" "),
                    " & ",
                  ),
                ],
                ["Contact phone", d.contactPhone],
                ["Contact email", d.contactEmail],
                ["Reception venue", d.receptionVenueName],
                ["Reception address", d.receptionVenueAddress],
                ["Ceremony venue", d.ceremonyVenueName],
                ["Ceremony address", d.ceremonyVenueAddress],
                ["Venue manager", d.venueManagerName],
                ["Manager phone", d.venueManagerPhone],
                ["Manager email", d.venueManagerEmail],
                ["Photographer", d.photographerName],
                ["Photographer email", d.photographerEmail],
                ["Videographer", d.videographerName],
                ["Videographer email", d.videographerEmail],
                ["Guest count", d.guestCount?.toString() ?? null],
                ["Guests arrive", d.earliestArrival],
                ["DJ setup", d.djArrival],
                ["Linen color", d.linenColor],
                ["Notes", d.generalNotes],
              ]}
            />
            <ReadOnlyKV
              heading="DJ Questions"
              rows={[
                [
                  "Take audience requests",
                  fmtBool(d.takeAudienceRequests),
                ],
                ["Cocktail genre", d.cocktailGenre],
                ["Reception genres", d.receptionGenres],
                ["Last call announce", fmtBool(d.announceLastCall)],
                ["Shuttle announce", fmtBool(d.announceShuttle)],
                ["Couple announcement", d.coupleAnnouncement],
                ["Misc details", d.miscDetails],
                ["Announce wedding party", fmtBool(d.announceWeddingParty)],
              ]}
            />
            <ReadOnlyKV
              heading="Ceremony Questions"
              rows={[
                ["Walk-out order", d.ceremonyWalkOutOrder],
                [
                  "Wireless mic needed",
                  fmtBool(d.ceremonyWirelessMic),
                ],
                ["Outdoors", fmtBool(d.ceremonyOutdoors)],
                ["Other", d.ceremonyOtherDetails],
              ]}
            />
            <ReadOnlyList
              heading="Wedding Party"
              empty="No wedding-party intros."
              rows={project.partyMembers.map((m) => ({
                key: m.id,
                left: m.title ?? `Pair ${m.sortOrder / 10}`,
                right: `${joinSp(
                  m.bridesmaidName,
                  m.groomsmanName,
                  " & ",
                )}${m.songName ? ` — ${m.songName}` : ""}${
                  m.songArtist ? ` (${m.songArtist})` : ""
                }`,
              }))}
            />
            <ReadOnlyList
              heading="Event Announcements"
              empty="None yet."
              rows={project.announcements.map((a) => ({
                key: a.id,
                left:
                  a.eventKey === "CUSTOM"
                    ? a.customTitle ?? "Custom"
                    : EVENT_LABEL_BY_KEY[a.eventKey] ?? a.eventKey,
                right: `${a.songName ?? "—"}${
                  a.songArtist ? ` — ${a.songArtist}` : ""
                }${a.announcement ? ` · "${a.announcement}"` : ""}${
                  a.notes ? ` · ${a.notes}` : ""
                }`,
              }))}
            />
            <ReadOnlyList
              heading="Ceremony Music"
              empty="None yet."
              rows={project.ceremonyMusic.map((c) => ({
                key: c.id,
                left:
                  c.segment === "CUSTOM"
                    ? c.customLabel ?? "Custom"
                    : CEREMONY_SEGMENT_LABEL[c.segment] ?? c.segment,
                right: `${c.songName ?? "—"}${
                  c.songArtist ? ` — ${c.songArtist}` : ""
                }${c.notes ? ` · ${c.notes}` : ""}`,
              }))}
            />
            <ReadOnlyList
              heading="Playlists"
              empty="No song requests."
              rows={project.playlistSongs.map((p) => ({
                key: p.id,
                left:
                  PLAYLIST_TYPES[p.listType as keyof typeof PLAYLIST_TYPES] ??
                  p.listType,
                right: `${p.songName}${
                  p.songArtist ? ` — ${p.songArtist}` : ""
                }${p.notes ? ` · ${p.notes}` : ""}`,
              }))}
            />
            <ReadOnlyList
              heading="Line Dances"
              empty="No selections."
              rows={project.lineDances
                .filter((l) => l.wanted)
                .map((l) => ({
                  key: l.id,
                  left: l.isDefault ? "Default" : "Custom",
                  right: l.name,
                }))}
            />
            <ReadOnlyList
              heading="Itinerary"
              empty="Empty."
              rows={project.itineraryItems
                .filter((i) => i.event || i.notes)
                .map((i) => ({
                  key: i.id,
                  left: i.time,
                  right: `${i.event ?? ""}${
                    i.notes ? ` — ${i.notes}` : ""
                  }`.trim() || "—",
                }))}
            />
          </div>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed border-black/15 bg-white p-4 text-sm text-muted">
            Couple hasn&rsquo;t started the planning sheet yet.
          </p>
        )}
      </div>
    </section>
  );
}

/* ---------- read-only helpers ---------- */

function fmtDate(d: Date | null | undefined): string | null {
  return d ? d.toISOString().slice(0, 10) : null;
}

function fmtBool(b: boolean | null | undefined): string | null {
  if (b === true) return "Yes";
  if (b === false) return "No";
  return null;
}

function joinSp(
  a: string | null | undefined,
  b: string | null | undefined,
  sep: string,
): string {
  return [a, b].filter(Boolean).join(sep);
}

function ReadOnlyKV({
  heading,
  rows,
}: {
  heading: string;
  rows: [string, string | null | undefined][];
}) {
  const filled = rows.filter(([, v]) => v != null && v !== "");
  return (
    <div className="rounded-lg bg-white p-5 ring-1 ring-black/5">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
        {heading}
      </p>
      {filled.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Not filled in yet.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2 text-sm">
          {filled.map(([k, v]) => (
            <li key={k} className="grid grid-cols-[180px_1fr] gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted">
                {k}
              </span>
              <span className="text-ink-soft">{v}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ReadOnlyList({
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
            <li key={r.key} className="grid grid-cols-[140px_1fr] gap-3">
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
