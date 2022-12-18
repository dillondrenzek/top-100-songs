import {
  Card,
  List,
  ListItem,
  ListItemText,
  Stack,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import { FormikHelpers } from "formik";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useCallback, useEffect, useState } from "react";
import { useNewSongForm } from "../use-new-song-form";
import { NewSong, createSong, Song } from "../song";
import { useRankedList } from "../use-ranked-list";

enum LocalStorageKey {
  Songs = "Songs",
}

function useLocalStorage(key: LocalStorageKey) {
  const [_value, _setValue] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage) {
      _setValue(localStorage.getItem(key));
    }
  }, [key]);

  const setValue = useCallback(
    (value: string) => {
      try {
        if (localStorage) {
          localStorage.setItem(key, value);
          const stored = localStorage.getItem(key);
          if (stored === value) {
            _setValue(stored);
            return true;
          }
        }
      } catch (e) {
        console.error("Error setting localstorage:", e);
      }
      return false;
    },
    [key]
  );

  return {
    value: _value,
    setValue,
  };
}

function serializeSongs(songs: Song[]): string {
  return JSON.stringify(songs);
}

function deserializeSongs(data: string): Song[] {
  try {
    const deserializedData = JSON.parse(data);

    if (Array.isArray(deserializedData)) {
      return deserializedData;
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

function useSongs() {
  const [hasStarted, setHasStarted] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const { value, setValue } = useLocalStorage(LocalStorageKey.Songs);

  // Initialize
  useEffect(() => {
    if (!hasStarted) {
      if (value) {
        setSongs(deserializeSongs(value));
      }
      setHasStarted(true);
    }
  }, [hasStarted, value]);

  // When songs changes
  useEffect(() => {
    // Set local storage value
    setValue(serializeSongs(songs));
  }, [songs, setValue]);

  return {
    songs,
    setSongs,
  };
}

export function SongList() {
  const { songs, setSongs } = useSongs();
  const { items, promoteItem, demoteItem, addItem } = useRankedList(songs);

  useEffect(() => {
    setSongs(items);
  }, [items, setSongs]);

  const onSubmit = useCallback(
    (newSong: NewSong, formikHelpers: FormikHelpers<NewSong>) => {
      addItem(createSong(newSong));

      formikHelpers.resetForm();
    },
    [addItem]
  );

  const { handleSubmit, handleChange, handleBlur, values } = useNewSongForm({
    initialValues: {
      name: "",
      artist: "",
    },
    onSubmit,
  });

  return (
    <Stack direction="column" alignItems="flex-start" spacing={2}>
      <Card sx={{ px: 3, py: 2 }}>
        <Stack
          direction="row"
          spacing={2}
          component="form"
          onSubmit={handleSubmit}
        >
          <TextField
            tabIndex={0}
            name="name"
            label="Name"
            variant="outlined"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <TextField
            tabIndex={1}
            name="artist"
            label="Artist"
            variant="outlined"
            value={values.artist}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Button type="submit" variant="outlined">
            New
          </Button>
        </Stack>
      </Card>
      <Card sx={{ width: "100%", px: 1, py: 1 }}>
        {items.length ? (
          <List>
            {items.map((song, i) => (
              <ListItem key={i}>
                <Stack direction="row" alignItems="center">
                  <ListItemText sx={{ mr: 3 }} secondary={i + 1} />
                  <Stack direction="row" alignItems="center">
                    <IconButton onClick={() => promoteItem(song)}>
                      <KeyboardArrowUpIcon />
                    </IconButton>
                    <IconButton onClick={() => demoteItem(song)}>
                      <KeyboardArrowDownIcon />
                    </IconButton>
                  </Stack>
                  <Stack direction="column">
                    <ListItemText primary={song.name ?? "(no name)"} />
                    <ListItemText secondary={song.artist ?? "(no artist)"} />
                  </Stack>
                </Stack>
              </ListItem>
            ))}
          </List>
        ) : null}
      </Card>
    </Stack>
  );
}
