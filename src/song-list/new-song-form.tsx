import { Stack, Button, TextField } from "@mui/material";
import { FormikHelpers } from "formik";
import React, { useCallback } from "react";
import { useNewSongForm } from "../use-new-song-form";
import { NewSong } from "../song";

interface NewSongFormProps {
  onSubmit: (newSong: NewSong) => void;
}

export function NewSongForm(props: NewSongFormProps) {
  const { onSubmit: propsOnSubmit } = props;

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
    <Stack direction="row" spacing={2} component="form" onSubmit={handleSubmit}>
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
    </Stack>
  );
}
