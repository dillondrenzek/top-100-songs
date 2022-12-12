import {
  Box,
  createTheme,
  Stack,
  ThemeProvider,
  ThemeOptions,
} from "@mui/material";
import React from "react";
import { SongList } from "./song-list/song-list";

// import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";

export const themeOptions: Partial<ThemeOptions> = {
  palette: {
    primary: {
      main: "#5186b1",
      dark: "#1e7498",
      light: "#97c0dc",
    },
    secondary: {
      main: "#d87c4a",
    },
    background: {
      default: "#f1f1f1",
    },
    success: {
      main: "#7cb342",
    },
    info: {
      main: "#90caf9",
    },
  },
};

const theme = createTheme(themeOptions);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Stack
        sx={{ width: "100%", background: "error.main" }}
        direction="column"
        alignItems="center"
      >
        <Box sx={{ width: "50%" }}>
          <SongList />
        </Box>
      </Stack>
    </ThemeProvider>
  );
}
