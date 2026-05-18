import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <section className="flex min-h-screen items-center py-16">
      <Container width="narrow">
        <div className="mx-auto max-w-md text-center">
          <p className="text-base font-semibold uppercase tracking-[0.2em] text-brand-600">
            Radiant Sound · Portal
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            Sign in
          </h1>
          <p className="mt-4 text-base text-muted">
            Enter the email Joey invited you with. We&rsquo;ll send a one-click
            sign-in link.
          </p>

          <div className="mt-10 text-left">
            <SignInFormWrapper searchParams={searchParams} />
          </div>
        </div>
      </Container>
    </section>
  );
}

async function SignInFormWrapper({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  return <SignInForm initialError={params.error} />;
}
