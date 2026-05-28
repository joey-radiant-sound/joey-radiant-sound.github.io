"use client";

import { useActionState, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAutoSave, AutoSaveStatus } from "../_autosave";
import { EVENT_LABEL_BY_KEY } from "../_constants";
import { s } from "../_utils";
import {
  updateAnnouncement,
  deleteAnnouncement,
  addCustomAnnouncement,
  type EventsState,
} from "./actions";
import type { AnnouncementRow } from "./types";

const initial: EventsState = { ok: false };

/**
 * The "Events" list. Six pre-seeded moments (first dance, parent
 * dances, cake/bouquet/garter) plus any custom ones the couple adds.
 * Each row toggles between display mode (compact summary + Edit/Remove)
 * and edit mode (auto-saving inline form + Done).
 */
export function AnnouncementsBlock({
  projectId,
  announcements,
}: {
  projectId: string;
  announcements: AnnouncementRow[];
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-600">
        Events
      </p>
      <p className="mb-5 text-sm text-muted">
        For each moment, tell us the names of the people involved and the song.
        Leave a moment blank to skip it.
      </p>
      <ul className="flex flex-col gap-3">
        {announcements.map((a) => (
          <AnnouncementRowItem key={a.id} projectId={projectId} row={a} />
        ))}
      </ul>
      <CustomAnnouncementForm projectId={projectId} />
    </div>
  );
}

function AnnouncementRowItem({
  projectId,
  row,
}: {
  projectId: string;
  row: AnnouncementRow;
}) {
  const [editing, setEditing] = useState(false);
  const isCustom = row.eventKey === "CUSTOM";
  const label = isCustom
    ? row.customTitle || "(Untitled custom event)"
    : EVENT_LABEL_BY_KEY[row.eventKey] ?? row.eventKey;

  if (editing) {
    return (
      <li className="rounded-xl bg-brand-50 p-5 ring-1 ring-brand-300">
        <p className="mb-3 text-sm font-semibold text-ink">{label}</p>
        <AnnouncementEditForm
          projectId={projectId}
          row={row}
          onDone={() => setEditing(false)}
        />
      </li>
    );
  }

  const filledIn = row.peopleInvolved || row.songName || row.notes;

  return (
    <li className="grid gap-3 rounded-xl border-l-4 border-brand-400 bg-white p-4 ring-1 ring-black/5 md:grid-cols-[1fr_auto] md:items-start">
      <div>
        <p className="text-sm font-semibold text-ink">{label}</p>
        {filledIn ? (
          <div className="mt-1 space-y-0.5 text-sm text-ink-soft">
            {row.peopleInvolved && <p>People: {row.peopleInvolved}</p>}
            {row.songName && (
              <p>
                Song: {row.songName}
                {row.songArtist && (
                  <span className="text-muted"> — {row.songArtist}</span>
                )}
              </p>
            )}
            {row.notes && <p className="text-muted">{row.notes}</p>}
          </div>
        ) : (
          <p className="mt-1 text-sm text-muted">Not filled in</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs font-medium text-brand-700 hover:text-brand-900"
        >
          Edit
        </button>
        {isCustom && (
          <button
            type="button"
            onClick={() => deleteAnnouncement(projectId, row.id)}
            className="text-xs font-medium text-muted hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>
    </li>
  );
}

function AnnouncementEditForm({
  projectId,
  row,
  onDone,
}: {
  projectId: string;
  row: AnnouncementRow;
  onDone: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { status, trigger, flush } = useAutoSave(async () => {
    if (!formRef.current) return;
    return updateAnnouncement(row.id, new FormData(formRef.current));
  });
  const isCustom = row.eventKey === "CUSTOM";

  return (
    <form ref={formRef} onChange={trigger} onBlur={flush} className="grid gap-3">
      <input type="hidden" name="projectId" value={projectId} />
      {isCustom && (
        <Input label="Title" name="customTitle" defaultValue={s(row.customTitle)} required />
      )}
      <Input
        label="People involved"
        name="peopleInvolved"
        defaultValue={s(row.peopleInvolved)}
        placeholder="e.g. names of the mother and son"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Song name" name="songName" defaultValue={s(row.songName)} />
        <Input label="Artist" name="songArtist" defaultValue={s(row.songArtist)} />
      </div>
      <Input label="Notes" name="notes" defaultValue={s(row.notes)} />
      <div className="flex items-center gap-4">
        <Button
          type="button"
          size="md"
          variant="secondary"
          onClick={() => {
            flush();
            onDone();
          }}
        >
          Done
        </Button>
        <AutoSaveStatus status={status} />
      </div>
    </form>
  );
}

function CustomAnnouncementForm({ projectId }: { projectId: string }) {
  const [state, formAction, pending] = useActionState(
    addCustomAnnouncement,
    initial,
  );
  return (
    <form
      action={formAction}
      className="mt-6 rounded-xl border border-dashed border-brand-300 bg-brand-50/40 p-6"
    >
      <input type="hidden" name="projectId" value={projectId} />
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-600">
        Add a custom event
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Event title" name="customTitle" required />
        <Input label="People involved" name="peopleInvolved" />
        <Input label="Song name" name="songName" />
        <Input label="Artist" name="songArtist" />
      </div>
      <div className="mt-4">
        <Input label="Notes" name="notes" />
      </div>
      <div className="mt-4 flex items-center gap-4">
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Adding…" : "Add event"}
        </Button>
        {!state.ok && state.message && (
          <span className="text-sm font-medium text-red-600">
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
