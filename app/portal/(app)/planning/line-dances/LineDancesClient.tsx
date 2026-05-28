"use client";

import { useActionState, useOptimistic, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  toggleLineDance,
  addLineDance,
  deleteLineDance,
  type LineDanceState,
} from "./actions";

type Item = {
  id: string;
  name: string;
  wanted: boolean;
  isDefault: boolean;
};

const initial: LineDanceState = { ok: false };

export function LineDancesClient({
  projectId,
  items,
}: {
  projectId: string;
  items: Item[];
}) {
  const [, startTransition] = useTransition();
  const [optimistic, applyOptimistic] = useOptimistic<
    Item[],
    { id: string; wanted: boolean }
  >(items, (state, action) =>
    state.map((it) =>
      it.id === action.id ? { ...it, wanted: action.wanted } : it,
    ),
  );

  const [state, formAction, pending] = useActionState(addLineDance, initial);

  const onToggle = (id: string, wanted: boolean) => {
    startTransition(async () => {
      applyOptimistic({ id, wanted });
      await toggleLineDance(projectId, id, wanted);
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <ul className="grid gap-2 rounded-xl bg-brand-50 p-4 ring-1 ring-brand-200/60 sm:grid-cols-2 md:p-6">
        {optimistic.map((it) => (
          <li
            key={it.id}
            className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 ring-1 ring-black/5"
          >
            <label className="flex flex-1 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={it.wanted}
                onChange={(e) => onToggle(it.id, e.target.checked)}
                className="h-4 w-4 rounded border-black/20 text-brand-600 focus:ring-brand-600"
              />
              <span className="text-sm text-ink">
                {it.name}
                {!it.isDefault && (
                  <span className="ml-2 text-xs uppercase tracking-wider text-brand-600">
                    custom
                  </span>
                )}
              </span>
            </label>
            {!it.isDefault && (
              <button
                type="button"
                onClick={() => deleteLineDance(projectId, it.id)}
                className="text-xs font-medium text-muted hover:text-red-600"
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      <form
        action={formAction}
        className="grid gap-3 rounded-xl border border-dashed border-brand-300 bg-brand-50/40 p-6 sm:grid-cols-[1fr_auto] sm:items-end"
      >
        <input type="hidden" name="projectId" value={projectId} />
        <Input label="Add a custom line dance" name="name" required />
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Adding…" : "Add"}
        </Button>
        {!state.ok && state.message && (
          <p className="sm:col-span-2 text-sm font-medium text-red-600">
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
