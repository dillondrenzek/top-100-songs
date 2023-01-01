import { Stack, Button, TextField } from "@mui/material";
import { FormikHelpers } from "formik";
import React, { useCallback } from "react";
import { Song } from "../../song";
import { useFormik, FormikConfig } from "formik";

export type EditSongFormModel = Song;

export function useEditSongForm(config: FormikConfig<EditSongFormModel>) {
  const formik = useFormik<EditSongFormModel>(config);

  return { ...formik };
}

interface EditSongFormProps {
  initialValue?: Song;

  onSubmit: (song: Song) => void;
}

export function EditSongForm(props: EditSongFormProps) {
  const { initialValue, onSubmit: propsOnSubmit } = props;

  const onSubmit = useCallback(
    (newSong: Song, formikHelpers: FormikHelpers<Song>) => {
      propsOnSubmit(newSong);

      formikHelpers.resetForm();
    },
    [propsOnSubmit]
  );

  const { handleSubmit, handleChange, handleBlur, values } = useEditSongForm({
    initialValues: initialValue ?? {
      name: "",
      artist: "",
      id: -1,
    },
    onSubmit,
  });

  return (
    <Stack
      direction="column"
      spacing={2}
      component="form"
      onSubmit={handleSubmit}
    >
      <TextField
        name="id"
        label="Id"
        variant="outlined"
        disabled
        value={values.id}
      />
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
      <TextField
        tabIndex={2}
        name="spotifyId"
        label="Spotify ID"
        variant="outlined"
        value={values.spotifyId}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <Button type="submit" variant="outlined">
        Save
      </Button>
    </Stack>
  );
}
