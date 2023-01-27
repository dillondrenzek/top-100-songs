import {
  Stack,
  Button,
  Autocomplete,
  TextField,
  UseAutocompleteProps,
} from "@mui/material";
import { FormikHelpers, useFormik } from "formik";
import React, { useCallback } from "react";
import { NewSong, Song } from "../../song";
import { SongAutocomplete } from "./new-song-form/song-autocomplete";

const DEBUG = true;

function newSongFromUserInput(input: string): NewSong {
  if (!input) {
    return {
      artist: "",
      name: "",
    };
  }

  const splitSong = input.split("-");
  if (splitSong.length === 2) {
    return {
      artist: splitSong[1],
      name: splitSong[0],
    };
  }

  return {
    artist: "",
    name: splitSong[0],
  };
}

type NewSongFormModel = {
  userInput: string;
} & Partial<NewSong>;

interface NewSongFormProps {
  allSongs: Song[];

  onSelectSong?: (song: Song) => void;

  onSubmitSong?: (newSong: NewSong) => void;

  onSubmit: (newSong: NewSong) => void;
}

export function NewSongForm(props: NewSongFormProps) {
  const { onSubmit: propsOnSubmit, allSongs } = props;

  const onSubmit = useCallback(
    (
      newSong: NewSongFormModel,
      formikHelpers: FormikHelpers<NewSongFormModel>
    ) => {
      propsOnSubmit(newSongFromUserInput(newSong.userInput));

      formikHelpers.resetForm();
    },
    [propsOnSubmit]
  );

  const formik = useFormik<NewSongFormModel>({
    initialValues: {
      name: "",
      artist: "",
      userInput: "",
    },
    onSubmit,
  });

  const { handleSubmit, handleChange, handleBlur, values } = formik;

  return (
    <Stack
      sx={{ width: "600px" }}
      direction="row"
      spacing={2}
      component="form"
      onSubmit={handleSubmit}
    >
      <Stack direction="row" spacing={2} sx={{ flex: "1 1 auto" }}>
        <SongAutocomplete
          sx={{ flex: "1 1 auto" }}
          options={allSongs}
          renderInput={(params) => <TextField name="userInput" {...params} />}
          onChange={(ev, val, reason) => {
            if (DEBUG) {
              console.log("[EV]", "Change -", reason, "-", val);
            }
            if (reason === "selectOption") {
            }
            // handleChange
          }}
          onInputChange={(ev, val, reason) => {
            if (DEBUG) {
              console.log("[EV]", "Input Change -", reason, "-", val);
            }
            handleChange(ev);
          }}
          getOptionLabel={(option) =>
            typeof option === "string"
              ? option
              : `${option.name} - ${option.artist}`
          }
        />
      </Stack>
      <Button type="submit" variant="outlined">
        Add
      </Button>
    </Stack>
  );
}
