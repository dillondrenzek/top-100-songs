import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import React from "react";
import { SongList } from "./song-list/song-list";

const theme = createTheme({});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Stack sx={{ width: "100%" }} direction="column" alignItems="center">
        <Box sx={{ width: "50%" }}>
          <SongList />
        </Box>
      </Stack>
    </ThemeProvider>
  );
}
