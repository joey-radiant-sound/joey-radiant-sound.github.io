"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { useAutoSave, AutoSaveStatus } from "../_autosave";
import { s, boolToStr } from "../_utils";
import { saveQuestions } from "./actions";
import type { Questions } from "./types";

const YES_NO = [
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
] as const;

/**
 * DJ questions form. Auto-saves the whole form on input change.
 * Reveals a "What time(s)?" field when `announceShuttle` flips to Yes.
 */
export function QuestionsBlock({
  projectId,
  initial: q,
}: {
  projectId: string;
  initial: Questions;
}) {
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
      <input type="hidden" name="projectId" value={projectId} />
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
        <Textarea
          label="How would you like to be announced as a couple?"
          name="coupleAnnouncement"
          rows={2}
          defaultValue={s(q.coupleAnnouncement)}
          placeholder='e.g. "Mr. and Mrs. Smith"'
        />
        <Textarea label="Miscellaneous details" name="miscDetails" rows={3} defaultValue={s(q.miscDetails)} />
      </div>
    </form>
  );
}
