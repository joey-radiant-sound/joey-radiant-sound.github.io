/**
 * Sign-in layout — overrides the parent `app/portal/layout.tsx`'s
 * session gate so unauthenticated visitors can actually see the form.
 *
 * Important: this layout MUST exist as a sibling layout under the
 * sign-in segment, otherwise the parent portal layout's redirect to
 * /portal/sign-in would loop forever.
 */
export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex min-h-screen flex-col bg-surface">{children}</div>;
}
