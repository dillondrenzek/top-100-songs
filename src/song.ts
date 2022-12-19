export interface Song {
  id: number;
  count: number;
  artist: string;
  name: string;
}

export type NewSong = Pick<Song, "name" | "artist">;
