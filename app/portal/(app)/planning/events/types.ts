/**
 * Shared types for the Events & Music sub-routes. Plain `.ts` so the
 * server `page.tsx` and the client blocks can both import it.
 */

export type Questions = {
  takeAudienceRequests: boolean | null;
  cocktailGenre: string | null;
  receptionGenres: string | null;
  announceLastCall: boolean | null;
  announceShuttle: boolean | null;
  shuttleTimes: string | null;
  coupleAnnouncement: string | null;
  miscDetails: string | null;
};

export type AnnouncementRow = {
  id: string;
  eventKey: string;
  customTitle: string | null;
  peopleInvolved: string | null;
  songName: string | null;
  songArtist: string | null;
  notes: string | null;
};

export type SongRow = {
  id: string;
  listType: string;
  songName: string;
  songArtist: string | null;
  notes: string | null;
};
