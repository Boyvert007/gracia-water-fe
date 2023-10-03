import React from "react";

import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useSelector } from "react-redux";

import lightTheme from "./light";

function ThemeConfig({ children }) {
  return (
    <MuiThemeProvider theme={lightTheme}>
      <CssBaseline />

      {children}
    </MuiThemeProvider>
  );
}

export { ThemeConfig };
