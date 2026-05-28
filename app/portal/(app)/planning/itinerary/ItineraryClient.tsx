"use client";

import { useActionState, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAutoSave } from "../_autosave";
import {
  updateItineraryItem,
  addItineraryItem,
  deleteItineraryItem,
  type ItineraryState,
} from "./actions";

type Item = {
  id: string;
  time: string;
  event: string | null;
  notes: string | null;
};

const initial: ItineraryState = { ok: false };

export function ItineraryClient({
  projectId,
  items,
}: {
  projectId: string;
  items: Item[];
}) {
  const [state, formAction, pending] = useActionState(
    addItineraryItem,
    initial,
  );

  return (
    <div className="flex flex-col gap-6">
      <ul className="overflow-hidden rounded-xl bg-brand-50 ring-1 ring-brand-200/60">
        <li className="grid grid-cols-[110px_1fr_1fr_auto] gap-3 border-b border-brand-200/60 bg-brand-100 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-brand-700">
          <span>Time</span>
          <span>Event</span>
          <span>Notes</span>
          <span aria-hidden></span>
        </li>
        {items.map((it) => (
          <ItineraryRow key={it.id} projectId={projectId} item={it} />
        ))}
      </ul>

      <form
        action={formAction}
        className="grid gap-3 rounded-xl border border-dashed border-brand-300 bg-brand-50/40 p-6 sm:grid-cols-[110px_1fr_1fr_auto] sm:items-end"
      >
        <input type="hidden" name="projectId" value={projectId} />
        <Input label="Time" name="time" required placeholder="e.g. 1:15 AM" />
        <Input label="Event" name="event" />
        <Input label="Notes" name="notes" />
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Adding…" : "Add slot"}
        </Button>
        {!state.ok && state.message && (
          <p className="sm:col-span-4 text-sm font-medium text-red-600">
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}

function ItineraryRow({
  projectId,
  item,
}: {
  projectId: string;
  item: Item;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { trigger, flush } = useAutoSave(async () => {
    if (!formRef.current) return;
    return updateItineraryItem(item.id, new FormData(formRef.current));
  }, 800);

  return (
    <li className="border-b border-brand-200/50 last:border-b-0">
      <form
        ref={formRef}
        onChange={trigger}
        onBlur={flush}
        className="grid grid-cols-[110px_1fr_1fr_auto] items-center gap-3 px-4 py-2"
      >
        <input type="hidden" name="projectId" value={projectId} />
        <input
          name="time"
          defaultValue={item.time}
          className="rounded border border-transparent bg-transparent px-2 py-1 text-sm font-medium text-ink-soft focus:border-brand-500 focus:bg-white focus:outline-none"
        />
        <input
          name="event"
          defaultValue={item.event ?? ""}
          placeholder="—"
          className="rounded border border-transparent bg-transparent px-2 py-1 text-sm text-ink focus:border-brand-500 focus:bg-white focus:outline-none"
        />
        <input
          name="notes"
          defaultValue={item.notes ?? ""}
          placeholder="—"
          className="rounded border border-transparent bg-transparent px-2 py-1 text-sm text-muted focus:border-brand-500 focus:bg-white focus:outline-none"
        />
        <button
          type="button"
          onClick={() => deleteItineraryItem(projectId, item.id)}
          className="text-xs font-medium text-muted hover:text-red-600"
        >
          Remove
        </button>
      </form>
    </li>
  );
}
