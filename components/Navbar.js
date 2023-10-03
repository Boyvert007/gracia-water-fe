import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import jwt_decode from "jwt-decode";

import { setUser } from "../redux/actions/userAction";
import { getStorage } from "../utils/storage";

import NotificationIcon from "./NotificationIcon";
import NotificationList from "./NotificationList";
import { useRouter } from "next/router";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userReducer = useSelector((state) => state.userReducer);
  const {
    user: { email },
  } = userReducer;

  const [listNotification, setListNotification] = useState([
    {
      type: "info",
      message: "this is an info notification",
    },
    {
      type: "warning",
      message: "this is a warning notification",
    },
    {
      type: "error",
      message: "this is an error notification",
    },
  ]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(3);
  const [anchor, setAnchor] = useState(null);
  const [notifMenuIsOpen, setNotifMenuIsOpen] = useState(false);
  const [navTitle, setNavTitle] = useState("Dashboard");
  const [navColor, setNavColor] = useState("black");

  useEffect(() => {
    if (router.pathname === "/master/group-coa") {
      setNavTitle("GROUP COA");
      setNavColor("red");
    }
    if (router.pathname === "/master/coa") {
      setNavTitle("COA");
      setNavColor("black");
    }
  }, [router]);

  // function setUserData() {
  //   const token = getStorage("access_token");
  //   const decoded = jwt_decode(token);
  //   const payloadUser = {
  //     email: decoded.email,
  //     username: decoded.username,
  //   };
  //   dispatch(setUser(payloadUser));
  // }

  function handleNotificationMenuOpen(event) {
    setAnchor(event.currentTarget);
    setNotifMenuIsOpen(true);
  }

  function handleCloseNotificationMenu() {
    setNotifMenuIsOpen(false);
  }

  return (
    <AppBar sx={{ width: "100%", background: "white" }}>
      <Toolbar>
        <Typography
          variant="h4"
          component="div"
          sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold" }}
          color={navColor}
        >
          {navTitle}
        </Typography>
        <NotificationIcon
          notifCount={unreadNotifCount}
          anchorEL={anchor}
          handleOpen={(e) => handleNotificationMenuOpen(e)}
        />
        <NotificationList
          isOpen={notifMenuIsOpen}
          anchorEL={anchor}
          handleClose={() => handleCloseNotificationMenu()}
          notificationList={listNotification}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
