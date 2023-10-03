import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Stack,
  Grid,
  Divider,
  Button,
  Typography,
} from "@mui/material";

import { useRouter } from "next/router";
import Image from "next/image";

import useToast from "../utils/toast";
import CenturyLogo from "../public/static/logo/century.png";
import { getStorage, setStorage } from "../utils/storage";

const Login = () => {
  const router = useRouter();
  const [displayToast] = useToast();

  const [loginValue, setLoginValue] = useState({
    nip: "",
    password: "",
  });
  const handleChange = (event) => {
    setLoginValue({ ...loginValue, [event.target.name]: event.target.value });
  };

  // useEffect(() => {
  //   if (getStorage("access_token")) {
  //     router.push("/");
  //   }
  // }, []);

  async function onFinish() {
    try {
      // const login = await api.login(loginValue);
      // const { data } = login.data;
      // setStorage("pt", 9);
      // setStorage("access_token", `${data.token_type} ${data.access_token}`);
      // setStorage("expires_at", data.expires_at);
      // setStorage("userNIP", loginValue.nip);
      router.push("/");
    } catch (error) {
      console.log(error);
      displayToast("error", "Login failed.");
    }
  }

  // async function onFinish() {
  //   setStorage("pt", 9);
  //   setStorage(
  //     "access_token",
  //     "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NjI0MTY1NzgsImlhdCI6MTY2MjM3MzM3OCwiaXNzIjoiUEhBUk1BTElOSyIsIm5iZiI6MTY2MjM3MzM3OCwibmlwIjoidGVzdGluZyIsInN1YiI6InRlc3RpbmcifQ.CfqZf6gc3lj_ircMQDMKlReCyEzFZFpOKxmnqsaHT-M"
  //   );
  //   // setStorage("expires_at", data.expires_at);
  //   setStorage("userNIP", "2002002");
  //   router.push("/company-outlet-selection");
  //   // setSidebarOpen(sideBarOpen);
  //   // try {
  //   //   const login = await api.login(loginValue);
  //   //   const { data } = login.data;
  //   //   setStorage("pt", 9);
  //   //   setStorage("access_token", `${data.token_type} ${data.access_token}`);
  //   //   setStorage("expires_at", data.expires_at);
  //   //   setStorage("userNIP", loginValue.nip);
  //   //   router.push("/company-outlet-selection");
  //   // } catch (error) {
  //   //   console.log(error);
  //   //   displayToast("error", "Login failed.");
  //   // }
  // }

  return (
    <Box
      sx={{
        backgroundColor: "#F5F5F5",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh",
        position: "absolute",
        left: 0,
      }}
    >
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid
          item
          xs={3}
          sx={{
            zIndex: "5",
          }}
        >
          <Card
            variant="outlined"
            sx={{
              width: "380px",
              background: "#FFFFFF",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
              borderRadius: " 12px",
              padding: "10px 0px",
            }}
          >
            <CardContent>
              <Stack component="form" spacing={2} noValidate>
                <Box display={"flex"} justifyContent={"center"}>
                  {/* <Image
                    src={CenturyLogo}
                    width={100}
                    height={100}
                    alt="login logo"
                  /> */}
                </Box>
                <Divider sx={{ marginTop: "16px" }} />
                <TextField
                  label="NIP"
                  name="nip"
                  value={loginValue.nip}
                  onChange={handleChange}
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={loginValue.password}
                  onChange={handleChange}
                />
                <Divider sx={{ mt: 2 }} />
                <Button
                  disabled={!loginValue.nip || !loginValue.password}
                  onClick={onFinish}
                  sx={{ mt: 3 }}
                  variant="contained"
                >
                  Log In
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Typography
          variant="subtitle2"
          sx={{ color: "rgba(0, 0, 0, 0.87)", mt: 1.5 }}
        >
          {process.env.NEXT_PUBLIC_APP_VERSION}
        </Typography>
      </Grid>
    </Box>
  );
};

export default Login;
