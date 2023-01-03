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
 * Properties required to create a new `Song` model
 */
export type NewSong = Pick<Song, "name" | "artist">;
