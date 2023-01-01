export interface Song {
  id: number;
  artist: string;
  name: string;
  spotifyId?: string;
}

export type NewSong = Pick<Song, "name" | "artist">;
