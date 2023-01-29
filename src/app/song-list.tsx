import {
  Card,
  List,
  ListItem,
  ListItemText,
  Stack,
  IconButton as MuiIconButton,
  Button,
  Typography,
  Box,
  styled,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CreateIcon from "@mui/icons-material/Create";
import React, { useCallback, useEffect, useState } from "react";
import { NewSongForm } from "./song-list/new-song-form";
import { useNavigate } from "react-router-dom";
import { PlayCircleOutline } from "@mui/icons-material";
import { useCopyToClipboard, useLocalStorage } from "usehooks-ts";
import { LocalStorageKey } from "../lib/local-storage";
import { AppState, useAppState } from "../use-app-state";

const IconButton = styled(MuiIconButton)(({ theme }) => ({
  padding: theme.spacing(0.25),
}));

export function SongList() {
  //
  // App State

  const [appStateStoredValue, setAppStateStoredValue] =
    useLocalStorage<AppState>(LocalStorageKey.AppState, {
      bubble: [],
      topSongs: [],
      nextId: 1,
    });

  const appState = useAppState(appStateStoredValue);
  const { topSongs: top, bubble, createSongInList, state } = appState;

  useEffect(() => {
    setAppStateStoredValue(state);
  }, [state, setAppStateStoredValue]);

  //
  // Router Nav

  const navigate = useNavigate();

  //
  // Copy to Clipboard

  const [, copyValue] = useCopyToClipboard();

  // How far we've come - https://open.spotify.com/track/0gbLfFlEyVHiKzlZIb0gce?si=85ef49997bfc4070
  // Chariot - https://open.spotify.com/track/08kTO4EW0jb07zNsCNM83w?si=860c8155a8e4405c

  const [playerSpotifyId, setPlayerSpotifyId] = useState(
    "2H30WL3exSctlDC9GyRbD4"
  );

  const [isCopied, setIsCopied] = useState(false);

  const handleClickCopy = useCallback(() => {
    copyValue(JSON.stringify(top.state));
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 10000);
  }, [copyValue, top.state]);

  const printState = useCallback(() => {
    console.log(state);
  }, [state]);

  return (
    <>
      <Box sx={{ position: "fixed", height: "100vh", width: "100vw" }}>
        <Card
          sx={{ px: 1, py: 1, position: "absolute", bottom: "0", left: "0" }}
        >
          <Stack direction="column" alignItems="stretch" spacing={1}>
            <Button variant="outlined" size="small" onClick={printState}>
              Print to Console
            </Button>
            <Button
              variant="outlined"
              size="small"
              color={isCopied ? "success" : "primary"}
              onClick={handleClickCopy}
            >
              {isCopied ? "Copied!" : "Copy State"}
            </Button>
          </Stack>
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
            <Typography textAlign="center" variant="subtitle2">
              {top.songs.length} songs
            </Typography>
            {top.songs.length ? (
              <List>
                {top.songs.map((song, i) => (
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
