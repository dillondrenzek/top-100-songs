import { Reducer, useCallback, useEffect, useReducer } from "react";
import { NewSong, Song } from "./song";
import { useLocalStorage } from "usehooks-ts";
import * as ArrayHelpers from "./lib/array";

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
  | { type: "CREATE_SONG"; payload: NewSong }
  | { type: "UPDATE_SONG"; payload: Song }
  | { type: "REMOVE_SONG"; payload: Song }
  | { type: "RESET_STATE" };

interface SongsDataState {
  version: number;
  nextId: number;
  songs: Song[];
}

export function useSongs() {
  const version = 1;

  const defaultState: SongsDataState = {
    version,
    nextId: 1,
    songs: [],
  };

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
          ...action.payload,
        };
        return {
          ...prevState,
          nextId: prevState.nextId + 1,
          songs: [newSong, ...prevState.songs],
        };
      }

      case "UPDATE_SONG": {
        const id = action.payload.id;

        const index = prevState.songs.findIndex((value) => value.id === id);
        const newSongs = [...prevState.songs];
        newSongs[index] = { ...action.payload };

        return {
          ...prevState,
          songs: [...newSongs],
        };
      }

      case "REMOVE_SONG": {
        return {
          ...prevState,
          songs: prevState.songs.filter((item) => item !== action.payload),
        };
      }

      case "PROMOTE_SONG": {
        return {
          ...prevState,
          songs: ArrayHelpers.promoteItem(prevState.songs, action.payload),
        };
      }

      case "DEMOTE_SONG": {
        return {
          ...prevState,
          songs: ArrayHelpers.demoteItem(prevState.songs, action.payload),
        };
      }

      case "MOVE_SONG_TO_TOP": {
        return {
          ...prevState,
          songs: ArrayHelpers.moveItemToTop(prevState.songs, action.payload),
        };
      }

      case "MOVE_SONG_TO_BOTTOM": {
        return {
          ...prevState,
          songs: ArrayHelpers.moveItemToBottom(prevState.songs, action.payload),
        };
      }

      case "SET_SONGS": {
        return {
          ...prevState,
          songs: action.payload,
        };
      }

      case "RESET_STATE": {
        return {
          ...defaultState,
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

  const getSongById = useCallback(
    (id: number) => {
      return state.songs.find((item) => item.id === id);
    },
    [state.songs]
  );

  const updateSong = useCallback((song: Song) => {
    dispatch({
      type: "UPDATE_SONG",
      payload: song,
    });
  }, []);

  const createSong = useCallback((newSong: NewSong) => {
    dispatch({
      type: "CREATE_SONG",
      payload: newSong,
    });
  }, []);

  const removeSong = useCallback((song: Song) => {
    dispatch({
      type: "REMOVE_SONG",
      payload: song,
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
    state,
    songs: state.songs,

    setSongs,
    getSongById,
    updateSong,
    createSong,
    removeSong,
    promoteSong,
    demoteSong,
    moveSongToTop,
    moveSongToBottom,
    printState,
  };
}
