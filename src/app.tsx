import { Box, Stack } from "@mui/material";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SongList } from "./app/song-list";
import { AppThemeProvider } from "./theme";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SongList />,
  },
]);

export default function App() {
  return (
    <AppThemeProvider>
      <Stack
        sx={{ width: "100%", background: "#eee" }}
        direction="column"
        alignItems="center"
      >
        <Box sx={{ width: "50%" }}>
          <RouterProvider router={router} />
        </Box>
      </Stack>
    </AppThemeProvider>
  );
}
