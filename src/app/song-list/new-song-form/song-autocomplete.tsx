import { Autocomplete, AutocompleteProps } from '@mui/material';
import React from 'react';
import { Song } from '../../../song';

export type SongFreeSoloAutocompleteProps = AutocompleteProps<
  string | Song,
  false,
  false,
  true
>;

export type SongAutocompleteProps = SongFreeSoloAutocompleteProps;

export function SongAutocomplete(props: SongAutocompleteProps) {
  return <Autocomplete freeSolo {...props} />;
}
