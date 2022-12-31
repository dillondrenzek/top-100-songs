import { Button, Card, Stack } from "@mui/material";
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSongs } from "../use-songs";
import { EditSongForm } from "./edit-song-page/edit-song-form";

export function EditSongPage() {
  const { getSongById, updateSong } = useSongs();

  const { songId } = useParams();

  const song = useMemo(() => {
    if (!songId) {
      return;
    }

    const id = parseInt(songId);

    return getSongById(id);
  }, [getSongById, songId]);

  const navigate = useNavigate();

  return (
    <Stack direction="column" alignItems="flex-start" spacing={2}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      ></Stack>
      <Card sx={{ width: "100%", px: 1, py: 1 }}>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Home
        </Button>
      </Card>
      <Card sx={{ width: "100%", px: 1, py: 1 }}>
        <EditSongForm initialValue={song} onSubmit={updateSong} />
      </Card>
    </Stack>
  );
}
