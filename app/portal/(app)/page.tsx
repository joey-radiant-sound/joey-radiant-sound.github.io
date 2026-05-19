import { auth } from "@/lib/auth";
import { Container } from "@/components/ui/Container";

export default async function PortalDashboard() {
  const session = await auth();
  const name =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (session?.user as any)?.firstName ?? session?.user?.name ?? session?.user?.email;

  return (
    <section className="py-16 md:py-24">
      <Container>
        <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-600">
          Welcome
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          Hi {name}.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Your wedding planning workspace is coming online. Planning sheet,
          file sharing, invoicing, and a timeline will land here over the
          next few releases.
        </p>
        <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 ring-1 ring-brand-100">
          Phase 2A · Portal foundation
        </p>
      </Container>
    </section>
  );
}
