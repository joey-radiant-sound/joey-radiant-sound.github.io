import {
  EVENT_LABEL_BY_KEY,
  CEREMONY_SEGMENT_LABEL,
  PLAYLIST_TYPES,
} from "../planning/_constants";

/**
 * Read-only snapshot of a couple's planning sheet, shown on the admin
 * project detail page. The couple edits the live data via
 * /portal/planning/*; admins just view what's there.
 */

// Loose row shapes — we accept whatever the Prisma include gives us
// at the call site, scoped to just the fields we render. Keeping these
// inline here (rather than importing planning's row types) lets this
// component remain self-contained.
type Project = {
  details: WeddingDetailsRow | null;
  partyMembers: PartyMemberRow[];
  announcements: AnnouncementRow[];
  ceremonyMusic: CeremonyMusicRow[];
  playlistSongs: PlaylistSongRow[];
  lineDances: LineDanceRow[];
  itineraryItems: ItineraryRow[];
};

type WeddingDetailsRow = {
  weddingDate: Date | null;
  brideFirstName: string | null;
  brideLastName: string | null;
  groomFirstName: string | null;
  groomLastName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  receptionVenueName: string | null;
  receptionVenueAddress: string | null;
  ceremonyVenueName: string | null;
  ceremonyVenueAddress: string | null;
  venueManagerName: string | null;
  venueManagerPhone: string | null;
  venueManagerEmail: string | null;
  photographerName: string | null;
  photographerEmail: string | null;
  videographerName: string | null;
  videographerEmail: string | null;
  guestCount: number | null;
  earliestArrival: string | null;
  djArrival: string | null;
  linenColor: string | null;
  generalNotes: string | null;
  takeAudienceRequests: boolean | null;
  cocktailGenre: string | null;
  receptionGenres: string | null;
  announceLastCall: boolean | null;
  announceShuttle: boolean | null;
  shuttleTimes: string | null;
  coupleAnnouncement: string | null;
  miscDetails: string | null;
  announceWeddingParty: boolean | null;
  ceremonyWalkOutOrder: string | null;
  ceremonyWirelessMic: boolean | null;
  ceremonyOutdoors: boolean | null;
  ceremonyOtherDetails: string | null;
};

type PartyMemberRow = {
  id: string;
  sortOrder: number;
  title: string | null;
  bridesmaidName: string | null;
  groomsmanName: string | null;
  songName: string | null;
  songArtist: string | null;
};

type AnnouncementRow = {
  id: string;
  eventKey: string;
  customTitle: string | null;
  peopleInvolved: string | null;
  songName: string | null;
  songArtist: string | null;
  notes: string | null;
};

type CeremonyMusicRow = {
  id: string;
  segment: string;
  customLabel: string | null;
  songName: string | null;
  songArtist: string | null;
  notes: string | null;
};

type PlaylistSongRow = {
  id: string;
  listType: string;
  songName: string;
  songArtist: string | null;
  notes: string | null;
};

type LineDanceRow = {
  id: string;
  name: string;
  wanted: boolean;
  isDefault: boolean;
};

type ItineraryRow = {
  id: string;
  time: string;
  event: string | null;
  notes: string | null;
};

export function PlanningReadOnly({ project }: { project: Project }) {
  const d = project.details;

  return (
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
              ["Take audience requests", fmtBool(d.takeAudienceRequests)],
              ["Cocktail genre", d.cocktailGenre],
              ["Reception genres", d.receptionGenres],
              ["Last call announce", fmtBool(d.announceLastCall)],
              ["Shuttle announce", fmtBool(d.announceShuttle)],
              ["Shuttle times", d.shuttleTimes],
              ["Couple announcement", d.coupleAnnouncement],
              ["Misc details", d.miscDetails],
              ["Announce wedding party", fmtBool(d.announceWeddingParty)],
            ]}
          />
          <ReadOnlyKV
            heading="Ceremony Questions"
            rows={[
              ["Walk-out order", d.ceremonyWalkOutOrder],
              ["Wireless mic needed", fmtBool(d.ceremonyWirelessMic)],
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
              }${a.peopleInvolved ? ` · ${a.peopleInvolved}` : ""}${
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
                right:
                  `${i.event ?? ""}${i.notes ? ` — ${i.notes}` : ""}`.trim() ||
                  "—",
              }))}
          />
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-dashed border-black/15 bg-white p-4 text-sm text-muted">
          Couple hasn&rsquo;t started the planning sheet yet.
        </p>
      )}
    </div>
  );
}

/* ---------- internal helpers ---------- */

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
