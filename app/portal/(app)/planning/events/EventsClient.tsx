"use client";

import { useActionState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
  saveQuestions,
  updateAnnouncement,
  deleteAnnouncement,
  addCustomAnnouncement,
  addPlaylistSong,
  deletePlaylistSong,
  type EventsState,
} from "./actions";
import { EVENT_LABEL_BY_KEY, PLAYLIST_TYPES } from "../_constants";

const initial: EventsState = { ok: false };

type Questions = {
  takeAudienceRequests: boolean | null;
  cocktailGenre: string | null;
  receptionGenres: string | null;
  announceLastCall: boolean | null;
  announceShuttle: boolean | null;
  coupleAnnouncement: string | null;
  miscDetails: string | null;
};

type AnnouncementRow = {
  id: string;
  eventKey: string;
  customTitle: string | null;
  announcement: string | null;
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

const YES_NO_OPTIONS = [
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

/* ───────────────────────── component ───────────────────────── */

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
        songs={songs.filter((s) => s.listType === "COCKTAIL_DINNER")}
      />
      <PlaylistBlock
        listType="RECEPTION_PLAYLIST"
        title={PLAYLIST_TYPES.RECEPTION_PLAYLIST}
        description="Songs you want on the dance floor (suggest no more than 20 — leaves room for guest requests + DJ reads)."
        songs={songs.filter((s) => s.listType === "RECEPTION_PLAYLIST")}
      />
      <PlaylistBlock
        listType="DO_NOT_PLAY"
        title={PLAYLIST_TYPES.DO_NOT_PLAY}
        description="Songs we should not play under any circumstances."
        songs={songs.filter((s) => s.listType === "DO_NOT_PLAY")}
      />
    </div>
  );
}

/* ───── Questions ───── */

function QuestionsBlock({ initial: q }: { initial: Questions }) {
  const [state, formAction, pending] = useActionState(saveQuestions, initial);
  return (
    <form
      action={formAction}
      className="rounded-xl bg-white p-6 ring-1 ring-black/5 md:p-8"
    >
      <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-brand-600">
        DJ Questions
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Take audience requests?"
          name="takeAudienceRequests"
          options={YES_NO_OPTIONS}
          placeholder="—"
          defaultValue={boolToStr(q.takeAudienceRequests)}
        />
        <Input
          label="Genre for cocktail / dinner hour"
          name="cocktailGenre"
          defaultValue={s(q.cocktailGenre)}
          placeholder="e.g. acoustic, jazz, indie"
        />
        <Input
          label="Reception genres to focus on"
          name="receptionGenres"
          defaultValue={s(q.receptionGenres)}
          placeholder="e.g. 2010s pop, classic rock, hip-hop"
        />
        <Select
          label="Announce last call for alcohol?"
          name="announceLastCall"
          options={YES_NO_OPTIONS}
          placeholder="—"
          defaultValue={boolToStr(q.announceLastCall)}
        />
        <Select
          label="Announce shuttle times?"
          name="announceShuttle"
          options={YES_NO_OPTIONS}
          placeholder="—"
          defaultValue={boolToStr(q.announceShuttle)}
        />
      </div>
      <div className="mt-5 grid gap-5">
        <Textarea
          label="How would you like to be announced as a couple?"
          name="coupleAnnouncement"
          rows={2}
          defaultValue={s(q.coupleAnnouncement)}
          placeholder='e.g. "Mr. and Mrs. Smith"'
        />
        <Textarea
          label="Miscellaneous details"
          name="miscDetails"
          rows={3}
          defaultValue={s(q.miscDetails)}
        />
      </div>
      <div className="mt-5 flex items-center gap-4">
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Saving…" : "Save questions"}
        </Button>
        {state.ok && state.message && (
          <span className="text-sm font-medium text-brand-700">
            {state.message}
          </span>
        )}
        {!state.ok && state.message && (
          <span className="text-sm font-medium text-red-600">
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}

/* ───── Event announcements ───── */

function AnnouncementsBlock({
  announcements,
}: {
  announcements: AnnouncementRow[];
}) {
  return (
    <div>
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-600">
        Events
      </p>
      <p className="mb-5 text-sm text-muted">
        Tweak the DJ&rsquo;s scripted intro for each moment, pick the song,
        and leave any notes. Leave a row blank to skip that event.
      </p>
      <ul className="flex flex-col gap-4">
        {announcements.map((a) => (
          <AnnouncementRowEditor key={a.id} row={a} />
        ))}
      </ul>
      <CustomAnnouncementForm />
    </div>
  );
}

function AnnouncementRowEditor({ row }: { row: AnnouncementRow }) {
  const [, startTransition] = useTransition();
  const isDefault = row.eventKey !== "CUSTOM";
  const label =
    isDefault
      ? EVENT_LABEL_BY_KEY[row.eventKey] ?? row.eventKey
      : row.customTitle || "(Untitled custom event)";

  return (
    <li className="rounded-xl bg-white p-5 ring-1 ring-black/5">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold text-ink">{label}</p>
        {!isDefault && (
          <button
            type="button"
            onClick={() => deleteAnnouncement(row.id)}
            className="text-xs font-medium text-muted hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>
      <form
        action={(fd) => {
          startTransition(async () => {
            await updateAnnouncement(row.id, fd);
          });
        }}
        className="grid gap-3"
      >
        {!isDefault && (
          <Input
            label="Title"
            name="customTitle"
            defaultValue={s(row.customTitle)}
            required
          />
        )}
        <Textarea
          label="DJ announcement"
          name="announcement"
          rows={2}
          defaultValue={s(row.announcement)}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Song name"
            name="songName"
            defaultValue={s(row.songName)}
          />
          <Input
            label="Artist"
            name="songArtist"
            defaultValue={s(row.songArtist)}
          />
        </div>
        <Input label="Notes" name="notes" defaultValue={s(row.notes)} />
        <div>
          <Button type="submit" size="md" variant="secondary">
            Save
          </Button>
        </div>
      </form>
    </li>
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
      className="mt-6 rounded-xl border border-dashed border-black/15 p-6"
    >
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted">
        Add a custom event
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Event title" name="customTitle" required />
        <Input label="Song name" name="songName" />
        <Input label="Artist" name="songArtist" />
        <Input label="Notes" name="notes" />
      </div>
      <div className="mt-4">
        <Textarea label="DJ announcement" name="announcement" rows={2} />
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

/* ───── Playlist (per list type) ───── */

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
    <div className="rounded-xl bg-white p-6 ring-1 ring-black/5 md:p-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
        {title}
      </p>
      <p className="mt-1 text-sm text-muted">{description}</p>

      {songs.length === 0 ? (
        <p className="mt-4 rounded-md border border-dashed border-black/15 px-4 py-3 text-sm text-muted">
          No songs yet.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {songs.map((s) => (
            <li
              key={s.id}
              className="grid gap-2 rounded-md bg-surface px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <p className="text-sm font-medium text-ink">
                  {s.songName}
                  {s.songArtist && (
                    <span className="font-normal text-muted">
                      {" "}
                      — {s.songArtist}
                    </span>
                  )}
                </p>
                {s.notes && (
                  <p className="text-xs text-muted">{s.notes}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => deletePlaylistSong(s.id)}
                className="text-xs font-medium text-muted hover:text-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <form action={formAction} className="mt-5 grid gap-3 sm:grid-cols-[2fr_2fr_2fr_auto] sm:items-end">
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
