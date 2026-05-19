import { redirect } from "next/navigation";
import { getAuthedProject, ensureWeddingDetails } from "../_server";
import { GeneralInfoForm } from "./GeneralInfoForm";

export default async function GeneralInfoPage() {
  const ctx = await getAuthedProject();
  if (!ctx) redirect("/portal/sign-in");

  const details = await ensureWeddingDetails(ctx.projectId);

  return (
    <section>
      <header className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          General Info
        </h2>
        <p className="mt-2 text-sm text-muted">
          Fill out the basics. If you don&rsquo;t know something yet, leave it
          blank and come back.
        </p>
      </header>
      <GeneralInfoForm initial={serializable(details)} />
    </section>
  );
}

// Serialize Date → string for client component.
function serializable(d: { [k: string]: unknown }) {
  const out: Record<string, unknown> = { ...d };
  if (out.weddingDate instanceof Date) {
    out.weddingDate = out.weddingDate.toISOString().slice(0, 10);
  }
  return out;
}
