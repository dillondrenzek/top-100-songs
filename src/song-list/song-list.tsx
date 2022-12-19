import {
  Card,
  List,
  ListItem,
  ListItemText,
  Stack,
  IconButton,
  Button,
  TextField,
  ListItemTextProps,
} from "@mui/material";
import { FormikHelpers } from "formik";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import React, { useCallback, useState } from "react";
import { useNewSongForm } from "../use-new-song-form";
import { NewSong, Song } from "../song";
import { useSongs } from "../use-songs";

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
          <Button variant="outlined" onClick={printState}>
            Print
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
                  </Stack>
                  <SongListItemLabel song={song} />
                </Stack>
              </ListItem>
            ))}
          </List>
        ) : null}
      </Card>
    </Stack>
  );
}

type EditableListItemTextProps = {
  onChange: (value: string) => void;
} & ListItemTextProps;

function EditableListItemText(props: EditableListItemTextProps) {
  const { ...passthrough } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [fieldValue, setFieldValue] = useState("");

  // Input change handler
  const handleFieldValueChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  >((ev) => {
    setFieldValue(ev.target.value);
  }, []);

  // Input blur handler
  const handleFieldValueBlur = useCallback<
    React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
  >((ev) => {
    setIsEditing(false);
  }, []);

  // Start editing mode with a value
  const beginEdit = useCallback(
    (value: string) => {
      setFieldValue(value);
      setIsEditing(true);
    },
    [setIsEditing]
  );

  // Finish editing mode with the new value
  const finishEdit = useCallback((value: string) => {
    if (value != null) {
      setFieldValue(value);
    }
    setIsEditing(false);
  }, []);

  // Handle Form Submit
  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (ev) => {
      finishEdit(fieldValue);
    },
    [finishEdit, fieldValue]
  );

  const handleClickPrimary = useCallback<
    React.MouseEventHandler<HTMLDivElement>
  >(
    (ev) => {
      beginEdit(ev.currentTarget.innerText);
    },
    [beginEdit]
  );

  return isEditing ? (
    <Stack direction="row" component="form" onSubmit={handleSubmit}>
      <TextField
        name="name"
        variant="outlined"
        size="small"
        value={fieldValue}
        onChange={handleFieldValueChange}
        onBlur={handleFieldValueBlur}
      />
    </Stack>
  ) : (
    <ListItemText {...passthrough} onClick={handleClickPrimary} />
  );
}

// function useEditText() {}

interface SongListItemLabelProps {
  song: Song;
}

function SongListItemLabel(props: SongListItemLabelProps) {
  const { song } = props;
  return (
    <Stack direction="column">
      <EditableListItemText
        primary={song.name ?? "(no name)"}
        onChange={console.log}
      />
      <EditableListItemText
        secondary={song.artist ?? "(no artist)"}
        onChange={console.log}
      />
    </Stack>
  );
}
