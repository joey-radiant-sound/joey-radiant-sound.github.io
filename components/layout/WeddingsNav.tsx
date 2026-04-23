import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/weddings", label: "Home" },
  { href: "/weddings/about", label: "About" },
];

/**
 * Wedding sub-site navigation. Rendered inside app/weddings/layout.tsx.
 * Phase 1B: simple flex nav. Scroll-aware behavior lands in Phase 1G.
 */
export function WeddingsNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-3 text-sm font-medium text-muted transition-colors hover:text-ink"
            aria-label="Back to Radiant Sound home"
          >
            <Image
              src="/images/shared/logo-white.svg"
              alt=""
              width={28}
              height={28}
              className="invert brightness-0"
              priority
            />
            <span className="hidden sm:inline">Radiant Sound</span>
          </Link>

          <nav className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <Button href="/weddings/contact" size="md" className="ml-2">
              Get a quote
            </Button>
          </nav>
        </div>
      </Container>
    </header>
  );
}
