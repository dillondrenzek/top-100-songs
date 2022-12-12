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
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useState, useEffect, useCallback } from "react";

interface Song {
  label: string;
  count: number;
}

function useSongList() {
  const [items, setItems] = useState<Song[]>([]);
  const shouldFetchItems = items && items.length;

  useEffect(() => {
    console.log("items:", items);
    setItems([
      { label: "A", count: 0 },
      { label: "B", count: 0 },
      { label: "C", count: 0 },
    ]);
  }, [shouldFetchItems]);

  const increaseSongCount = useCallback(
    (song: Song) => {
      const newItems = [
        ...items.filter((item) => item !== song),
        { ...song, count: song.count + 1 },
      ].sort((a, b) => {
        return b.count - a.count;
      });

      setItems(newItems);
    },
    [items]
  );

  return {
    songs: items,
    increaseSongCount,
  };
}

export function SongList() {
  const { songs, increaseSongCount } = useSongList();

  return songs.length ? (
    <Card sx={{ width: "100%" }}>
      <List>
        {songs.map((song, i) => (
          <ListItem key={i}>
            <Stack direction="row" alignItems="center">
              <Stack direction="row" alignItems="center">
                <IconButton onClick={() => increaseSongCount(song)}>
                  <KeyboardArrowUpIcon />
                </IconButton>
                <ListItemText primary={song.count} />
                <IconButton onClick={() => null}>
                  <KeyboardArrowDownIcon />
                </IconButton>
              </Stack>
              <ListItemText primary={song.label} />
            </Stack>
          </ListItem>
        ))}
      </List>
    </Card>
  ) : null;
}
