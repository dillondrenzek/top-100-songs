import {
  Stack,
  Button,
  TextField,
  Autocomplete,
  AutocompleteProps,
} from "@mui/material";
import { FormikHelpers } from "formik";
import React, { useCallback, useMemo } from "react";
import { useNewSongForm } from "../../use-new-song-form";
import { NewSong, Song } from "../../song";

type SongFreeSoloAutocompleteProps = AutocompleteProps<
  string,
  false,
  false,
  true
>;

type SongAutocompleteProps = {
  name: string;
  label: string;
  allSongs: Song[];
  getValue: (song: Song) => string;
} & Omit<SongFreeSoloAutocompleteProps, "options" | "renderInput">;

function SongAutocomplete(props: SongAutocompleteProps) {
  const { label, allSongs, name, getValue, ...passthrough } = props;
  const options = useMemo<string[]>(() => {
    return allSongs.map(getValue);
  }, [allSongs, getValue]);

  return (
    <Autocomplete
      {...passthrough}
      freeSolo
      options={options}
      renderInput={(params) => (
        <TextField {...params} name={name} label={label} />
      )}
    />
  );
}

interface NewSongFormProps {
  allSongs: Song[];
  onSubmit: (newSong: NewSong) => void;
}

export function NewSongForm(props: NewSongFormProps) {
  const { onSubmit: propsOnSubmit, allSongs } = props;

  const onSubmit = useCallback(
    (newSong: NewSong, formikHelpers: FormikHelpers<NewSong>) => {
      propsOnSubmit(newSong);

      formikHelpers.resetForm();
    },
    [propsOnSubmit]
  );

  const { handleSubmit, handleChange, handleBlur, values } = useNewSongForm({
    initialValues: {
      name: "",
      artist: "",
    },
    onSubmit,
  });

  return (
    <Stack
      sx={{ width: "100%" }}
      direction="row"
      spacing={2}
      component="form"
      onSubmit={handleSubmit}
    >
      <Stack direction="row" spacing={2} sx={{ flex: "1 1 auto" }}>
        <SongAutocomplete
          sx={{ flex: "1 1 auto" }}
          name="name"
          label="Name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          allSongs={allSongs}
          getValue={(song) => song.name}
        />
        <SongAutocomplete
          sx={{ flex: "1 1 auto" }}
          name="artist"
          label="Artist"
          value={values.artist}
          onChange={handleChange}
          onBlur={handleBlur}
          allSongs={allSongs}
          getValue={(song) => song.artist}
        />
      </Stack>
      <Button type="submit" variant="outlined">
        Add
      </Button>
    </Stack>
  );
}
