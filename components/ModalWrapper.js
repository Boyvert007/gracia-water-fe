import { Box } from "@mui/material";
import { styled } from "@mui/material";

const ModalWrapper = styled(Box)((props) => ({
  overflowY: props.scroll ? "scroll" : "unset",
  maxHeight: "80%",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: "40px",
  background: "#ffffff",
  boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
  borderRadius: "4px",
}));

export default ModalWrapper;
