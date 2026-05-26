"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useAutoSave, AutoSaveStatus } from "../_autosave";
import { s } from "../_utils";
import {
  addPartyMember,
  updatePartyMember,
  deletePartyMember,
  movePartyMember,
  setAnnounceWeddingParty,
  type PartyState,
} from "./actions";

type Member = {
  id: string;
  bridesmaidName: string | null;
  groomsmanName: string | null;
  title: string | null;
  songName: string | null;
  songArtist: string | null;
  notes: string | null;
};

const initial: PartyState = { ok: false };

export function PartyClient({
  announce,
  members,
}: {
  announce: boolean | null;
  members: Member[];
}) {
  const [announceValue, setAnnounceValue] = useState<boolean | null>(announce);
  const [, startTransition] = useTransition();
  const [state, formAction, pending] = useActionState(addPartyMember, initial);

  const toggleAnnounce = (val: boolean) => {
    setAnnounceValue(val);
    startTransition(async () => {
      await setAnnounceWeddingParty(val);
    });
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Announce toggle */}
      <div className="rounded-xl bg-brand-50 p-6 ring-1 ring-brand-200/60">
        <p className="text-sm font-medium text-ink">
          Do you want your wedding party announced?
        </p>
        <div className="mt-3 flex gap-2">
          <ToggleButton active={announceValue === true} onClick={() => toggleAnnounce(true)}>
            Yes
          </ToggleButton>
          <ToggleButton active={announceValue === false} onClick={() => toggleAnnounce(false)}>
            No
          </ToggleButton>
        </div>
        {announceValue === false && (
          <p className="mt-3 text-sm text-muted">
            No need to fill in the rows below — we&rsquo;ll skip the wedding-
            party intros.
          </p>
        )}
      </div>

      {/* Members list */}
      {members.length > 0 && (
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-600">
            Wedding party · {members.length}
          </p>
          <ul className="flex flex-col gap-3">
            {members.map((m, i) => (
              <MemberRow
                key={m.id}
                member={m}
                index={i}
                isFirst={i === 0}
                isLast={i === members.length - 1}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Add row */}
      <form
        action={formAction}
        className="rounded-xl border border-dashed border-brand-300 bg-brand-50/40 p-6 md:p-8"
      >
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-600">
          Add to wedding party
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Bridesmaid name" name="bridesmaidName" placeholder="(or other left-side member)" />
          <Input label="Groomsman name" name="groomsmanName" placeholder="(or other right-side member)" />
          <Input label="Title" name="title" placeholder="e.g. Maid of Honor, Ring Bearer" />
          <Input label="Song name" name="songName" />
          <Input label="Artist" name="songArtist" />
        </div>
        <div className="mt-4">
          <Textarea
            label="Description"
            name="notes"
            rows={2}
            placeholder="Pronunciation help, relationship to the couple, anything the DJ should know."
          />
        </div>
        <div className="mt-5 flex items-center gap-4">
          <Button type="submit" size="md" disabled={pending}>
            {pending ? "Adding…" : "Add member"}
          </Button>
          {!state.ok && state.message && (
            <span className="text-sm font-medium text-red-600">
              {state.message}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

/* ───── one member: display mode ↔ edit mode ───── */

function MemberRow({
  member,
  index,
  isFirst,
  isLast,
}: {
  member: Member;
  index: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [, startTransition] = useTransition();

  const move = (dir: "up" | "down") => {
    startTransition(async () => {
      await movePartyMember(member.id, dir);
    });
  };

  if (editing) {
    return (
      <li className="rounded-xl bg-brand-50 p-5 ring-1 ring-brand-300">
        <MemberEditForm member={member} onDone={() => setEditing(false)} />
      </li>
    );
  }

  return (
    <li className="grid gap-3 rounded-xl border-l-4 border-brand-400 bg-white p-4 ring-1 ring-black/5 md:grid-cols-[36px_1fr_1fr_1fr_auto] md:items-start">
      {/* reorder + index */}
      <div className="flex items-center gap-1 md:flex-col md:items-start md:gap-0.5">
        <span className="text-sm font-semibold text-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex gap-0.5">
          <button
            type="button"
            onClick={() => move("up")}
            disabled={isFirst}
            aria-label="Move up"
            className="rounded px-1 text-muted hover:text-ink disabled:opacity-30"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => move("down")}
            disabled={isLast}
            aria-label="Move down"
            className="rounded px-1 text-muted hover:text-ink disabled:opacity-30"
          >
            ↓
          </button>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-muted">Bridesmaid</p>
        <p className="text-sm font-medium text-ink">
          {member.bridesmaidName || "—"}
        </p>
        {member.title && <p className="text-xs text-muted">({member.title})</p>}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted">Groomsman</p>
        <p className="text-sm font-medium text-ink">
          {member.groomsmanName || "—"}
        </p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted">
          Walk-out song
        </p>
        <p className="text-sm text-ink-soft">
          {member.songName ? (
            <>
              {member.songName}
              {member.songArtist && (
                <span className="text-muted"> — {member.songArtist}</span>
              )}
            </>
          ) : (
            "—"
          )}
        </p>
        {member.notes && (
          <p className="mt-1 text-xs text-muted">{member.notes}</p>
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
        <button
          type="button"
          onClick={() => deletePartyMember(member.id)}
          className="text-xs font-medium text-muted hover:text-red-600"
        >
          Remove
        </button>
      </div>
    </li>
  );
}

function MemberEditForm({
  member,
  onDone,
}: {
  member: Member;
  onDone: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { status, trigger, flush } = useAutoSave(async () => {
    if (!formRef.current) return;
    return updatePartyMember(member.id, new FormData(formRef.current));
  });

  return (
    <form ref={formRef} onChange={trigger} onBlur={flush} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Bridesmaid name" name="bridesmaidName" defaultValue={s(member.bridesmaidName)} />
        <Input label="Groomsman name" name="groomsmanName" defaultValue={s(member.groomsmanName)} />
        <Input label="Title" name="title" defaultValue={s(member.title)} />
        <Input label="Song name" name="songName" defaultValue={s(member.songName)} />
        <Input label="Artist" name="songArtist" defaultValue={s(member.songArtist)} />
      </div>
      <Textarea label="Description" name="notes" rows={2} defaultValue={s(member.notes)} />
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

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-brand-500 text-white"
          : "bg-white text-ink-soft ring-1 ring-black/10 hover:bg-surface-alt"
      }`}
    >
      {children}
    </button>
  );
}
