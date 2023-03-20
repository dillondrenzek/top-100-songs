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
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackwardIcon from '@mui/icons-material/ArrowBack';
import MoreIcon from '@mui/icons-material/MoreVert';
import CreateIcon from '@mui/icons-material/Create';
import React, { ReactNode, useCallback, useState } from 'react';
import { NewSongForm } from './song-list/new-song-form';
import { useNavigate } from 'react-router-dom';
import { PlayCircleOutline } from '@mui/icons-material';
import { useAppState } from '../use-app-state';
import { ControlPanel } from './control-panel';
import { Song } from '../song';
import { ListSettings } from './song-list-page/settings-modal';

function ActionsMenuItem(props: {
  onClick?: React.MouseEventHandler<HTMLLIElement>;
  icon?: React.ReactNode;
  text?: React.ReactNode;
}) {
  const { icon, onClick, text } = props;
  return (
    <MenuItem onClick={(ev) => onClick?.(ev)}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  );
}

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
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreIcon fontSize='small' />
      </IconButton>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {children}
      </Menu>
    </>
  );
}

function SongListItem(props: {
  actions: React.ReactNode;
  song: Song;
  iconButtons: React.ReactNode;
  rank: number;
  onPlayClick: (spotifyId: string) => void;
}) {
  const { actions, song, iconButtons, rank, onPlayClick } = props;

  return (
    <ListItem>
      <Stack direction='row' alignItems='center' sx={{ flex: '1 0 auto' }}>
        <ListItemText
          sx={{
            pr: 1.5,
            mr: 1.5,
            width: '15px',
            textAlign: 'center',
            borderRight: '1px solid #aaa',
            flex: '0 1 auto',
          }}
          secondary={rank}
        />
        <Stack direction='row' alignItems='center' sx={{ mx: 3 }}>
          {iconButtons}
        </Stack>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          spacing={1}
          sx={{ flex: '1 0 auto' }}
        >
          <Stack direction='row' spacing={2} alignItems='center'>
            {/* Play Button */}
            <IconButton
              disabled={!song.spotifyId}
              onClick={() => onPlayClick?.(song?.spotifyId ?? '')}
            >
              <PlayCircleOutline />
            </IconButton>
            <ListItemText primary={song.name} />
            <ListItemText secondary={song.artist} />
          </Stack>
          {actions}
        </Stack>
      </Stack>
    </ListItem>
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

  const {
    state,
    topSongs: top,
    bubble,
    createSongInList,
    moveSongFromList,
    setMaxTopSongs,
  } = useAppState();

  // How far we've come - https://open.spotify.com/track/0gbLfFlEyVHiKzlZIb0gce?si=85ef49997bfc4070
  // Chariot - https://open.spotify.com/track/08kTO4EW0jb07zNsCNM83w?si=860c8155a8e4405c

  const [playerSpotifyId, setPlayerSpotifyId] = useState(
    '2H30WL3exSctlDC9GyRbD4'
  );

  //
  // Settings Modal

  const handleSettingsModalSubmit = useCallback(
    (values: ListSettings) => {
      setMaxTopSongs(values.maxTopSongs);
    },
    [setMaxTopSongs]
  );

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          height: '100vh',
          width: '100vw',
          zIndex: 100,
          pointerEvents: 'none',
        }}
      >
        <Card
          sx={{
            px: 1,
            py: 1,
            position: 'absolute',
            bottom: '0',
            right: '0',
          }}
        >
          <ControlPanel state={state} onSubmit={handleSettingsModalSubmit} />
        </Card>
        <Card
          sx={{
            display: 'flex',
            position: 'absolute',
            bottom: 0,
            right: '200px',
            borderRadius: 3,
          }}
        >
          <iframe
            title='Spotify Player'
            src={`https://open.spotify.com/embed/track/${playerSpotifyId}`}
            width='100%'
            height='80'
            frameBorder='0'
            allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
            loading='lazy'
          ></iframe>
        </Card>
      </Box>
      <Stack
        direction='row'
        alignItems='flex-start'
        spacing={2}
        paddingX={2}
        sx={{ height: '100vh', width: '100%', position: 'fixed' }}
      >
        <Stack
          direction='column'
          alignItems='stretch'
          spacing={2}
          sx={{
            height: '100%',
            width: '50%',
            maxWidth: '1200px',
          }}
        >
          <Stack
            spacing={3}
            direction='row'
            sx={{ alignItems: 'center', flex: '0 0 auto' }}
          >
            <Typography variant='h4'>Main</Typography>
            <Card sx={{ px: 3, py: 2, flex: '1 0 auto' }}>
              <NewSongForm
                allSongs={top.songs}
                onSubmit={(newSong) => createSongInList(newSong, 'topSongs')}
              />
            </Card>
          </Stack>
          <Box sx={{ flex: '1 1 auto', overflow: 'auto' }}>
            <Card sx={{ px: 1, py: 1 }}>
              <Stack
                spacing={2}
                direction='row'
                sx={{ alignItems: 'center', justifyContent: 'center' }}
              >
                <Typography textAlign='center' variant='subtitle2'>
                  {top.songs.length}/{state.maxTopSongs} songs
                </Typography>
              </Stack>
              {top.songs.length ? (
                <List>
                  {top.songs.map((song, i) => (
                    <SongListItem
                      rank={i + 1}
                      song={song}
                      onPlayClick={(spotifyId) => setPlayerSpotifyId(spotifyId)}
                      iconButtons={
                        <>
                          <IconButton onClick={() => top.moveSongToTop(song)}>
                            <VerticalAlignTopIcon />
                          </IconButton>
                          <IconButton onClick={() => top.promoteSong(song)}>
                            <KeyboardArrowUpIcon />
                          </IconButton>
                          <IconButton onClick={() => top.demoteSong(song)}>
                            <KeyboardArrowDownIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => top.moveSongToBottom(song)}
                          >
                            <VerticalAlignBottomIcon />
                          </IconButton>
                        </>
                      }
                      actions={
                        <ActionsMenu>
                          {/* Edit */}
                          <ActionsMenuItem
                            icon={<CreateIcon />}
                            onClick={() => navigate(`/songs/${song.id}`)}
                            text={'Edit'}
                          />
                          {/* Move To Bubble */}
                          <ActionsMenuItem
                            icon={<ArrowForwardIcon />}
                            onClick={() =>
                              moveSongFromList(song, 'topSongs', 'bubble')
                            }
                            text={'Move to Bubble'}
                          />
                          {/* Delete */}
                          <ActionsMenuItem
                            icon={<DeleteForeverIcon />}
                            onClick={() => top.removeSong(song)}
                            text={'Delete'}
                          />
                        </ActionsMenu>
                      }
                    />
                  ))}
                </List>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '250px',
                    backgroundColor: '#eaeaea',
                  }}
                >
                  <Typography>No List</Typography>
                </Box>
              )}
            </Card>
          </Box>
        </Stack>
        <Stack
          direction='column'
          spacing={2}
          marginY={2}
          sx={{
            height: '100%',
            overflow: 'auto',
            width: '50%',
            maxWidth: '1200px',
          }}
        >
          <Stack spacing={3} direction='row' sx={{ alignItems: 'center' }}>
            <Typography variant='h4'>Bubble</Typography>
            <Card sx={{ px: 3, py: 2, flex: '1 0 auto' }}>
              <NewSongForm
                allSongs={bubble.songs}
                onSubmit={(newSong) => createSongInList(newSong, 'bubble')}
              />
            </Card>
          </Stack>
          <Box sx={{ flex: '1 0 auto', overflow: 'auto' }}>
            <Card sx={{ px: 1, py: 1 }}>
              <Typography textAlign='center' variant='subtitle2'>
                {bubble.songs.length} songs
              </Typography>
              {bubble.songs.length ? (
                <List>
                  {bubble.songs.map((song, i) => (
                    <SongListItem
                      rank={i + 1}
                      song={song}
                      onPlayClick={(spotifyId) => setPlayerSpotifyId(spotifyId)}
                      iconButtons={
                        <>
                          <IconButton
                            onClick={() => bubble.moveSongToTop(song)}
                          >
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
                        </>
                      }
                      actions={
                        <ActionsMenu>
                          {/* Edit */}
                          <ActionsMenuItem
                            icon={<CreateIcon />}
                            onClick={() => navigate(`/songs/${song.id}`)}
                            text={'Edit'}
                          />
                          {/* Move To Main */}
                          <ActionsMenuItem
                            icon={<ArrowBackwardIcon />}
                            onClick={() =>
                              moveSongFromList(song, 'bubble', 'topSongs')
                            }
                            text={'Move to Main'}
                          />
                          {/* Delete */}
                          <ActionsMenuItem
                            icon={<DeleteForeverIcon />}
                            onClick={() => bubble.removeSong(song)}
                            text={'Delete'}
                          />
                        </ActionsMenu>
                      }
                    />
                  ))}
                </List>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '250px',
                    backgroundColor: '#eaeaea',
                  }}
                >
                  <Typography>No List</Typography>
                </Box>
              )}
            </Card>
          </Box>
        </Stack>
      </Stack>
    </>
  );
}
