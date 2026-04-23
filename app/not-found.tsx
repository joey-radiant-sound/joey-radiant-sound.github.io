import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center py-24">
      <Container width="narrow" className="text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">
          404
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-5xl">
          Page not found.
        </h1>
        <p className="mt-6 text-lg text-muted">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-brand-500 px-7 py-3.5 text-base font-medium text-white transition-colors hover:bg-brand-600"
          >
            Go home
          </Link>
        </div>
      </Container>
    </section>
  );
}
