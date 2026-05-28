import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { resolveTabCtx, seedLineDances } from "../_server";
import { LineDancesClient } from "./LineDancesClient";

export default async function LineDancesPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const ctx = await resolveTabCtx(searchParams);
  if (!ctx) redirect("/portal");

  await seedLineDances(ctx.projectId);
  const items = await prisma.lineDance.findMany({
    where: { projectId: ctx.projectId },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <section>
      <header className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          Line Dances
        </h2>
        <p className="mt-2 text-sm text-muted">
          Toggle the line dances you want — leave everything else off. Add
          your own if we missed any.
        </p>
      </header>

      <LineDancesClient
        projectId={ctx.projectId}
        items={items.map((i) => ({
          id: i.id,
          name: i.name,
          wanted: i.wanted,
          isDefault: i.isDefault,
        }))}
      />
    </section>
  );
}
