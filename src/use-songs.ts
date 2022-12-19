import { Reducer, useCallback, useEffect, useReducer } from "react";
import { NewSong, Song } from "./song";
import { useLocalStorage } from "usehooks-ts";

function promoteItem(arr: any[], item: any): any[] {
  // find item index (n)
  const currentIndex = arr.indexOf(item);

  if (currentIndex === -1 || currentIndex === 0) {
    return arr;
  }

  const prevItem = arr[currentIndex - 1];
  const currItem = arr[currentIndex];

  return [
    ...arr.slice(0, currentIndex - 1),
    currItem,
    prevItem,
    ...arr.slice(currentIndex + 1),
  ];
}

function demoteItem(items: any[], item: any): any[] {
  // find item index (n)
  const currentIndex = items.indexOf(item);

  if (currentIndex === -1 || currentIndex >= items.length - 1) {
    return items;
  }

  const nextItem = items[currentIndex + 1];
  const currItem = items[currentIndex];

  return [
    ...items.slice(0, currentIndex),
    nextItem,
    currItem,
    ...items.slice(currentIndex + 2),
  ];
}

function moveItemToTop(items: any[], item: any): any[] {
  // Identity Equality
  const foundItemIndex = items.findIndex((val) => item === val);

  if (foundItemIndex === -1 || foundItemIndex === 0) {
    return items;
  }

  return [
    items[foundItemIndex],
    ...items.slice(0, foundItemIndex),
    ...items.slice(foundItemIndex + 1),
  ];
}

function moveItemToBottom(items: any[], item: any): any[] {
  // Identity Equality
  const foundItemIndex = items.findIndex((val) => item === val);

  if (foundItemIndex === -1) {
    return items;
  }

  return [
    ...items.slice(0, foundItemIndex),
    ...items.slice(foundItemIndex + 1),
    items[foundItemIndex],
  ];
}

enum LocalStorageKey {
  Songs = "Songs",
  SongId = "SongId",
  SongsDataState = "SongsDataState",
}

type SongsReducerAction =
  | { type: "SET_SONGS"; payload: Song[] }
  | { type: "PROMOTE_SONG"; payload: Song }
  | { type: "DEMOTE_SONG"; payload: Song }
  | { type: "MOVE_SONG_TO_TOP"; payload: Song }
  | { type: "MOVE_SONG_TO_BOTTOM"; payload: Song }
  | { type: "CREATE_SONG"; payload: NewSong };

interface SongsDataState {
  version: number;
  nextId: number;
  songs: Song[];
}

export function useSongs() {
  const version = 1;

  // Local Storage
  const [storedState, setStoredState] = useLocalStorage<SongsDataState>(
    LocalStorageKey.SongsDataState,
    {
      version,
      nextId: 1,
      songs: [],
    }
  );

  // Reducer
  const [state, dispatch] = useReducer<
    Reducer<SongsDataState, SongsReducerAction>
  >((prevState, action) => {
    switch (action.type) {
      case "CREATE_SONG": {
        const newSong: Song = {
          id: prevState.nextId,
          count: 0,
          ...action.payload,
        };
        return {
          ...prevState,
          id: prevState.nextId + 1,
          songs: [newSong, ...prevState.songs],
        };
      }

      case "PROMOTE_SONG": {
        return {
          ...prevState,
          songs: promoteItem(prevState.songs, action.payload),
        };
      }

      case "DEMOTE_SONG": {
        return {
          ...prevState,
          songs: demoteItem(prevState.songs, action.payload),
        };
      }

      case "MOVE_SONG_TO_TOP": {
        return {
          ...prevState,
          songs: moveItemToTop(prevState.songs, action.payload),
        };
      }

      case "MOVE_SONG_TO_BOTTOM": {
        return {
          ...prevState,
          songs: moveItemToBottom(prevState.songs, action.payload),
        };
      }

      case "SET_SONGS": {
        return {
          ...prevState,
          songs: action.payload,
        };
      }

      default:
        return prevState;
    }
  }, storedState);

  // Update LocalStorage when state changes
  useEffect(() => {
    setStoredState(state);
  }, [setStoredState, state]);

  // Public API

  const createSong = useCallback((newSong: NewSong) => {
    dispatch({
      type: "CREATE_SONG",
      payload: newSong,
    });
  }, []);

  const promoteSong = useCallback((song: Song) => {
    dispatch({
      type: "PROMOTE_SONG",
      payload: song,
    });
  }, []);

  const demoteSong = useCallback((song: Song) => {
    dispatch({
      type: "DEMOTE_SONG",
      payload: song,
    });
  }, []);

  const moveSongToTop = useCallback((song: Song) => {
    dispatch({
      type: "MOVE_SONG_TO_TOP",
      payload: song,
    });
  }, []);

  const moveSongToBottom = useCallback((song: Song) => {
    dispatch({
      type: "MOVE_SONG_TO_BOTTOM",
      payload: song,
    });
  }, []);

  const setSongs = useCallback((newSongs: Song[]) => {
    dispatch({ type: "SET_SONGS", payload: newSongs });
  }, []);

  const printState = useCallback(() => {
    console.log(state);
    console.log(JSON.stringify(state));
  }, [state]);

  return {
    songs: state.songs,
    setSongs,
    createSong,
    promoteSong,
    demoteSong,
    moveSongToTop,
    moveSongToBottom,
    printState,
  };
}
