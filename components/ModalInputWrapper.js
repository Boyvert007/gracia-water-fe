import { styled } from "@mui/material";

const ModalInputWrapper = styled("div")((props) => ({
  background: props.backgroundColor,
  width: "330px",
  display: "flex",
  alignItems: "center",
}));

export default ModalInputWrapper;
