import React, { PropsWithChildren } from "react";
import { createTheme, ThemeOptions, ThemeProvider } from "@mui/material";

// Fonts
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

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

export const theme = createTheme(themeOptions);

export function AppThemeProvider(props: PropsWithChildren) {
  const { children } = props;
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
