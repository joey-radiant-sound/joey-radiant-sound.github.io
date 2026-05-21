"use client";

import { useActionState, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useAutoSave, AutoSaveStatus } from "../_autosave";
import { CEREMONY_SEGMENT_LABEL } from "../_constants";
import {
  saveCeremonyQuestions,
  updateCeremonySegment,
  deleteCeremonySegment,
  addCustomCeremonySegment,
  type CeremonyState,
} from "./actions";

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
      <ul className="flex flex-col gap-3">
        {segments.map((seg) => (
          <SegmentRowItem key={seg.id} segment={seg} />
        ))}
      </ul>
      <CustomSegmentForm />
    </div>
  );
}

function SegmentRowItem({ segment }: { segment: Segment }) {
  const [editing, setEditing] = useState(false);
  const isCustom = segment.segment === "CUSTOM";
  const label = isCustom
    ? segment.customLabel || "(Untitled custom segment)"
    : CEREMONY_SEGMENT_LABEL[segment.segment] ?? segment.segment;

  if (editing) {
    return (
      <li className="rounded-xl bg-brand-50 p-5 ring-1 ring-brand-300">
        <p className="mb-3 text-sm font-semibold text-ink">{label}</p>
        <SegmentEditForm segment={segment} onDone={() => setEditing(false)} />
      </li>
    );
  }

  const filledIn = segment.songName || segment.notes;

  return (
    <li className="grid gap-3 rounded-xl border-l-4 border-brand-400 bg-white p-4 ring-1 ring-black/5 md:grid-cols-[1fr_auto] md:items-start">
      <div>
        <p className="text-sm font-semibold text-ink">{label}</p>
        {filledIn ? (
          <p className="mt-1 text-sm text-ink-soft">
            {segment.songName}
            {segment.songArtist && (
              <span className="text-muted"> — {segment.songArtist}</span>
            )}
            {segment.notes && (
              <span className="text-muted"> · {segment.notes}</span>
            )}
          </p>
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
            onClick={() => deleteCeremonySegment(segment.id)}
            className="text-xs font-medium text-muted hover:text-red-600"
          >
            Remove
          </button>
        )}
      </div>
    </li>
  );
}

function SegmentEditForm({
  segment,
  onDone,
}: {
  segment: Segment;
  onDone: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { status, trigger, flush } = useAutoSave(async () => {
    if (!formRef.current) return;
    return updateCeremonySegment(segment.id, new FormData(formRef.current));
  });
  const isCustom = segment.segment === "CUSTOM";

  return (
    <form ref={formRef} onChange={trigger} onBlur={flush} className="grid gap-3">
      {isCustom && (
        <Input label="Label" name="customLabel" defaultValue={s(segment.customLabel)} required />
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Song name" name="songName" defaultValue={s(segment.songName)} />
        <Input label="Artist" name="songArtist" defaultValue={s(segment.songArtist)} />
      </div>
      <Input label="Notes" name="notes" defaultValue={s(segment.notes)} />
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

function CustomSegmentForm() {
  const [state, formAction, pending] = useActionState(
    addCustomCeremonySegment,
    initial,
  );
  return (
    <form
      action={formAction}
      className="mt-6 rounded-xl border border-dashed border-brand-300 bg-brand-50/40 p-6"
    >
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-600">
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
  const formRef = useRef<HTMLFormElement>(null);
  const { status, trigger, flush } = useAutoSave(async () => {
    if (!formRef.current) return;
    return saveCeremonyQuestions({ ok: false }, new FormData(formRef.current));
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
          Ceremony Questions
        </p>
        <AutoSaveStatus status={status} />
      </div>
      <div className="grid gap-5">
        <Textarea
          label="Walk-out order"
          name="ceremonyWalkOutOrder"
          rows={3}
          defaultValue={s(q.ceremonyWalkOutOrder)}
          placeholder="e.g. Officiant and Groom, groomsman, bridesmaids, bride…"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Select label="Wireless microphone + stand needed?" name="ceremonyWirelessMic" options={YES_NO} placeholder="—" defaultValue={boolToStr(q.ceremonyWirelessMic)} />
          <Select label="Ceremony outdoors?" name="ceremonyOutdoors" options={YES_NO} placeholder="—" defaultValue={boolToStr(q.ceremonyOutdoors)} />
        </div>
        <Textarea label="Other ceremony details" name="ceremonyOtherDetails" rows={3} defaultValue={s(q.ceremonyOtherDetails)} />
      </div>
    </form>
  );
}
