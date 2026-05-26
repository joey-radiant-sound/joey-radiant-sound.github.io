"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

/**
 * Multipart upload form. POSTs `multipart/form-data` directly to the
 * route handler at /api/files/upload — server actions don't accept
 * raw multipart streams, so this is a plain fetch.
 */
export function FileUploadForm({ projectId }: { projectId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Pick a file first.");
      return;
    }

    const form = new FormData();
    form.append("projectId", projectId);
    form.append("file", file);

    setBusy(true);
    try {
      const res = await fetch("/api/files/upload", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? `Upload failed (${res.status}).`);
        return;
      }
      setSuccess(`Uploaded "${file.name}".`);
      if (inputRef.current) inputRef.current.value = "";
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-dashed border-brand-300 bg-brand-50/40 p-6"
    >
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-600">
        Upload a file
      </p>
      <p className="mb-4 text-sm text-muted">
        Contracts, invoices, vendor PDFs, photos. Max 50 MB. PDFs and images
        recommended; large videos may time out.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          name="file"
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp,image/gif,audio/mpeg,audio/mp4,audio/wav,video/mp4,video/quicktime"
          className="block w-full max-w-md text-sm text-ink file:mr-4 file:rounded-full file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-600"
        />
        <Button type="submit" size="md" disabled={busy}>
          {busy ? "Uploading…" : "Upload"}
        </Button>
      </div>
      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
      {success && (
        <p className="mt-3 text-sm font-medium text-brand-700" aria-live="polite">
          {success}
        </p>
      )}
    </form>
  );
}
