import { TextField, Autocomplete, AutocompleteProps } from "@mui/material";
import React, { useMemo } from "react";
import { Song } from "../../../song";

type SongFreeSoloAutocompleteProps = AutocompleteProps<
  string,
  false,
  false,
  true
>;

export type SongAutocompleteProps = {
  name: string;
  label: string;
  allSongs: Song[];
  getValue: (song: Song) => string;
} & Omit<SongFreeSoloAutocompleteProps, "options" | "renderInput">;

export function SongAutocomplete(props: SongAutocompleteProps) {
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
