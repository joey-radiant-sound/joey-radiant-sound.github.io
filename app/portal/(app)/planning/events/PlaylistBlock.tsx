"use client";

import { useActionState, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAutoSave, AutoSaveStatus } from "../_autosave";
import { s } from "../_utils";
import {
  addPlaylistSong,
  updatePlaylistSong,
  deletePlaylistSong,
  type EventsState,
} from "./actions";
import type { SongRow } from "./types";

const initial: EventsState = { ok: false };

/**
 * One playlist bucket — cocktail/dinner, reception, or do-NOT-play.
 * Renders the current songs above an add-form. Each saved song row
 * toggles between display mode (Edit/Remove) and auto-saving edit
 * mode (Done).
 */
export function PlaylistBlock({
  listType,
  title,
  description,
  songs,
}: {
  listType: string;
  title: string;
  description: string;
  songs: SongRow[];
}) {
  const [state, formAction, pending] = useActionState(addPlaylistSong, initial);

  return (
    <div className="rounded-xl bg-brand-50 p-6 ring-1 ring-brand-200/60 md:p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
        {title}
      </p>
      <p className="mt-1 text-sm text-muted">{description}</p>

      {songs.length === 0 ? (
        <p className="mt-4 rounded-md border border-dashed border-brand-300 bg-white/60 px-4 py-3 text-sm text-muted">
          No songs yet.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {songs.map((song) => (
            <SongRowItem key={song.id} song={song} />
          ))}
        </ul>
      )}

      <form
        action={formAction}
        className="mt-5 grid gap-3 rounded-lg border border-dashed border-brand-300 bg-white/60 p-4 sm:grid-cols-[2fr_2fr_2fr_auto] sm:items-end"
      >
        <input type="hidden" name="listType" value={listType} />
        <Input label="Song name" name="songName" required />
        <Input label="Artist" name="songArtist" />
        <Input label="Notes" name="notes" />
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Adding…" : "Add"}
        </Button>
      </form>
      {!state.ok && state.message && (
        <p className="mt-2 text-sm font-medium text-red-600">{state.message}</p>
      )}
    </div>
  );
}

function SongRowItem({ song }: { song: SongRow }) {
  const [editing, setEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { status, trigger, flush } = useAutoSave(async () => {
    if (!formRef.current) return;
    return updatePlaylistSong(song.id, new FormData(formRef.current));
  });

  if (!editing) {
    return (
      <li className="grid gap-2 rounded-lg border-l-4 border-brand-400 bg-white px-4 py-3 ring-1 ring-black/5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-sm font-medium text-ink">
            {song.songName}
            {song.songArtist && (
              <span className="font-normal text-muted"> — {song.songArtist}</span>
            )}
          </p>
          {song.notes && <p className="text-xs text-muted">{song.notes}</p>}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs font-medium text-brand-700 hover:text-brand-900"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => deletePlaylistSong(song.id)}
            className="text-xs font-medium text-muted hover:text-red-600"
          >
            Remove
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="rounded-lg bg-brand-50 p-4 ring-1 ring-brand-300">
      <form ref={formRef} onChange={trigger} onBlur={flush} className="grid gap-3 sm:grid-cols-3">
        <Input label="Song name" name="songName" defaultValue={song.songName} required />
        <Input label="Artist" name="songArtist" defaultValue={s(song.songArtist)} />
        <Input label="Notes" name="notes" defaultValue={s(song.notes)} />
        <div className="flex items-center gap-4 sm:col-span-3">
          <Button
            type="button"
            size="md"
            variant="secondary"
            onClick={() => {
              flush();
              setEditing(false);
            }}
          >
            Done
          </Button>
          <AutoSaveStatus status={status} />
        </div>
      </form>
    </li>
  );
}
