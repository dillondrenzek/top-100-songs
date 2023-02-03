import { Reducer, useCallback, useReducer } from "react";
import { NewSong, Song } from "./song";
import * as ArrayHelpers from "./lib/array";

type SongsReducerAction =
  | { type: "SET_SONGS"; payload: Song[] }
  | { type: "PROMOTE_SONG"; payload: Song }
  | { type: "DEMOTE_SONG"; payload: Song }
  | { type: "MOVE_SONG_TO_TOP"; payload: Song }
  | { type: "MOVE_SONG_TO_BOTTOM"; payload: Song }
  | { type: "CREATE_SONG"; payload: NewSong }
  | { type: "ADD_SONG"; payload: Song }
  | { type: "UPDATE_SONG"; payload: Song }
  | { type: "REMOVE_SONG"; payload: Song }
  | { type: "RESET_STATE" };

export interface SongsDataState {
  songs: Song[];
  maxLength: number | null;
}

const defaultState: SongsDataState = {
  songs: [],
  maxLength: null,
};

export function useSongs(initState: SongsDataState = defaultState) {
  // Reducer
  const [state, dispatch] = useReducer<
    Reducer<SongsDataState, SongsReducerAction>
  >((prevState, action) => {
    switch (action.type) {
      case "ADD_SONG": {
        if (
          prevState.maxLength &&
          prevState.songs.length >= prevState.maxLength
        ) {
          // throw new Error("MAX_LENGTH");
          return prevState;
        }
        return {
          ...prevState,
          songs: [action.payload, ...prevState.songs],
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
  }, initState);

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

  const addSong = useCallback((song: Song) => {
    dispatch({
      type: "ADD_SONG",
      payload: song,
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

  return {
    state,
    songs: state.songs,

    setSongs,
    getSongById,
    updateSong,
    addSong,
    removeSong,
    promoteSong,
    demoteSong,
    moveSongToTop,
    moveSongToBottom,
  };
}
