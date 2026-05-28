import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { ClientTabs } from "./ClientTabs";

export const metadata = { title: "Planning sheet" };

/**
 * Planning-sheet sub-route layout. Renders the 6-tab nav for every
 * /portal/planning/* page.
 *
 * Layouts don't receive searchParams in the App Router, so the
 * project resolution + admin/couple redirect logic lives in each tab
 * page (which does get searchParams). The layout only gates that a
 * user is signed in; ClientTabs preserves the `?project=` param
 * across tab navigation for admins.
 */
export default async function PlanningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/portal/sign-in");

  return (
    <Container className="py-10 md:py-14">
      <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
        Planning sheet
      </h1>

      <ClientTabs />

      <div className="mt-8">{children}</div>
    </Container>
  );
}
