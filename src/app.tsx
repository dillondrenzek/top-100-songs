import { Box, createTheme, ThemeProvider } from "@mui/material";
import React from "react";
import { SongList } from "./song-list/song-list";

const theme = createTheme({});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <SongList />
    </ThemeProvider>
  );
}
