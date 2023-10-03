import React from "react";
import { Badge, Tooltip, IconButton } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsActive from "@mui/icons-material/NotificationsActive";

const NotificationIcon = ({ notifCount, handleOpen }) => {
  return (
    <Tooltip
      title={
        notifCount === 0
          ? "You have no notification"
          : `You have ${notifCount} notifications !`
      }
    >
      <IconButton
        color={notifCount === 0 ? "default" : "primary"}
        onClick={notifCount === 0 ? null : handleOpen}
      >
        <Badge
          badgeContent={notifCount}
          color="error"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {notifCount === 0 && <NotificationsNoneIcon />}
          {notifCount !== 0 && <NotificationsActive />}
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default NotificationIcon;
