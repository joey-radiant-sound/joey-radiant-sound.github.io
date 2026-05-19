import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAuthedProject, ensureWeddingDetails } from "../_server";
import { PartyClient } from "./PartyClient";

export default async function WeddingPartyPage() {
  const ctx = await getAuthedProject();
  if (!ctx) redirect("/portal/sign-in");

  const details = await ensureWeddingDetails(ctx.projectId);
  const members = await prisma.weddingPartyMember.findMany({
    where: { projectId: ctx.projectId },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <section>
      <header className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          Wedding Party
        </h2>
        <p className="mt-2 text-sm text-muted">
          Order top-to-bottom is the order the DJ will announce. Add a special
          title (Maid of Honor, Ring Bearer, etc.) if relevant, and write out
          tricky pronunciations.
        </p>
      </header>

      <PartyClient
        announce={details.announceWeddingParty ?? null}
        members={members.map((m) => ({
          id: m.id,
          bridesmaidName: m.bridesmaidName,
          groomsmanName: m.groomsmanName,
          title: m.title,
          songName: m.songName,
          songArtist: m.songArtist,
          notes: m.notes,
        }))}
      />
    </section>
  );
}
