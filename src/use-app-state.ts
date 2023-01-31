import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { LocalStorageKey } from "./lib/local-storage";
import { NewSong, Song } from "./song";
import { useSongs } from "./use-songs";

export interface AppState {
  topSongs: Song[];
  bubble: Song[];
  nextId: number;
  maxTopSongs: number;
}

const defaultAppState: AppState = {
  maxTopSongs: 10,
  bubble: [],
  topSongs: [],
  nextId: 1,
};

type AppStateListName = keyof Pick<AppState, "topSongs" | "bubble">;

export function useAppState() {
  const [initState, setAppStateStoredValue] = useLocalStorage<AppState>(
    LocalStorageKey.AppState,
    defaultAppState
  );

  const [maxTopSongs, setMaxTopSongs] = useState<number>(initState.maxTopSongs);

  const [nextId, setNextId] = useState(initState.nextId);

  const topSongs = useSongs({
    songs: initState.topSongs,
    maxLength: maxTopSongs,
  });

  const bubble = useSongs({
    songs: initState.bubble,
    maxLength: null,
  });

  const state = useMemo<AppState>(() => {
    return {
      maxTopSongs,
      nextId,
      topSongs: topSongs.state.songs,
      bubble: bubble.state.songs,
    };
  }, [nextId, topSongs.state.songs, bubble.state.songs, maxTopSongs]);

  // Local Storage
  useEffect(() => {
    setAppStateStoredValue(state);
  }, [state, setAppStateStoredValue]);

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
    setMaxTopSongs,
    createSongInList,
    moveSongFromList,
  };
}
