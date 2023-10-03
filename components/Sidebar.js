import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Collapse,
  Typography,
  Box,
  Stack,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import CenturyLogo from "../public/static/logo/century.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useRouter } from "next/router";
import { getStorage, deleteStorage, clearStorage } from "../utils/storage";
import { Routes } from "./Routes";
import { BottomRoutes } from "./BottomRoutes";

const drawerWidth = 300;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  // background: '#153C6C',
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const DrawerFooter = styled(DrawerHeader)(() => ({
  position: "absolute",
  bottom: 0,
  width: "100%",
  ["@media (max-height:740px)"]: {
    position: "unset",
  },
}));

const ListFooter = styled(List)(() => ({
  position: "absolute",
  bottom: "64px",
  width: "100%",
  ["@media (max-height:740px)"]: {
    position: "unset",
  },
}));

const Sidebar = () => {
  const theme = useTheme();
  const router = useRouter();
  const [sideBarOpen, setSidebarOpen] = useState(true);

  // useEffect(() => {
  //   if (!getStorage("access_token")) {
  //     changeRoute("/login");
  //   }
  // });

  function changeRoute(route) {
    router.push(`${route}`);
    setSidebarOpen(!sideBarOpen);
  }

  function logout() {
    clearStorage();
    router.push(`/login`);
  }

  function hasChildren(item) {
    const { submenu: children } = item;
    if (children === undefined) {
      return false;
    }

    if (children.constructor !== Array) {
      return false;
    }

    if (children.length === 0) {
      return false;
    }

    return true;
  }

  const MenuItem = ({ item }) => {
    const Component = hasChildren(item) ? MultiLevel : SingleLevel;
    return <Component item={item} />;
  };

  const SingleLevel = ({ item }) => {
    return (
      <ListItem
        key={item.menu}
        onClick={
          item.path === "/logout"
            ? () => logout()
            : () => changeRoute(item.path)
        }
        disablePadding
        sx={{ display: "block" }}
      >
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: sideBarOpen ? "initial" : "center",
            px: 2.5,
          }}
        >
          <Tooltip
            title={item.menu}
            arrow
            placement="right-start"
            enterDelay={sideBarOpen ? 1000000 : 100}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: sideBarOpen ? 3 : "auto",
                justifyContent: "center",
                color: "#ffffff",
                opacity: 0.7,
              }}
            >
              {item.icon}
            </ListItemIcon>
          </Tooltip>
          <ListItemText
            primary={item.menu}
            sx={{ opacity: sideBarOpen ? 0.7 : 0, color: "#ffffff" }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const MultiLevel = ({ item }) => {
    const { submenu: children } = item;
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
      setIsOpen((prev) => !prev);
    };

    return (
      <>
        <ListItem
          key={item.menu}
          onClick={() => handleClick()}
          disablePadding
          sx={{ display: "block" }}
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              px: 2.5,
            }}
          >
            <Tooltip
              title={item.menu}
              arrow
              placement="right-start"
              enterDelay={sideBarOpen ? 1000000 : 100}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: sideBarOpen ? 3 : "auto",
                  justifyContent: "center",
                  color: "#ffffff",
                  opacity: 0.7,
                }}
              >
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            <ListItemText
              primary={item.menu}
              sx={{ opacity: sideBarOpen ? 0.7 : 0, color: "#ffffff" }}
            />
            {isOpen ? (
              <ExpandLessIcon
                sx={{ opacity: sideBarOpen ? 0.7 : 0, color: "#ffffff" }}
              />
            ) : (
              <ExpandMoreIcon
                sx={{ opacity: sideBarOpen ? 0.7 : 0, color: "#ffffff" }}
              />
            )}
          </ListItemButton>
        </ListItem>
        <Collapse in={isOpen}>
          {children &&
            children.map((child, key) => <MenuItem key={key} item={child} />)}
        </Collapse>
      </>
    );
  };

  return (
    <Drawer
      variant="permanent"
      open={sideBarOpen}
      PaperProps={{
        sx: {
          bgcolor: "#1A4B87",
          transition: (theme) =>
            theme.transitions.create("background-color", {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
        },
      }}
    >
      <DrawerHeader sx={{ py: 3, px: 0 }}>
        <Stack>
          <Box
            sx={{
              width: "60px",
              height: "60px",
              transform: sideBarOpen ? "scale(1)" : "scale(0.7)",
              transition: (theme) =>
                theme.transitions.create("transform", {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.complex,
                }),
            }}
          >
            <Image
              // src={CenturyLogo}
              width="100%"
              height="100%"
              alt="Sidebar Logo"
            />
          </Box>

          <Typography
            variant="subtitle2"
            align="center"
            sx={{ color: "rgba(255, 255, 255, 0.6)" }}
            mt={1.5}
          >
            {process.env.NEXT_PUBLIC_APP_VERSION}
          </Typography>
        </Stack>
      </DrawerHeader>
      <div>
        <div
          className="scrollbar"
          style={{ maxHeight: "60vh", overflowX: "hidden", overflowY: "auto" }}
        >
          {Routes.map((item, key) => (
            <MenuItem key={key} item={item} />
          ))}
        </div>
        <ListFooter>
          {BottomRoutes.map((item, key) => (
            <MenuItem key={key} item={item} />
          ))}
        </ListFooter>
      </div>
      <DrawerFooter>
        {sideBarOpen && (
          <Typography
            variant="body2"
            sx={{ fontWeight: 400, color: "#FFFFFF", opacity: 0.7 }}
            onClick={() => setSidebarOpen(!sideBarOpen)}
          >
            Hide Sidebar
          </Typography>
        )}
        <IconButton
          onClick={() => setSidebarOpen(!sideBarOpen)}
          sx={{
            color: "#FFFFFF",
            opacity: 0.7,
            transform: sideBarOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: (theme) =>
              theme.transitions.create("transform", {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.complex,
              }),
          }}
        >
          <DoubleArrowIcon />
        </IconButton>
      </DrawerFooter>
    </Drawer>
  );
};

export default Sidebar;
