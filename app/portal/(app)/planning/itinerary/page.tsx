import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { resolveTabCtx, seedItinerary } from "../_server";
import { ItineraryClient } from "./ItineraryClient";

export default async function ItineraryPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const ctx = await resolveTabCtx(searchParams);
  if (!ctx) redirect("/portal");

  await seedItinerary(ctx.projectId);
  const items = await prisma.itineraryItem.findMany({
    where: { projectId: ctx.projectId },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <section>
      <header className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          Itinerary
        </h2>
        <p className="mt-2 text-sm text-muted">
          Half-hour slots from 9 AM to midnight. Drop in events the DJ needs
          to know about — bridal party intros, toasts, cake cutting, last
          song, etc. Empty slots get ignored.
        </p>
      </header>

      <ItineraryClient
        projectId={ctx.projectId}
        items={items.map((i) => ({
          id: i.id,
          time: i.time,
          event: i.event,
          notes: i.notes,
        }))}
      />
    </section>
  );
}
