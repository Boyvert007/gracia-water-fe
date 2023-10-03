import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";

const NotificationList = ({
  anchorEL,
  handleClose,
  isOpen,
  notificationList,
}) => {
  function returnListItemIcon(type) {
    switch (type) {
      case "info":
        return <InfoIcon color="primary" />;
      case "warning":
        return <WarningIcon color="warning" />;
      case "error":
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="primary" />;
    }
  }
  return (
    <Menu
      anchorEl={anchorEL}
      open={isOpen}
      onClose={handleClose}
    >
      <MenuList dense>
        {notificationList &&
          notificationList.map((item, key) => (
            <MenuItem key={key} onClick={handleClose}>
              <ListItemIcon>{returnListItemIcon(item.type)}</ListItemIcon>
              <ListItemText>{item.message}</ListItemText>
            </MenuItem>
          ))}

        <Divider />
        <MenuItem sx={{ justifyContent: "center" }}>
          <Typography variant="subtitle2" color="primary">
            See all notifications
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
export default NotificationList;
