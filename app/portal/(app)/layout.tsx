import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Portal", template: "%s · Radiant Sound Portal" },
  description: "Radiant Sound client portal.",
  robots: { index: false, follow: false },
};

/**
 * Authenticated portal layout. Wraps everything under
 * app/portal/(app)/* — gated server-side. The unauthenticated
 * sign-in / check-email pages live under app/portal/(auth)/* as a
 * SIBLING route group, so this layout never runs for them (no
 * redirect loop).
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
