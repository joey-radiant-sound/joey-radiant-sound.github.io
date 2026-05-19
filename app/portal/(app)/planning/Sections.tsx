"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
  MUSIC_CATEGORIES,
  VENDOR_ROLES,
  EQUIPMENT_CATEGORIES,
  type FormState,
} from "./constants";
import {
  addTimelineEvent,
  deleteTimelineEvent,
  addMusicSelection,
  deleteMusicSelection,
  addVendorContact,
  deleteVendorContact,
  addEquipmentNote,
  deleteEquipmentNote,
} from "./actions";

/* ───────── shared shell ───────── */

function SectionShell({
  eyebrow,
  heading,
  description,
  children,
}: {
  eyebrow: string;
  heading: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          {heading}
        </h2>
        <p className="mt-2 text-sm text-muted">{description}</p>
      </div>
      <div className="rounded-xl bg-white p-6 ring-1 ring-black/5 md:p-8">
        {children}
      </div>
    </section>
  );
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs font-medium text-muted transition-colors hover:text-red-600"
    >
      Remove
    </button>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <p className="rounded-md border border-dashed border-black/15 px-4 py-3 text-sm text-muted">
      {label}
    </p>
  );
}

const initial: FormState = { ok: false };

/* ───────── Timeline ───────── */

type TimelineRow = {
  id: string;
  time: string | null;
  title: string;
  notes: string | null;
};

export function TimelineSection({ events }: { events: TimelineRow[] }) {
  const [state, action, pending] = useActionState(addTimelineEvent, initial);

  return (
    <SectionShell
      eyebrow="01"
      heading="Day-of timeline"
      description="Every moment we need to hit. Order doesn't matter when entering — sort it later."
    >
      <ul className="flex flex-col gap-3">
        {events.length === 0 ? (
          <li>
            <EmptyRow label="No timeline events yet — add the first one below." />
          </li>
        ) : (
          events.map((e) => (
            <li
              key={e.id}
              className="grid gap-2 rounded-md bg-surface px-4 py-3 sm:grid-cols-[120px_1fr_auto] sm:items-center sm:gap-4"
            >
              <span className="text-sm font-medium text-ink-soft">
                {e.time || "—"}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{e.title}</p>
                {e.notes && (
                  <p className="text-sm text-muted">{e.notes}</p>
                )}
              </div>
              <DeleteButton onClick={() => deleteTimelineEvent(e.id)} />
            </li>
          ))
        )}
      </ul>

      <form action={action} className="mt-6 grid gap-3 sm:grid-cols-[120px_1fr_auto] sm:items-end">
        <Input label="Time" name="time" placeholder="e.g. 5:30 PM" />
        <Input label="Title" name="title" required placeholder="e.g. First dance" />
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Adding…" : "Add"}
        </Button>
        <div className="sm:col-span-3">
          <Textarea label="Notes" name="notes" rows={2} />
        </div>
      </form>
      {!state.ok && state.message && (
        <p className="mt-3 text-sm text-red-600">{state.message}</p>
      )}
    </SectionShell>
  );
}

/* ───────── Music ───────── */

type MusicRow = {
  id: string;
  category: string;
  title: string;
  artist: string | null;
  notes: string | null;
};

export function MusicSection({ items }: { items: MusicRow[] }) {
  const [state, action, pending] = useActionState(addMusicSelection, initial);
  const labelOf = (val: string) =>
    MUSIC_CATEGORIES.find((c) => c.value === val)?.label ?? val;

  // Group by category for readability.
  const grouped = MUSIC_CATEGORIES.map((cat) => ({
    cat,
    rows: items.filter((i) => i.category === cat.value),
  })).filter((g) => g.rows.length > 0);

  return (
    <SectionShell
      eyebrow="02"
      heading="Music"
      description="Processional, first dance, must-plays, do-not-plays — anything we should know."
    >
      {grouped.length === 0 ? (
        <EmptyRow label="No music yet — add the first request below." />
      ) : (
        <div className="flex flex-col gap-5">
          {grouped.map(({ cat, rows }) => (
            <div key={cat.value}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">
                {cat.label}
              </p>
              <ul className="flex flex-col gap-2">
                {rows.map((r) => (
                  <li
                    key={r.id}
                    className="grid gap-2 rounded-md bg-surface px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {r.title}
                        {r.artist && (
                          <span className="font-normal text-muted">
                            {" "}
                            — {r.artist}
                          </span>
                        )}
                      </p>
                      {r.notes && (
                        <p className="text-sm text-muted">{r.notes}</p>
                      )}
                    </div>
                    <DeleteButton onClick={() => deleteMusicSelection(r.id)} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <form action={action} className="mt-6 grid gap-3 sm:grid-cols-2">
        <Select
          label="Category"
          name="category"
          options={MUSIC_CATEGORIES}
          required
          defaultValue="MUST_PLAY"
        />
        <Input label="Song title" name="title" required />
        <Input label="Artist" name="artist" />
        <Input label="Notes" name="notes" placeholder="optional" />
        <div className="sm:col-span-2 flex justify-end">
          <Button type="submit" size="md" disabled={pending}>
            {pending ? "Adding…" : `Add ${labelOf("MUST_PLAY").toLowerCase()}-style entry`}
          </Button>
        </div>
      </form>
      {!state.ok && state.message && (
        <p className="mt-3 text-sm text-red-600">{state.message}</p>
      )}
    </SectionShell>
  );
}

/* ───────── Vendors ───────── */

type VendorRow = {
  id: string;
  role: string;
  name: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
};

export function VendorsSection({ items }: { items: VendorRow[] }) {
  const [state, action, pending] = useActionState(addVendorContact, initial);
  const labelOf = (val: string) =>
    VENDOR_ROLES.find((r) => r.value === val)?.label ?? val;

  return (
    <SectionShell
      eyebrow="03"
      heading="Vendor contacts"
      description="Everyone else working your wedding. The more we have, the smoother the day."
    >
      {items.length === 0 ? (
        <EmptyRow label="No vendors yet — add the first one below." />
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((v) => (
            <li
              key={v.id}
              className="grid gap-2 rounded-md bg-surface px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-start"
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                  {labelOf(v.role)}
                </p>
                <p className="text-sm font-semibold text-ink">
                  {v.name}
                  {v.company && (
                    <span className="font-normal text-muted"> · {v.company}</span>
                  )}
                </p>
                {(v.phone || v.email) && (
                  <p className="text-sm text-muted">
                    {[v.phone, v.email].filter(Boolean).join(" · ")}
                  </p>
                )}
                {v.notes && <p className="text-sm text-muted">{v.notes}</p>}
              </div>
              <DeleteButton onClick={() => deleteVendorContact(v.id)} />
            </li>
          ))}
        </ul>
      )}

      <form action={action} className="mt-6 grid gap-3 sm:grid-cols-2">
        <Select
          label="Role"
          name="role"
          options={VENDOR_ROLES}
          required
          defaultValue="PHOTOGRAPHER"
        />
        <Input label="Name" name="name" required />
        <Input label="Company" name="company" />
        <Input label="Phone" name="phone" type="tel" />
        <Input label="Email" name="email" type="email" />
        <Input label="Notes" name="notes" placeholder="optional" />
        <div className="sm:col-span-2 flex justify-end">
          <Button type="submit" size="md" disabled={pending}>
            {pending ? "Adding…" : "Add vendor"}
          </Button>
        </div>
      </form>
      {!state.ok && state.message && (
        <p className="mt-3 text-sm text-red-600">{state.message}</p>
      )}
    </SectionShell>
  );
}

/* ───────── Equipment / logistics notes ───────── */

type EquipmentRow = {
  id: string;
  category: string;
  body: string;
};

export function EquipmentSection({ notes }: { notes: EquipmentRow[] }) {
  const [state, action, pending] = useActionState(addEquipmentNote, initial);
  const labelOf = (val: string) =>
    EQUIPMENT_CATEGORIES.find((c) => c.value === val)?.label ?? val;

  return (
    <SectionShell
      eyebrow="04"
      heading="Logistics + equipment notes"
      description="Power, load-in, indoor/outdoor, weather plan, anything our crew needs to know."
    >
      {notes.length === 0 ? (
        <EmptyRow label="No notes yet — add the first one below." />
      ) : (
        <ul className="flex flex-col gap-3">
          {notes.map((n) => (
            <li
              key={n.id}
              className="grid gap-2 rounded-md bg-surface px-4 py-3 sm:grid-cols-[160px_1fr_auto] sm:items-start"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                {labelOf(n.category)}
              </span>
              <p className="text-sm text-ink-soft">{n.body}</p>
              <DeleteButton onClick={() => deleteEquipmentNote(n.id)} />
            </li>
          ))}
        </ul>
      )}

      <form action={action} className="mt-6 grid gap-3 sm:grid-cols-[200px_1fr_auto] sm:items-end">
        <Select
          label="Category"
          name="category"
          options={EQUIPMENT_CATEGORIES}
          required
          defaultValue="OTHER"
        />
        <Input label="Note" name="body" required />
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Adding…" : "Add"}
        </Button>
      </form>
      {!state.ok && state.message && (
        <p className="mt-3 text-sm text-red-600">{state.message}</p>
      )}
    </SectionShell>
  );
}
