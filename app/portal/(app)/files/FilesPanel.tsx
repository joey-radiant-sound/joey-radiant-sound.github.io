"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { deleteProjectFile } from "./actions";
import { FileUploadForm } from "./FileUploadForm";

export type FileRow = {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string; // ISO string (Date serialized by the parent)
  uploadedByName: string | null; // best-guess display name
  isMine: boolean; // can current user delete this row (uploader OR admin)
};

/**
 * Per-project file list with upload + delete. Same component drives
 * the couple view (/portal/files) and the admin view (embedded on
 * /portal/admin/projects/[id]).
 */
export function FilesPanel({
  projectId,
  files,
}: {
  projectId: string;
  files: FileRow[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <FileUploadForm projectId={projectId} />

      {files.length === 0 ? (
        <p className="rounded-md border border-dashed border-black/15 px-4 py-3 text-sm text-muted">
          No files yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {files.map((f) => (
            <FileRowItem key={f.id} file={f} />
          ))}
        </ul>
      )}
    </div>
  );
}

function FileRowItem({ file }: { file: FileRow }) {
  const [, startTransition] = useTransition();

  return (
    <li className="grid gap-3 rounded-lg border-l-4 border-brand-400 bg-white px-4 py-3 ring-1 ring-black/5 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <a
          href={`/api/files/${file.id}`}
          className="text-sm font-medium text-ink hover:underline"
        >
          {file.name}
        </a>
        <p className="text-xs text-muted">
          {humanSize(file.sizeBytes)}
          {file.uploadedByName && ` · uploaded by ${file.uploadedByName}`} ·{" "}
          {formatDate(file.createdAt)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          href={`/api/files/${file.id}`}
          variant="secondary"
          size="md"
          className="text-xs"
        >
          Download
        </Button>
        {file.isMine && (
          <button
            type="button"
            onClick={() =>
              startTransition(async () => {
                await deleteProjectFile(file.id);
              })
            }
            className="text-xs font-medium text-muted hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>
    </li>
  );
}

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}
