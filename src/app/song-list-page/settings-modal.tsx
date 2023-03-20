import {
  Stack,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import React from 'react';
import { AppState } from '../../use-app-state';
import { useFormik } from 'formik';

export interface ListSettings {
  maxTopSongs: AppState['maxTopSongs'];
}

type ListSettingsForm = ListSettings;

export function SettingsModal(props: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ListSettings) => void;
  state: AppState;
}) {
  const { onClose, onSubmit, open, state } = props;

  const { values, handleSubmit, handleChange } = useFormik<ListSettingsForm>({
    initialValues: {
      maxTopSongs: state.maxTopSongs,
    },
    onSubmit,
  });

  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={onClose}>
      <DialogTitle variant='h2'>Settings</DialogTitle>
      <Box component='form' onSubmit={handleSubmit}>
        <DialogContent>
          <Stack direction='column' spacing={1} sx={{ my: 1 }}>
            <TextField
              name='maxTopSongs'
              size='small'
              label='# of Max Top Songs'
              value={values.maxTopSongs}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            color='secondary'
            variant='text'
            size='large'
            onClick={() => onClose()}
            sx={{ minWidth: '140px' }}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            color='primary'
            variant='contained'
            size='large'
            sx={{ minWidth: '140px' }}
          >
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
