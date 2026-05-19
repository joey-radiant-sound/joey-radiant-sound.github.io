import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { ClientTabs } from "./ClientTabs";

export const metadata = { title: "Planning sheet" };

/**
 * Planning-sheet sub-route layout. Renders the 6-tab nav for every
 * /portal/planning/* page. Admins are bounced — only couples edit.
 */
export default async function PlanningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/portal/sign-in");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session.user as any).role;
  if (role === "ADMIN") redirect("/portal/admin");

  return (
    <Container className="py-10 md:py-14">
      <Link
        href="/portal"
        className="mb-6 inline-flex items-center text-sm font-medium text-muted hover:text-ink"
      >
        ← Dashboard
      </Link>

      <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
        Planning sheet
      </h1>

      {/* Tab nav — sticky on scroll. ActiveTab styling handled by the
          ClientTabs component (needs usePathname). */}
      <ClientTabs />

      <div className="mt-8">{children}</div>
    </Container>
  );
}
