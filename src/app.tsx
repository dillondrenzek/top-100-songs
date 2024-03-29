import { Stack } from "@mui/material";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { EditSongPage } from "./app/edit-song-page";
import { SongListPage } from "./app/song-list-page";
import { AppThemeProvider } from "./theme";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SongListPage />,
  },
  {
    path: "/songs/:songId",
    element: <EditSongPage />,
  },
]);

export default function App() {
  return (
    <AppThemeProvider>
      <Stack sx={{ width: "100%" }} direction="column">
        <RouterProvider router={router} />
      </Stack>
    </AppThemeProvider>
  );
}
