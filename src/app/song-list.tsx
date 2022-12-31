import {
  Card,
  List,
  ListItem,
  ListItemText,
  Stack,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CreateIcon from "@mui/icons-material/Create";
import React from "react";
import { useSongs } from "../use-songs";
import { NewSongForm } from "./song-list/new-song-form";
import { useNavigate } from "react-router-dom";

export function SongList() {
  const {
    songs,
    createSong,
    removeSong,
    promoteSong,
    demoteSong,
    moveSongToBottom,
    moveSongToTop,
    printState,
  } = useSongs();

  const navigate = useNavigate();

  return (
    <Stack direction="column" alignItems="flex-start" spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <Card sx={{ px: 3, py: 2 }}>
          <NewSongForm onSubmit={createSong} />
        </Card>
        <Card sx={{}}>
          <Button variant="outlined" onClick={printState}>
            Print
          </Button>
        </Card>
        <Typography>{songs.length} songs</Typography>
      </Stack>
      <Card sx={{ width: "100%", px: 1, py: 1 }}>
        {songs.length ? (
          <List>
            {songs.map((song, i) => (
              <ListItem key={i}>
                <Stack direction="row" alignItems="center">
                  <ListItemText sx={{ mr: 3 }} secondary={i + 1} />
                  <Stack direction="row" alignItems="center">
                    <IconButton onClick={() => moveSongToTop(song)}>
                      <VerticalAlignTopIcon />
                    </IconButton>
                    <IconButton onClick={() => promoteSong(song)}>
                      <KeyboardArrowUpIcon />
                    </IconButton>
                    <IconButton onClick={() => demoteSong(song)}>
                      <KeyboardArrowDownIcon />
                    </IconButton>
                    <IconButton onClick={() => moveSongToBottom(song)}>
                      <VerticalAlignBottomIcon />
                    </IconButton>
                    <IconButton onClick={() => removeSong(song)}>
                      <DeleteForeverIcon />
                    </IconButton>
                    <IconButton onClick={() => navigate(`/songs/${song.id}`)}>
                      <CreateIcon />
                    </IconButton>
                  </Stack>
                  <Stack direction="column">
                    <ListItemText primary={song.name} />
                    <ListItemText secondary={song.artist} />
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
