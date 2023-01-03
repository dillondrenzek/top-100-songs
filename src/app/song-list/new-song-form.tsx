import { Stack, Button } from "@mui/material";
import { FormikHelpers, useFormik } from "formik";
import React, { useCallback } from "react";
import { NewSong, Song } from "../../song";
import { SongAutocomplete } from "./new-song-form/song-autocomplete";

type NewSongFormModel = NewSong;

interface NewSongFormProps {
  allSongs: Song[];

  onSelectSong: (song: Song) => void;

  onSubmitSong: (newSong: NewSong) => void;

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

  const formik = useFormik<NewSongFormModel>({
    initialValues: {
      name: "",
      artist: "",
    },
    onSubmit,
  });

  const { handleSubmit, handleChange, handleBlur, values } = formik;

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
