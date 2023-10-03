import React, { useState, useEffect } from "react";
import Head from "next/head";

import { Box, styled } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import store from "../redux/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

import { getStorage, clearStorage } from "../utils/storage";
import { ThemeConfig } from "../themes";

import dayjs from "dayjs";
import idLocale from "dayjs/locale/id";

import "../styles/scrollbar.css";

dayjs().locale("id");

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  padding: 3,
  minHeight: "100vh",
  backgroundColor: "#F5F5F5;",
  flexGrow: 1,
  overflow: "hidden",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: (theme) => `-${theme.mixins.drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const MyApp = ({ Component, pageProps, router }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // useEffect(() => {
  //   if (getStorage("access_token")) {
  //     let date = new Date();
  //     if (Math.floor(date.getTime() / 1000) >= getStorage("expires_at")) {
  //       clearStorage();
  //       router.push("/login");
  //     }
  //   } else {
  //     clearStorage();
  //     router.push("/login");
  //   }
  // }, [pageProps, router]);

  return (
    mounted && (
      <>
        <Head>
          <meta
            name="viewport"
            content="height=device-height, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0, width=device-width"
          />
          <meta name="googlebot" content="noindex" />
          <meta name="robots" content="noindex" />
          <title>POS | SALES</title>
        </Head>

        <Provider store={store}>
          <ThemeConfig>
            <Toaster position="top-center" reverseOrder={false} gutter={8} />
            {router.pathname === "/login" 
            // ||
            // router.pathname.includes("/reset-password") ||
            // router.pathname.includes("/company-outlet-selection") ||
            // !getStorage("access_token") 
            ? (
            <Component {...pageProps} />
             ) : ( 
            <Box display={"flex"}>
              <Sidebar />
              <Box sx={{ width: "100%" }}>
                {/* <Navbar /> */}
                <Main>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ padding: "1% 1% 1% 1%" }}>
                      <Component {...pageProps} />
                    </Box>
                  </LocalizationProvider>
                </Main>
              </Box>
            </Box>
             )} 
          </ThemeConfig>
        </Provider>
      </>
    )
  );
};

export default MyApp;
