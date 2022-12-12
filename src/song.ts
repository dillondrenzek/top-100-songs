export const SortSongs = {
  descending(a: Song, b: Song): number {
    return b.count - a.count;
  },
};

export interface Song {
  count: number;
  artist: string;
  name: string;
}

export type NewSong = Pick<Song, "name" | "artist">;

export function createSong(values: NewSong): Song {
  return {
    count: 0,
    ...values,
  };
}
