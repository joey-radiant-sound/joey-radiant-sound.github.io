import { NewProjectForm } from "./NewProjectForm";

export default function NewProjectPage() {
  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
        New project
      </h1>
      <p className="mt-2 text-base text-muted">
        Spin up a wedding before inviting the couple.
      </p>

      <div className="mt-10">
        <NewProjectForm />
      </div>
    </section>
  );
}
