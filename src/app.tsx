import { Box, Stack } from "@mui/material";
import React from "react";
import { SongList } from "./song-list/song-list";
import { AppThemeProvider } from "./theme";

export default function App() {
  return (
    <AppThemeProvider>
      <Stack
        sx={{ width: "100%", background: "error.main" }}
        direction="column"
        alignItems="center"
      >
        <Box sx={{ width: "50%" }}>
          <SongList />
        </Box>
      </Stack>
    </AppThemeProvider>
  );
}
