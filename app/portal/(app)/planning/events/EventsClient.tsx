"use client";

import { PLAYLIST_TYPES } from "../_constants";
import { QuestionsBlock } from "./QuestionsBlock";
import { AnnouncementsBlock } from "./AnnouncementsBlock";
import { PlaylistBlock } from "./PlaylistBlock";
import type { Questions, AnnouncementRow, SongRow } from "./types";

/**
 * Composition root for the Events & Music tab. Each section is its
 * own file in this directory; this component just lays them out.
 */
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
