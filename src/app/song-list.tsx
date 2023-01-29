import {
  Card,
  List,
  ListItem,
  ListItemText,
  Stack,
  IconButton as MuiIconButton,
  Typography,
  Box,
  styled,
  TextField,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackwardIcon from "@mui/icons-material/ArrowBack";
import CreateIcon from "@mui/icons-material/Create";
import React, { useEffect, useState } from "react";
import { NewSongForm } from "./song-list/new-song-form";
import { useNavigate } from "react-router-dom";
import { PlayCircleOutline } from "@mui/icons-material";
import { useLocalStorage } from "usehooks-ts";
import { LocalStorageKey } from "../lib/local-storage";
import { AppState, useAppState } from "../use-app-state";
import { ControlPanel } from "./control-panel";

const IconButton = styled(MuiIconButton)(({ theme }) => ({
  padding: theme.spacing(0.25),
}));

export function SongList() {
  //
  // Router Nav

  const navigate = useNavigate();

  //
  // App State

  const [appStateStoredValue, setAppStateStoredValue] =
    useLocalStorage<AppState>(LocalStorageKey.AppState, {
      maxTopSongs: 10,
      bubble: [],
      topSongs: [],
      nextId: 1,
    });

  const appState = useAppState(appStateStoredValue);
  const {
    state,
    topSongs: top,
    bubble,
    createSongInList,
    moveSongFromList,
    setMaxTopSongs,
  } = appState;

  useEffect(() => {
    setAppStateStoredValue(state);
  }, [state, setAppStateStoredValue]);

  // How far we've come - https://open.spotify.com/track/0gbLfFlEyVHiKzlZIb0gce?si=85ef49997bfc4070
  // Chariot - https://open.spotify.com/track/08kTO4EW0jb07zNsCNM83w?si=860c8155a8e4405c

  const [playerSpotifyId, setPlayerSpotifyId] = useState(
    "2H30WL3exSctlDC9GyRbD4"
  );

  return (
    <>
      <Box sx={{ position: "fixed", height: "100vh", width: "100vw" }}>
        <Card
          sx={{
            px: 1,
            py: 1,
            position: "absolute",
            bottom: "0",
            right: "0",
          }}
        >
          <ControlPanel state={state} />
        </Card>
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
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </Card>
      </Box>
      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={2}
        marginY={2}
        paddingX={2}
      >
        <Stack
          direction="column"
          alignItems="stretch"
          spacing={2}
          sx={{ width: "50%", maxWidth: "1200px" }}
        >
          <Typography variant="h4">Main</Typography>
          <Stack
            spacing={3}
            direction="row"
            sx={{ justifyContent: { xs: "stretch" } }}
          >
            <Card sx={{ px: 3, py: 2 }}>
              <NewSongForm
                allSongs={top.songs}
                onSubmit={(newSong) => createSongInList(newSong, "topSongs")}
              />
            </Card>
          </Stack>
          <Card sx={{ px: 1, py: 1 }}>
            <Stack
              spacing={2}
              direction="row"
              sx={{ alignItems: "center", justifyContent: "center" }}
            >
              <Typography textAlign="center" variant="subtitle2">
                {top.songs.length} songs
              </Typography>
              <TextField
                size="small"
                label="# of Max Top Songs"
                value={state.maxTopSongs}
                onChange={(ev) => setMaxTopSongs(parseInt(ev.target.value))}
              />
            </Stack>
            {top.songs.length ? (
              <List>
                {top.songs.map((song, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      backgroundColor: i <= state.maxTopSongs ? "#fff" : "#f70",
                    }}
                  >
                    <Stack direction="row" alignItems="center">
                      <ListItemText
                        sx={{
                          pr: 1.5,
                          mr: 1.5,
                          width: "15px",
                          textAlign: "center",
                          borderRight: "1px solid #aaa",
                        }}
                        secondary={i + 1}
                      />
                      <Stack direction="row" alignItems="center" sx={{ mr: 3 }}>
                        <IconButton onClick={() => top.moveSongToTop(song)}>
                          <VerticalAlignTopIcon />
                        </IconButton>
                        <IconButton onClick={() => top.promoteSong(song)}>
                          <KeyboardArrowUpIcon />
                        </IconButton>
                        <IconButton onClick={() => top.demoteSong(song)}>
                          <KeyboardArrowDownIcon />
                        </IconButton>
                        <IconButton onClick={() => top.moveSongToBottom(song)}>
                          <VerticalAlignBottomIcon />
                        </IconButton>
                        <IconButton onClick={() => top.removeSong(song)}>
                          <DeleteForeverIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            moveSongFromList(song, "topSongs", "bubble")
                          }
                        >
                          <ArrowForwardIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => navigate(`/songs/${song.id}`)}
                        >
                          <CreateIcon />
                        </IconButton>
                        <IconButton
                          disabled={!song.spotifyId}
                          onClick={() =>
                            setPlayerSpotifyId(song?.spotifyId ?? "")
                          }
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
            ) : (
              <Typography>No List</Typography>
            )}
          </Card>
        </Stack>
        <Stack
          direction="column"
          spacing={2}
          marginY={2}
          sx={{ width: "50%", maxWidth: "1200px" }}
        >
          <Typography variant="h4">Bubble</Typography>
          <Stack
            spacing={3}
            direction="row"
            sx={{ justifyContent: { xs: "stretch" } }}
          >
            <Card sx={{ px: 3, py: 2 }}>
              <NewSongForm
                allSongs={bubble.songs}
                onSubmit={(newSong) => createSongInList(newSong, "bubble")}
              />
            </Card>
          </Stack>
          <Card sx={{ px: 1, py: 1 }}>
            <Typography textAlign="center" variant="subtitle2">
              {bubble.songs.length} songs
            </Typography>
            {bubble.songs.length ? (
              <List>
                {bubble.songs.map((song, i) => (
                  <ListItem key={i}>
                    <Stack direction="row" alignItems="center">
                      <ListItemText
                        sx={{
                          pr: 1.5,
                          mr: 1.5,
                          width: "15px",
                          textAlign: "center",
                          borderRight: "1px solid #aaa",
                        }}
                        secondary={i + 1}
                      />
                      <Stack direction="row" alignItems="center" sx={{ mr: 3 }}>
                        <IconButton onClick={() => bubble.moveSongToTop(song)}>
                          <VerticalAlignTopIcon />
                        </IconButton>
                        <IconButton onClick={() => bubble.promoteSong(song)}>
                          <KeyboardArrowUpIcon />
                        </IconButton>
                        <IconButton onClick={() => bubble.demoteSong(song)}>
                          <KeyboardArrowDownIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => bubble.moveSongToBottom(song)}
                        >
                          <VerticalAlignBottomIcon />
                        </IconButton>
                        <IconButton onClick={() => bubble.removeSong(song)}>
                          <DeleteForeverIcon />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            moveSongFromList(song, "bubble", "topSongs")
                          }
                        >
                          <ArrowBackwardIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => navigate(`/songs/${song.id}`)}
                        >
                          <CreateIcon />
                        </IconButton>
                        <IconButton
                          disabled={!song.spotifyId}
                          onClick={() =>
                            setPlayerSpotifyId(song?.spotifyId ?? "")
                          }
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
            ) : (
              <Typography>No List</Typography>
            )}
          </Card>
        </Stack>
      </Stack>
    </>
  );
}
