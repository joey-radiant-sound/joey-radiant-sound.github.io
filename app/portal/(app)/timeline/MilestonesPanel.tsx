"use client";

import { useActionState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  addMilestone,
  toggleMilestone,
  deleteMilestone,
  type MilestoneState,
} from "./actions";

export type MilestoneRow = {
  id: string;
  title: string;
  dueAt: string | null; // ISO date (yyyy-mm-dd) or null
  done: boolean;
};

const initial: MilestoneState = { ok: false };

/**
 * Admin milestone management for one project. Add milestones (title +
 * optional due date), toggle done, delete. Couples see the read-only
 * timeline at /portal/timeline.
 */
export function MilestonesPanel({
  projectId,
  milestones,
}: {
  projectId: string;
  milestones: MilestoneRow[];
}) {
  const action = addMilestone.bind(null, projectId);
  const [state, formAction, pending] = useActionState(action, initial);
  const [, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-5">
      {milestones.length === 0 ? (
        <p className="rounded-md border border-dashed border-black/15 px-4 py-3 text-sm text-muted">
          No milestones yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {milestones.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-4 rounded-lg bg-white px-4 py-3 ring-1 ring-black/5"
            >
              <label className="flex flex-1 cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={m.done}
                  onChange={() =>
                    startTransition(async () => {
                      await toggleMilestone(m.id);
                    })
                  }
                  className="h-4 w-4 rounded border-black/20 text-brand-600 focus:ring-brand-600"
                />
                <span
                  className={`text-sm ${
                    m.done ? "text-muted line-through" : "text-ink"
                  }`}
                >
                  {m.title}
                  {m.dueAt && (
                    <span className="ml-2 text-xs text-muted">
                      due {m.dueAt}
                    </span>
                  )}
                </span>
              </label>
              <button
                type="button"
                onClick={() =>
                  startTransition(async () => {
                    await deleteMilestone(m.id);
                  })
                }
                className="text-xs font-medium text-muted hover:text-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <form
        action={formAction}
        className="grid gap-3 rounded-xl border border-dashed border-black/15 p-4 sm:grid-cols-[1fr_160px_auto] sm:items-end"
      >
        <Input label="Milestone" name="title" required placeholder="e.g. Deposit due" />
        <Input label="Due date" name="dueAt" type="date" />
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Adding…" : "Add"}
        </Button>
        {!state.ok && state.message && (
          <p className="sm:col-span-3 text-sm font-medium text-red-600">
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
