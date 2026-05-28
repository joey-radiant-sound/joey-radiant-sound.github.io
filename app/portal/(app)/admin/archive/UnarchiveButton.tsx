"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { unarchiveProject } from "../actions";

export function UnarchiveButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      type="button"
      variant="secondary"
      size="md"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await unarchiveProject(id);
        })
      }
    >
      {pending ? "Unarchiving…" : "Unarchive"}
    </Button>
  );
}
