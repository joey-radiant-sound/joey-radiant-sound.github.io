import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { isDevLoginEnabled } from "@/lib/dev-login";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { signInAsDev } from "./actions";

export const metadata = {
  title: "Dev login",
  robots: { index: false, follow: false },
};

/**
 * Dev-only one-click sign-in. Lists every user and signs in as the one
 * you pick — no magic link. 404s unless isDevLoginEnabled().
 */
export default async function DevLoginPage() {
  if (!isDevLoginEnabled()) notFound();

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    include: {
      projectMembers: {
        include: { project: { select: { title: true } } },
      },
    },
  });

  return (
    <section className="flex min-h-screen items-center py-16">
      <Container width="narrow">
        <div className="mx-auto max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-600">
            Dev only · not available in production
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            One-click sign in
          </h1>
          <p className="mt-3 text-base text-muted">
            Skip the magic link while testing. Pick a user below.
          </p>

          {users.length === 0 ? (
            <p className="mt-8 rounded-lg border border-dashed border-black/15 bg-white p-4 text-sm text-muted">
              No users yet. Run <code>npm run db:seed</code> to create an
              admin + a test couple.
            </p>
          ) : (
            <ul className="mt-8 flex flex-col gap-3">
              {users.map((u) => {
                const name =
                  [u.firstName, u.lastName].filter(Boolean).join(" ") ||
                  u.email;
                const project = u.projectMembers[0]?.project.title;
                return (
                  <li
                    key={u.id}
                    className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 ring-1 ring-black/5"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {name}
                        <span
                          className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                            u.role === "ADMIN"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-brand-50 text-brand-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </p>
                      <p className="text-xs text-muted">{u.email}</p>
                      {project && (
                        <p className="text-xs text-muted/70">{project}</p>
                      )}
                    </div>
                    <form action={signInAsDev.bind(null, u.id)}>
                      <Button type="submit" size="md">
                        Sign in
                      </Button>
                    </form>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
