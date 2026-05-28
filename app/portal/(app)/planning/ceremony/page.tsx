import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import {
  resolveTabCtx,
  ensureWeddingDetails,
  seedCeremonyMusic,
} from "../_server";
import { CeremonyClient } from "./CeremonyClient";

export default async function CeremonyPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const ctx = await resolveTabCtx(searchParams);
  if (!ctx) redirect("/portal");

  await seedCeremonyMusic(ctx.projectId);
  const details = await ensureWeddingDetails(ctx.projectId);
  const segments = await prisma.ceremonyMusicEntry.findMany({
    where: { projectId: ctx.projectId },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <section>
      <header className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          Ceremony
        </h2>
        <p className="mt-2 text-sm text-muted">
          Music for the ceremony plus a few details we need to plan the setup.
          (Ceremony packages only.)
        </p>
      </header>

      <CeremonyClient
        projectId={ctx.projectId}
        questions={{
          ceremonyWalkOutOrder: details.ceremonyWalkOutOrder,
          ceremonyWirelessMic: details.ceremonyWirelessMic,
          ceremonyOutdoors: details.ceremonyOutdoors,
          ceremonyOtherDetails: details.ceremonyOtherDetails,
        }}
        segments={segments.map((s) => ({
          id: s.id,
          segment: s.segment,
          customLabel: s.customLabel,
          songName: s.songName,
          songArtist: s.songArtist,
          notes: s.notes,
        }))}
      />
    </section>
  );
}
