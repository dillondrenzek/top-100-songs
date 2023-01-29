import { useCallback, useMemo, useState } from "react";
import { NewSong, Song } from "./song";
import { useSongs } from "./use-songs";

export interface AppState {
  topSongs: Song[];
  bubble: Song[];
  nextId: number;
}

type AppStateListName = keyof Pick<AppState, "topSongs" | "bubble">;

export function useAppState(initState: AppState): {
  state: AppState;
  topSongs: ReturnType<typeof useSongs>;
  bubble: ReturnType<typeof useSongs>;
  createSongInList: (newSong: NewSong, listName: AppStateListName) => void;
  moveSongFromList: (
    song: Song,
    fromList: AppStateListName,
    toList: AppStateListName
  ) => void;
} {
  const [nextId, setNextId] = useState(initState.nextId);
  const topSongs = useSongs({
    songs: initState.topSongs,
  });
  const bubble = useSongs({
    songs: initState.bubble,
  });

  const state = useMemo<AppState>(() => {
    return {
      nextId,
      topSongs: topSongs.state.songs,
      bubble: bubble.state.songs,
    };
  }, [nextId, topSongs.state.songs, bubble.state.songs]);

  const createSongInList = useCallback(
    (newSong: NewSong, listName: AppStateListName) => {
      const song: Song = {
        id: nextId,
        ...newSong,
      };

      setNextId((id) => id + 1);

      switch (listName) {
        case "topSongs":
          topSongs.addSong(song);
          break;
        case "bubble":
          bubble.addSong(song);
          break;
        default:
          return;
      }
    },
    [nextId, topSongs, bubble]
  );

  const moveSongFromList = useCallback(
    (song: Song, fromList: AppStateListName, toList: AppStateListName) => {
      const from = fromList === "bubble" ? bubble : topSongs;
      const to = toList === "bubble" ? bubble : topSongs;
      from.removeSong(song);
      to.addSong(song);
    },
    [bubble, topSongs]
  );

  return {
    state,
    topSongs,
    bubble,
    createSongInList,
    moveSongFromList,
  };
}
