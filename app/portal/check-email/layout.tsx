// Sibling unauthenticated layout — see app/portal/sign-in/layout.tsx
// for the rationale.
export default function CheckEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex min-h-screen flex-col bg-surface">{children}</div>;
}
