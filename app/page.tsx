import Link from "next/link";

// TODO(1C): replace this stub with the real <HomeChooser /> — gradient
// background, two hover/tap panels, label + image reveal, smooth
// route transition into the sub-site. This placeholder just gives a
// working link-through to both sub-sites for Phase 1B.
export default function Home() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-6 py-24 text-white"
      style={{
        backgroundImage:
          "linear-gradient(135deg, var(--color-gradient-start) 0%, var(--color-gradient-mid) 50%, var(--color-gradient-end) 100%)",
      }}
    >
      <div className="w-full max-w-3xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-200">
          Radiant Sound
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-balance md:text-7xl">
          Which brings you here?
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-base text-brand-100/80 md:text-lg">
          {/* Phase 1B placeholder — real chooser lands in Phase 1C. */}
          Pick a path. Both paths lead to years of experience and
          purpose-built production.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          <Link
            href="/weddings"
            className="group rounded-2xl border border-white/15 bg-white/5 p-8 text-left backdrop-blur transition-all hover:border-white/30 hover:bg-white/10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
              For couples
            </p>
            <p className="mt-3 text-2xl font-semibold">Weddings</p>
            <p className="mt-6 text-sm text-brand-100/70 group-hover:text-white">
              Enter the weddings site →
            </p>
          </Link>

          <Link
            href="/acappella"
            className="group rounded-2xl border border-white/15 bg-white/5 p-8 text-left backdrop-blur transition-all hover:border-white/30 hover:bg-white/10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-200">
              For groups
            </p>
            <p className="mt-3 text-2xl font-semibold">A Cappella</p>
            <p className="mt-6 text-sm text-brand-100/70 group-hover:text-white">
              Enter the a cappella site →
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
