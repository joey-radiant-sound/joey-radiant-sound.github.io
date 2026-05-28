"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { archiveProject, unarchiveProject } from "../../actions";

/**
 * Admin controls for a project: open its planning sheet (as admin, via
 * the ?project= param) and archive/unarchive it.
 */
export function ProjectHeaderActions({
  id,
  archived,
}: {
  id: string;
  archived: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button href={`/portal/planning/general?project=${id}`} size="md">
        Open planning sheet
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="md"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            if (archived) await unarchiveProject(id);
            else await archiveProject(id);
          })
        }
      >
        {pending
          ? "Working…"
          : archived
            ? "Unarchive"
            : "Archive wedding"}
      </Button>
    </div>
  );
}
