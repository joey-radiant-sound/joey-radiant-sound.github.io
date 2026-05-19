"use client";

import { useActionState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import {
  saveCeremonyQuestions,
  updateCeremonySegment,
  deleteCeremonySegment,
  addCustomCeremonySegment,
  type CeremonyState,
} from "./actions";
import { CEREMONY_SEGMENT_LABEL } from "../_constants";

const initial: CeremonyState = { ok: false };

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

type Questions = {
  ceremonyWalkOutOrder: string | null;
  ceremonyWirelessMic: boolean | null;
  ceremonyOutdoors: boolean | null;
  ceremonyOtherDetails: string | null;
};

type Segment = {
  id: string;
  segment: string;
  customLabel: string | null;
  songName: string | null;
  songArtist: string | null;
  notes: string | null;
};

export function CeremonyClient({
  questions,
  segments,
}: {
  questions: Questions;
  segments: Segment[];
}) {
  return (
    <div className="flex flex-col gap-8">
      <MusicBlock segments={segments} />
      <QuestionsBlock initial={questions} />
    </div>
  );
}

function MusicBlock({ segments }: { segments: Segment[] }) {
  return (
    <div>
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-600">
        Music
      </p>
      <ul className="flex flex-col gap-4">
        {segments.map((seg) => (
          <SegmentEditor key={seg.id} segment={seg} />
        ))}
      </ul>
      <CustomSegmentForm />
    </div>
  );
}

function SegmentEditor({ segment }: { segment: Segment }) {
  const [, startTransition] = useTransition();
  const isDefault = segment.segment !== "CUSTOM";
  const label =
    isDefault
      ? CEREMONY_SEGMENT_LABEL[segment.segment] ?? segment.segment
      : segment.customLabel || "(Untitled custom segment)";

  return (
    <li className="rounded-xl bg-white p-5 ring-1 ring-black/5">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <p className="text-sm font-semibold text-ink">{label}</p>
        {!isDefault && (
          <button
            type="button"
            onClick={() => deleteCeremonySegment(segment.id)}
            className="text-xs font-medium text-muted hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>
      <form
        action={(fd) => {
          startTransition(async () => {
            await updateCeremonySegment(segment.id, fd);
          });
        }}
        className="grid gap-3"
      >
        {!isDefault && (
          <Input
            label="Label"
            name="customLabel"
            defaultValue={s(segment.customLabel)}
            required
          />
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Song name"
            name="songName"
            defaultValue={s(segment.songName)}
          />
          <Input
            label="Artist"
            name="songArtist"
            defaultValue={s(segment.songArtist)}
          />
        </div>
        <Input label="Notes" name="notes" defaultValue={s(segment.notes)} />
        <div>
          <Button type="submit" size="md" variant="secondary">
            Save
          </Button>
        </div>
      </form>
    </li>
  );
}

function CustomSegmentForm() {
  const [state, formAction, pending] = useActionState(
    addCustomCeremonySegment,
    initial,
  );
  return (
    <form
      action={formAction}
      className="mt-6 rounded-xl border border-dashed border-black/15 p-6"
    >
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted">
        Add a custom segment
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Label" name="customLabel" required />
        <Input label="Song name" name="songName" />
        <Input label="Artist" name="songArtist" />
        <Input label="Notes" name="notes" />
      </div>
      <div className="mt-4 flex items-center gap-4">
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Adding…" : "Add segment"}
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

function QuestionsBlock({ initial: q }: { initial: Questions }) {
  const [state, formAction, pending] = useActionState(
    saveCeremonyQuestions,
    initial,
  );
  return (
    <form
      action={formAction}
      className="rounded-xl bg-white p-6 ring-1 ring-black/5 md:p-8"
    >
      <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-brand-600">
        Ceremony Questions
      </p>
      <div className="grid gap-5">
        <Textarea
          label="Walk-out order"
          name="ceremonyWalkOutOrder"
          rows={3}
          defaultValue={s(q.ceremonyWalkOutOrder)}
          placeholder="e.g. Officiant and Groom, groomsman, bridesmaids, bride…"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            label="Wireless microphone + stand needed?"
            name="ceremonyWirelessMic"
            options={YES_NO}
            placeholder="—"
            defaultValue={boolToStr(q.ceremonyWirelessMic)}
          />
          <Select
            label="Ceremony outdoors?"
            name="ceremonyOutdoors"
            options={YES_NO}
            placeholder="—"
            defaultValue={boolToStr(q.ceremonyOutdoors)}
          />
        </div>
        <Textarea
          label="Other ceremony details"
          name="ceremonyOtherDetails"
          rows={3}
          defaultValue={s(q.ceremonyOtherDetails)}
        />
      </div>
      <div className="mt-5 flex items-center gap-4">
        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Saving…" : "Save ceremony questions"}
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
