/**
 * Represents a song
 */
export interface Song {
  /**
   * Unique identifier
   */
  id: number;
  /**
   * User-input string detailing artist's display name
   */
  artist: string;
  /**
   * User-input string detailing track's display name
   */
  name: string;
  /**
   * id that can be used to identify Spotify assets
   */
  spotifyId?: string;
}

/**
 * Type Guard for `Song` model
 * @param val unknown value
 * @returns true if Song
 */
export function isSong(val: unknown): val is Song {
  if (!val || typeof val !== "object") {
    return false;
  }

  return "id" in val || "artist" in val || "name" in val;
}

/**
 * Properties required to create a new `Song` model
 */
export type NewSong = Pick<Song, "name" | "artist">;
