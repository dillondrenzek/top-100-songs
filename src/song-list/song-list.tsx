import {
  Card,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Box,
  IconButton,
  Icon,
  Button,
  TextField,
} from "@mui/material";
import { FormikHelpers } from "formik";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useState, useEffect, useCallback } from "react";
import { useNewSongForm } from "../use-new-song-form";
import { NewSong, Song, SortSongs, createSong } from "../song";

function useSongList() {
  const [items, setItems] = useState<Song[]>([
    { name: "Song Name A", artist: "Artist Name", count: 0 },
    { name: "Song Name B", artist: "Artist Name", count: 0 },
    { name: "Song Name C", artist: "Artist Name", count: 0 },
    { name: "Song Name D", artist: "Artist Name", count: 0 },
    { name: "Song Name E", artist: "Artist Name", count: 0 },
  ]);

  const increaseSongCount = useCallback(
    (song: Song) => {
      const newItems = [
        ...items.filter((item) => item !== song),
        { ...song, count: song.count + 1 },
      ].sort(SortSongs.descending);

      setItems(newItems);
    },
    [items]
  );

  const decreaseSongCount = useCallback(
    (song: Song) => {
      const newItems = [
        ...items.filter((item) => item !== song),
        { ...song, count: song.count - 1 },
      ].sort(SortSongs.descending);

      setItems(newItems);
    },
    [items]
  );

  const createSongCallback = useCallback(
    (song: NewSong) => {
      const newItems = [createSong(song), ...items].sort(SortSongs.descending);

      setItems(newItems);
    },
    [items]
  );

  return {
    songs: items,
    increaseSongCount,
    decreaseSongCount,
    createSong: createSongCallback,
  };
}

export function SongList() {
  const { songs, increaseSongCount, decreaseSongCount, createSong } =
    useSongList();

  const onSubmit = useCallback(
    (newSong: NewSong, formikHelpers: FormikHelpers<NewSong>) => {
      createSong(newSong);

      formikHelpers.resetForm();
    },
    [createSong]
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
        {songs.length ? (
          <List>
            {songs.map((song, i) => (
              <ListItem key={i}>
                <Stack direction="row" alignItems="center">
                  <ListItemText sx={{ mr: 3 }} secondary={i + 1} />
                  <Stack direction="row" alignItems="center">
                    <IconButton onClick={() => increaseSongCount(song)}>
                      <KeyboardArrowUpIcon />
                    </IconButton>
                    <ListItemText primary={song.count} />
                    <IconButton onClick={() => decreaseSongCount(song)}>
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
