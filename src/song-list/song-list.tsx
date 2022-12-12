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
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useState, useEffect, useCallback } from "react";

const SortSongs = {
  descending(a: Song, b: Song): number {
    return b.count - a.count;
  },
};

interface Song {
  count: number;
  artist: string;
  name: string;
}

type NewSong = Pick<Song, "name">;

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

  const createSong = useCallback(
    (song: NewSong) => {
      const newSong: Song = {
        count: 0,
        artist: "",
        ...song,
      };
      const newItems = [newSong, ...items].sort(SortSongs.descending);

      setItems(newItems);
    },
    [items]
  );

  return {
    songs: items,
    increaseSongCount,
    decreaseSongCount,
    createSong,
  };
}

export function SongList() {
  const { songs, increaseSongCount, decreaseSongCount, createSong } =
    useSongList();

  const handleNewSong = useCallback(() => {
    createSong({
      name: "New Song",
    });
  }, [createSong]);

  return songs.length ? (
    <Card sx={{ width: "100%" }}>
      <Button variant="outlined" onClick={handleNewSong}>
        New
      </Button>
      <List>
        {songs.map((song, i) => (
          <ListItem key={i}>
            <Stack direction="row" alignItems="center">
              <Stack direction="row" alignItems="center">
                <IconButton onClick={() => increaseSongCount(song)}>
                  <KeyboardArrowUpIcon />
                </IconButton>
                <ListItemText primary={song.count} />
                <IconButton onClick={() => decreaseSongCount(song)}>
                  <KeyboardArrowDownIcon />
                </IconButton>
              </Stack>
              <ListItemText primary={`${song.name} - ${song.artist}`} />
            </Stack>
          </ListItem>
        ))}
      </List>
    </Card>
  ) : null;
}
