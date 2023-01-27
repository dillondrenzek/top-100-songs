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
import React, { useCallback, useState } from "react";
import { useSongs } from "../use-songs";
import { NewSongForm } from "./song-list/new-song-form";
import { useNavigate } from "react-router-dom";
import { PlayCircleOutline } from "@mui/icons-material";
import { useCopyToClipboard } from "usehooks-ts";

export function SongList() {
  const {
    songs,
    state,
    createSong,
    removeSong,
    promoteSong,
    demoteSong,
    moveSongToBottom,
    moveSongToTop,
    printState,
  } = useSongs();

  const navigate = useNavigate();

  const [copiedValue, copyValue] = useCopyToClipboard();

  // How far we've come - https://open.spotify.com/track/0gbLfFlEyVHiKzlZIb0gce?si=85ef49997bfc4070
  // Chariot - https://open.spotify.com/track/08kTO4EW0jb07zNsCNM83w?si=860c8155a8e4405c

  const [playerSpotifyId, setPlayerSpotifyId] = useState(
    "2H30WL3exSctlDC9GyRbD4"
  );

  const [isCopied, setIsCopied] = useState(false);

  const handleClickCopy = useCallback(() => {
    copyValue(JSON.stringify(state));
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 10000);
  }, [copyValue, state]);

  return (
    <Stack direction="column" alignItems="center" spacing={2} marginY={2}>
      <Card
        sx={{
          display: "flex",
          position: "absolute",
          top: 0,
          right: 0,
          borderRadius: 3,
        }}
      >
        <iframe
          title="Spotify Player"
          src={`https://open.spotify.com/embed/track/${playerSpotifyId}`}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </Card>
      <Stack
        spacing={3}
        direction="row"
        sx={{ justifyContent: { xs: "stretch" } }}
      >
        <Card sx={{ px: 3, py: 2, position: "absolute", top: "0", left: "0" }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button variant="outlined" onClick={printState}>
              Print to Console
            </Button>
            <Button
              variant="outlined"
              color={isCopied ? "success" : "primary"}
              onClick={handleClickCopy}
            >
              {isCopied ? "Copied!" : "Copy State"}
            </Button>
          </Stack>
        </Card>
        <Card sx={{ px: 3, py: 2 }}>
          <NewSongForm allSongs={songs} onSubmit={createSong} />
        </Card>
      </Stack>
      <Card sx={{ px: 1, py: 1 }}>
        <Typography textAlign="center" variant="subtitle2">
          {songs.length} songs
        </Typography>
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
                    <IconButton
                      disabled={!song.spotifyId}
                      onClick={() => setPlayerSpotifyId(song?.spotifyId ?? "")}
                    >
                      <PlayCircleOutline />
                    </IconButton>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="baseline">
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
