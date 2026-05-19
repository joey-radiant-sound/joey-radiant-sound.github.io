import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";

/**
 * Admin layout. Gates everything under /portal/admin to users with
 * role === "ADMIN". Couples that try to navigate here get bounced
 * back to the portal dashboard.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (session?.user as any)?.role;
  if (role !== "ADMIN") {
    redirect("/portal");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10">
      <nav className="mb-10 flex items-center gap-6 text-sm font-medium text-muted">
        <Link href="/portal/admin" className="hover:text-ink">
          Projects
        </Link>
        <span className="text-muted/40">·</span>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
          Admin
        </span>
      </nav>
      {children}
    </div>
  );
}
