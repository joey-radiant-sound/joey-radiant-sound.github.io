"use client";

import { useActionState, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useAutoSave, AutoSaveStatus } from "../_autosave";
import { EVENT_LABEL_BY_KEY, PLAYLIST_TYPES } from "../_constants";
import {
  saveQuestions,
  updateAnnouncement,
  deleteAnnouncement,
  addCustomAnnouncement,
  addPlaylistSong,
  updatePlaylistSong,
  deletePlaylistSong,
  type EventsState,
} from "./actions";

const initial: EventsState = { ok: false };

type Questions = {
  takeAudienceRequests: boolean | null;
  cocktailGenre: string | null;
  receptionGenres: string | null;
  announceLastCall: boolean | null;
  announceShuttle: boolean | null;
  shuttleTimes: string | null;
  coupleAnnouncement: string | null;
  miscDetails: string | null;
};

type AnnouncementRow = {
  id: string;
  eventKey: string;
  customTitle: string | null;
  peopleInvolved: string | null;
  songName: string | null;
  songArtist: string | null;
  notes: string | null;
};

type SongRow = {
  id: string;
  listType: string;
  songName: string;
  songArtist: string | null;
  notes: string | null;
};

const YES_NO = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
] as const;

function boolToStr(v: boolean | null | undefined): string {
  if (v === true) return "true";
  if (v === false) return "false";
  return "";
}
function s(v: string | null | undefined): string {
  return v ?? "";
}

export function EventsClient({
  questions,
  announcements,
  songs,
}: {
  questions: Questions;
  announcements: AnnouncementRow[];
  songs: SongRow[];
}) {
  return (
    <div className="flex flex-col gap-10">
      <QuestionsBlock initial={questions} />
      <AnnouncementsBlock announcements={announcements} />
      <PlaylistBlock
        listType="COCKTAIL_DINNER"
        title={PLAYLIST_TYPES.COCKTAIL_DINNER}
        description="Songs to play during cocktail hour and dinner."
        songs={songs.filter((x) => x.listType === "COCKTAIL_DINNER")}
      />
      <PlaylistBlock
        listType="RECEPTION_PLAYLIST"
        title={PLAYLIST_TYPES.RECEPTION_PLAYLIST}
        description="Songs you want on the dance floor (suggest no more than 20 — leaves room for guest requests + DJ reads)."
        songs={songs.filter((x) => x.listType === "RECEPTION_PLAYLIST")}
      />
      <PlaylistBlock
        listType="DO_NOT_PLAY"
        title={PLAYLIST_TYPES.DO_NOT_PLAY}
        description="Songs we should not play under any circumstances."
        songs={songs.filter((x) => x.listType === "DO_NOT_PLAY")}
      />
    </div>
  );
}

/* ───── DJ questions — auto-saving, with conditional shuttle field ───── */

function QuestionsBlock({ initial: q }: { initial: Questions }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [shuttle, setShuttle] = useState<string>(boolToStr(q.announceShuttle));
  const { status, trigger, flush } = useAutoSave(async () => {
    if (!formRef.current) return;
    return saveQuestions({ ok: false }, new FormData(formRef.current));
  });

  return (
    <form
      ref={formRef}
      onChange={trigger}
      onBlur={flush}
      className="rounded-xl bg-brand-50 p-6 ring-1 ring-brand-200/60 md:p-8"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
          DJ Questions
        </p>
        <AutoSaveStatus status={status} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Select label="Take audience requests?" name="takeAudienceRequests" options={YES_NO} placeholder="—" defaultValue={boolToStr(q.takeAudienceRequests)} />
        <Input label="Genre for cocktail / dinner hour" name="cocktailGenre" defaultValue={s(q.cocktailGenre)} placeholder="e.g. acoustic, jazz, indie" />
        <Input label="Reception genres to focus on" name="receptionGenres" defaultValue={s(q.receptionGenres)} placeholder="e.g. 2010s pop, classic rock, hip-hop" />
        <Select label="Announce last call for alcohol?" name="announceLastCall" options={YES_NO} placeholder="—" defaultValue={boolToStr(q.announceLastCall)} />
        <Select
          label="Announce shuttle times?"
          name="announceShuttle"
          options={YES_NO}
          placeholder="—"
          defaultValue={boolToStr(q.announceShuttle)}
          onChange={(e) => setShuttle(e.target.value)}
        />
        {shuttle === "true" && (
          <Input
            label="What time(s)?"
            name="shuttleTimes"
            defaultValue={s(q.shuttleTimes)}
            placeholder="e.g. 11:00 PM and 12:00 AM"
          />
        )}
      </div>
      <div className="mt-5 grid gap-5">
        <Textarea label="How would you like to be announced as a couple?" name="coupleAnnouncement" rows={2} defaultValue={s(q.coupleAnnouncement)} placeholder='e.g. "Mr. and Mrs. Smith"' />
        <Textarea label="Miscellaneous details" name="miscDetails" rows={3} defaultValue={s(q.miscDetails)} />
      </div>
    </form>
  );
}

/* ───── Event moments — display ↔ edit ───── */

function AnnouncementsBlock({
  announcements,
}: {
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
          <AnnouncementRowItem key={a.id} row={a} />
        ))}
      </ul>
      <CustomAnnouncementForm />
    </div>
  );
}

function AnnouncementRowItem({ row }: { row: AnnouncementRow }) {
  const [editing, setEditing] = useState(false);
  const isCustom = row.eventKey === "CUSTOM";
  const label = isCustom
    ? row.customTitle || "(Untitled custom event)"
    : EVENT_LABEL_BY_KEY[row.eventKey] ?? row.eventKey;

  if (editing) {
    return (
      <li className="rounded-xl bg-brand-50 p-5 ring-1 ring-brand-300">
        <p className="mb-3 text-sm font-semibold text-ink">{label}</p>
        <AnnouncementEditForm row={row} onDone={() => setEditing(false)} />
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
            onClick={() => deleteAnnouncement(row.id)}
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
  row,
  onDone,
}: {
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

function CustomAnnouncementForm() {
  const [state, formAction, pending] = useActionState(
    addCustomAnnouncement,
    initial,
  );
  return (
    <form
      action={formAction}
      className="mt-6 rounded-xl border border-dashed border-brand-300 bg-brand-50/40 p-6"
    >
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

/* ───── Playlists — display ↔ edit per song ───── */

function PlaylistBlock({
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
