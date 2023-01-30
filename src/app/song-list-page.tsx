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
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackwardIcon from "@mui/icons-material/ArrowBack";
import MoreIcon from "@mui/icons-material/MoreVert";
import CreateIcon from "@mui/icons-material/Create";
import React, { ReactNode, useEffect, useState } from "react";
import { NewSongForm } from "./song-list/new-song-form";
import { useNavigate } from "react-router-dom";
import { PlayCircleOutline } from "@mui/icons-material";
import { useLocalStorage } from "usehooks-ts";
import { LocalStorageKey } from "../lib/local-storage";
import { AppState, useAppState } from "../use-app-state";
import { ControlPanel } from "./control-panel";

function ActionsMenu(props: {
  /**
   * Should be <MenuItem>
   */
  children?: ReactNode;
}) {
  const { children } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreIcon fontSize="small" />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {children}
      </Menu>
    </>
  );
}

const IconButton = styled(MuiIconButton)(({ theme }) => ({
  padding: theme.spacing(0.25),
}));

export function SongListPage() {
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
          <Stack spacing={3} direction="row" sx={{}}>
            <Card sx={{ px: 3, py: 2 }}>
              <NewSongForm
                allSongs={top.songs}
                onSubmit={(newSong) => createSongInList(newSong, "topSongs")}
              />
            </Card>
            <Card sx={{ px: 3, py: 2 }}>
              <TextField
                size="small"
                label="# of Max Top Songs"
                value={state.maxTopSongs}
                onChange={(ev) => setMaxTopSongs(parseInt(ev.target.value))}
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
                {top.songs.length}/{state.maxTopSongs} songs
              </Typography>
            </Stack>
            {top.songs.length ? (
              <List>
                {top.songs.map((song, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      backgroundColor: i < state.maxTopSongs ? "#fff" : "#f70",
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{ flex: "1 0 auto" }}
                    >
                      <ListItemText
                        sx={{
                          pr: 1.5,
                          mr: 1.5,
                          width: "15px",
                          textAlign: "center",
                          borderRight: "1px solid #aaa",
                          flex: "0 1 auto",
                        }}
                        secondary={i + 1}
                      />
                      <Stack direction="row" alignItems="center" sx={{ mx: 3 }}>
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
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                        sx={{ flex: "1 0 auto" }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          {/* Play Button */}
                          <IconButton
                            disabled={!song.spotifyId}
                            onClick={() =>
                              setPlayerSpotifyId(song?.spotifyId ?? "")
                            }
                          >
                            <PlayCircleOutline />
                          </IconButton>
                          <ListItemText primary={song.name} />
                          <ListItemText secondary={song.artist} />
                        </Stack>
                        <ActionsMenu>
                          {/* Edit */}
                          <MenuItem
                            onClick={() => navigate(`/songs/${song.id}`)}
                          >
                            <ListItemIcon>
                              <CreateIcon />
                            </ListItemIcon>
                            <ListItemText>Edit</ListItemText>
                          </MenuItem>
                          {/* Move To Bubble */}
                          <MenuItem
                            onClick={() =>
                              moveSongFromList(song, "topSongs", "bubble")
                            }
                          >
                            <ListItemIcon>
                              <ArrowForwardIcon />
                            </ListItemIcon>
                            <ListItemText>Move to Bubble</ListItemText>
                          </MenuItem>
                          {/* Delete */}
                          <MenuItem onClick={() => top.removeSong(song)}>
                            <ListItemIcon>
                              <DeleteForeverIcon />
                            </ListItemIcon>
                            <ListItemText>Delete</ListItemText>
                          </MenuItem>
                        </ActionsMenu>
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