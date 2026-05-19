"use client";

import { useActionState, useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  addPartyMember,
  deletePartyMember,
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
      <div className="rounded-xl bg-white p-6 ring-1 ring-black/5">
        <p className="text-sm font-medium text-ink">
          Do you want your wedding party announced?
        </p>
        <div className="mt-3 flex gap-2">
          <ToggleButton
            active={announceValue === true}
            onClick={() => toggleAnnounce(true)}
          >
            Yes
          </ToggleButton>
          <ToggleButton
            active={announceValue === false}
            onClick={() => toggleAnnounce(false)}
          >
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
        <div className="rounded-xl bg-white p-6 ring-1 ring-black/5 md:p-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-600">
            Wedding party
          </p>
          <ul className="flex flex-col gap-3">
            {members.map((m, i) => (
              <li
                key={m.id}
                className="grid gap-3 rounded-md bg-surface p-4 md:grid-cols-[40px_1fr_1fr_1fr_auto] md:items-start"
              >
                <span className="text-sm font-semibold text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">
                    Bridesmaid
                  </p>
                  <p className="text-sm font-medium text-ink">
                    {m.bridesmaidName || "—"}
                  </p>
                  {m.title && (
                    <p className="text-xs text-muted">({m.title})</p>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">
                    Groomsman
                  </p>
                  <p className="text-sm font-medium text-ink">
                    {m.groomsmanName || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted">
                    Walk-out song
                  </p>
                  <p className="text-sm text-ink-soft">
                    {m.songName ? (
                      <>
                        {m.songName}
                        {m.songArtist && (
                          <span className="text-muted"> — {m.songArtist}</span>
                        )}
                      </>
                    ) : (
                      "—"
                    )}
                  </p>
                  {m.notes && <p className="text-xs text-muted">{m.notes}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => deletePartyMember(m.id)}
                  className="text-xs font-medium text-muted hover:text-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add row */}
      <form
        action={formAction}
        className="rounded-xl bg-white p-6 ring-1 ring-black/5 md:p-8"
      >
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-600">
          Add to wedding party
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Bridesmaid name"
            name="bridesmaidName"
            placeholder="(or other left-side member)"
          />
          <Input
            label="Groomsman name"
            name="groomsmanName"
            placeholder="(or other right-side member)"
          />
          <Input
            label="Title"
            name="title"
            placeholder="e.g. Maid of Honor, Ring Bearer"
          />
          <Input label="Song name" name="songName" />
          <Input label="Artist" name="songArtist" />
          <Input label="Notes" name="notes" placeholder="pronunciation, etc." />
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
          : "bg-surface text-ink-soft hover:bg-surface-alt"
      }`}
    >
      {children}
    </button>
  );
}
