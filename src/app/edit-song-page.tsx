import { Button, Card, Stack, Typography } from "@mui/material";
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSongs } from "../use-songs";

export function EditSongPage() {
  const { getSongById } = useSongs();

  const { songId } = useParams();

  const song = useMemo(() => {
    if (!songId) {
      return null;
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
      >
        <Button variant="outlined" onClick={() => navigate("/")}>
          Home
        </Button>
      </Stack>
      <Card sx={{ width: "100%", px: 1, py: 1 }}>
        <Typography>{songId}</Typography>
        <Typography>{song?.name}</Typography>
        <Typography>{song?.artist}</Typography>
      </Card>
    </Stack>
  );
}
