import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/acappella", label: "Home" },
  { href: "/acappella/about", label: "About" },
];

/**
 * A cappella sub-site navigation. Mirrors WeddingsNav — full-width
 * gradient-backed bar with edge-flush brand on the left and nav + CTA
 * on the right.
 */
export function AcappellaNav() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-white/10"
      style={{
        backgroundImage: "url('/images/shared/brand-gradient.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex h-16 items-center justify-between gap-6 px-6 md:px-10">
        <Link
          href="/"
          className="flex items-center transition-opacity hover:opacity-80"
          aria-label="Back to Radiant Sound home"
        >
          <Image
            src="/images/shared/logo-white.svg"
            alt="Radiant Sound"
            width={180}
            height={40}
            priority
            className="h-8 w-auto md:h-9"
          />
        </Link>

        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/85 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Button
            href="/acappella/contact"
            variant="secondary"
            size="md"
            className="ml-2"
          >
            Contact
          </Button>
        </nav>
      </div>
    </header>
  );
}
