import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Check your email",
};

export default function CheckEmailPage() {
  return (
    <section className="flex min-h-screen items-center py-16">
      <Container width="narrow" className="text-center">
        <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-600">
          Almost there
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Check your email
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-muted">
          We sent a sign-in link to your inbox. Click it to access your portal.
          The link expires in 24 hours.
        </p>
      </Container>
    </section>
  );
}
