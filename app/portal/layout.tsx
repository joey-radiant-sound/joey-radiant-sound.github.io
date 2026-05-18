import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "Portal",
    template: "%s · Radiant Sound Portal",
  },
  description: "Radiant Sound client portal.",
  robots: { index: false, follow: false },
};

/**
 * Portal layout. Gates every nested route via server-side session check
 * (Auth.js v5 with database sessions can't be checked in Edge
 * middleware — has to happen here in Node). Sign-in + check-email
 * pages opt out via segment-relative routes that don't render this
 * layout if we move them under (auth) later; for now they live under
 * /portal and use their own minimal layout via redirect skip below.
 */
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Allow the sign-in / check-email pages to render unauthenticated by
  // gating around them. We can't read the path here directly in a
  // layout — instead, each unauthenticated leaf page is responsible
  // for not requiring auth (sign-in/check-email/error). The layout's
  // job is to gate the *dashboard*.
  //
  // To keep this clean, sign-in pages live in their own route group:
  // /portal/(unauth)/sign-in. The (unauth) layout below them does NOT
  // call auth() — only this layout does, applied to dashboard pages
  // under /portal/(app)/*.
  //
  // For now (2A) we have only the dashboard at /portal — gate it
  // here. Sign-in pages are under /portal/sign-in which DOES go
  // through this layout, so we let them through if there's no
  // session: see the conditional render below.
  const session = await auth();

  if (!session?.user) {
    redirect("/portal/sign-in");
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 md:px-10">
          <Link href="/portal" className="text-base font-semibold text-ink">
            Radiant Sound · Portal
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/portal/sign-in" });
            }}
          >
            <button
              type="submit"
              className="text-sm font-medium text-muted transition-colors hover:text-ink"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
