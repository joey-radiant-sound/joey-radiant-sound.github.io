import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Portal", template: "%s · Radiant Sound Portal" },
  robots: { index: false, follow: false },
};

/**
 * Unauthenticated portal layout. Wraps sign-in / check-email pages
 * under app/portal/(auth)/*. Deliberately does NOT call auth() —
 * if it did, visiting /portal/sign-in unauthenticated would
 * redirect back to /portal/sign-in forever.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex min-h-screen flex-col bg-surface">{children}</div>;
}
