import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  resolveTabCtx,
  ensureWeddingDetails,
  seedEventAnnouncements,
} from "../_server";
import { EventsClient } from "./EventsClient";

export default async function EventsAndMusicPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const ctx = await resolveTabCtx(searchParams);
  if (!ctx) redirect("/portal");

  await seedEventAnnouncements(ctx.projectId);
  const details = await ensureWeddingDetails(ctx.projectId);
  const [announcements, songs] = await Promise.all([
    prisma.eventAnnouncement.findMany({
      where: { projectId: ctx.projectId },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.playlistSong.findMany({
      where: { projectId: ctx.projectId },
      orderBy: [{ listType: "asc" }, { sortOrder: "asc" }],
    }),
  ]);

  return (
    <section>
      <header className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          Events & Music Requests
        </h2>
        <p className="mt-2 text-sm text-muted">
          DJ questions, the key moments and who&rsquo;s involved, and your
          playlists.
        </p>
      </header>

      <EventsClient
        projectId={ctx.projectId}
        questions={{
          takeAudienceRequests: details.takeAudienceRequests,
          cocktailGenre: details.cocktailGenre,
          receptionGenres: details.receptionGenres,
          announceLastCall: details.announceLastCall,
          announceShuttle: details.announceShuttle,
          shuttleTimes: details.shuttleTimes,
          coupleAnnouncement: details.coupleAnnouncement,
          miscDetails: details.miscDetails,
        }}
        announcements={announcements.map((a) => ({
          id: a.id,
          eventKey: a.eventKey,
          customTitle: a.customTitle,
          peopleInvolved: a.peopleInvolved,
          songName: a.songName,
          songArtist: a.songArtist,
          notes: a.notes,
        }))}
        songs={songs.map((s) => ({
          id: s.id,
          listType: s.listType,
          songName: s.songName,
          songArtist: s.songArtist,
          notes: s.notes,
        }))}
      />
    </section>
  );
}
