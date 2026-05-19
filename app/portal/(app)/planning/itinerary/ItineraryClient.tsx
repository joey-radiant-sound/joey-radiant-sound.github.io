"use client";

import { useActionState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
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

export function ItineraryClient({ items }: { items: Item[] }) {
  const [state, formAction, pending] = useActionState(
    addItineraryItem,
    initial,
  );

  return (
    <div className="flex flex-col gap-6">
      <ul className="overflow-hidden rounded-xl bg-white ring-1 ring-black/5">
        <li className="grid grid-cols-[110px_1fr_1fr_auto] gap-3 border-b border-black/10 bg-surface-alt px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
          <span>Time</span>
          <span>Event</span>
          <span>Notes</span>
          <span aria-hidden></span>
        </li>
        {items.map((it) => (
          <ItineraryRow key={it.id} item={it} />
        ))}
      </ul>

      <form
        action={formAction}
        className="grid gap-3 rounded-xl border border-dashed border-black/15 p-6 sm:grid-cols-[110px_1fr_1fr_auto] sm:items-end"
      >
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

function ItineraryRow({ item }: { item: Item }) {
  const [, startTransition] = useTransition();

  return (
    <li className="border-b border-black/5 last:border-b-0">
      <form
        action={(fd) => {
          startTransition(async () => {
            await updateItineraryItem(item.id, fd);
          });
        }}
        className="grid grid-cols-[110px_1fr_1fr_auto] items-center gap-3 px-4 py-2"
      >
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
        <div className="flex items-center gap-2">
          <button
            type="submit"
            className="text-xs font-medium text-brand-700 hover:text-brand-900"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => deleteItineraryItem(item.id)}
            className="text-xs font-medium text-muted hover:text-red-600"
          >
            Remove
          </button>
        </div>
      </form>
    </li>
  );
}
