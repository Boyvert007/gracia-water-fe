import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#267BE4",
      light: "rgba(25,118,210,0.08)",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  components: {
    // MuiButton: {
    //   variants: [
    //     {
    //       props: { variant: "contained" },
    //       style: {
    //         background: "#267BE4",
    //       },
    //     },
    //     {
    //       props: { variant: "outlined" },
    //       style: {
    //         color: "#267BE4",
    //         borderColor: "#267BE4",
    //       },
    //     },
    //   ],
    // },
  },
});

export default theme;
