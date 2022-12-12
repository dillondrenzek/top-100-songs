import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import React, { useState, useEffect } from "react";

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

  return {
    songs: items,
    increaseSongCount: (song: Song) => {
      const newItems = [
        ...items.filter((item) => item !== song),
        { ...song, count: song.count + 1 },
      ].sort((a, b) => {
        return b.count - a.count;
      });
      setItems(newItems);
    },
  };
}

export function SongList() {
  const { songs, increaseSongCount } = useSongList();

  return songs.length ? (
    <List>
      {songs.map((song, i) => (
        <ListItem disablePadding key={i}>
          <ListItemText primary={song.label} />
          <ListItemButton onClick={() => increaseSongCount(song)}>
            Up
          </ListItemButton>
          <ListItemText primary={song.count} />
          <ListItemButton onClick={() => null}>Down</ListItemButton>
        </ListItem>
      ))}
    </List>
  ) : null;
}
