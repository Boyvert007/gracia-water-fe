import { styled } from "@mui/material";

const InputWrapper = styled("div")((props) => ({
  background: props.backgroundcolor
    ? props.backgroundcolor
    : "rgba(0, 0, 0, 0.04)",
  width: props.width ? props.width : "50%",
  display: "flex",
  alignItems: "center",
}));

export default InputWrapper;
