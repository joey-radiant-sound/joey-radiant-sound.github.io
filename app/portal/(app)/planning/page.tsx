import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import {
  TimelineSection,
  MusicSection,
  VendorsSection,
  EquipmentSection,
} from "./Sections";

export const metadata = { title: "Planning sheet" };

export default async function PlanningSheetPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/portal/sign-in");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAdmin = (session.user as any).role === "ADMIN";
  if (isAdmin) {
    // Admins manage planning via /portal/admin/projects/[id] (read-only
    // for now). Bounce them so couples are the only editors.
    redirect("/portal/admin");
  }

  const membership = await prisma.projectMember.findFirst({
    where: { userId: session.user.id },
    include: {
      project: {
        include: {
          timeline: { orderBy: { sortOrder: "asc" } },
          music: { orderBy: [{ category: "asc" }, { sortOrder: "asc" }] },
          vendors: { orderBy: { sortOrder: "asc" } },
          equipmentNotes: { orderBy: { sortOrder: "asc" } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!membership) {
    return (
      <Container className="py-16">
        <p className="text-base text-muted">
          No wedding linked to your account yet. Joey will set you up soon.
        </p>
      </Container>
    );
  }

  const { project } = membership;

  return (
    <Container className="py-12 md:py-16">
      <Link
        href="/portal"
        className="mb-6 inline-flex items-center text-sm font-medium text-muted hover:text-ink"
      >
        ← Dashboard
      </Link>

      <header className="mb-12">
        <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-600">
          Planning sheet
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          {project.title}
        </h1>
        <p className="mt-2 text-base text-muted">
          {project.eventDate
            ? project.eventDate.toISOString().slice(0, 10)
            : "Date TBD"}
          {project.venueName && ` · ${project.venueName}`}
        </p>
      </header>

      <div className="flex flex-col gap-14">
        <TimelineSection events={project.timeline} />
        <MusicSection items={project.music} />
        <VendorsSection items={project.vendors} />
        <EquipmentSection notes={project.equipmentNotes} />
      </div>
    </Container>
  );
}
