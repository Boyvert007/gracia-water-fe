import {
  Box,
  Grid,
  Table,
  TableRow,
  TableCell,
  TableHead,
  Typography,
  TableBody,
  IconButton,
  Button,
  Paper,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  Modal,
  Divider,
  CircularProgress,
  Select,
  MenuItem,
  // FirstPageIcon,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";

import { Search } from "@mui/icons-material";
import { debounce } from "lodash";
import api from "../../services/pos";
import { formatDate, formatRupiah } from "../../utils/text";
import { getStorage } from "../../utils/storage";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import "dayjs/locale/id";
// import { useMediaQuery } from "react-responsive";

const HistorySales = (props) => {
  const router = useRouter();
  var language = props.language;
  const [isLoading, setIsLoading] = useState(false);
  // const PTID = JSON.parse(getStorage("pt")).pt_id;
  // const gudangID = JSON.parse(getStorage("outlet")).out_code;

  const userID = JSON.parse(window.sessionStorage.getItem("profile"))
    ? JSON.parse(window.sessionStorage.getItem("profile")).mem_nip
    : "";

  dayjs.locale(language);

  const [resultHeader, setResultHeader] = useState([]);

  const [responseModalIsOpen, setResponseModalIsOpen] = useState(false);
  const [responseHeader, setResponseHeader] = useState("");
  const [responseBody, setResponseBody] = useState("");
  const [keyword, setKeyword] = useState("");

  const [limitPPNIN, setLimitPPNIN]= useState(5)
  const [editCurrentPagePPNIN, setEditCurrentPagePPNIN] = useState(1);
  const [maxPagePPNIN, setMaxPagePPNIN] = useState(0);
  const [currentPagePPNIN, setCurrentPagePPNIN] = useState(1);
  const [listPPNIN, setListPPNIN] = useState([]);

  const fields = [
    { name: language === "ID" ? "Tranno" : "Tranno" },
    { name: language === "ID" ? "Tanggal Transaksi" : "Transaction Date" },
    { name: language === "ID" ? "Total" : "Total" },
    { name: language === "ID" ? "Aksi" : "Action" },
  ];
  // useEffect(() => {
  //   // if (userID === "" || gudangID === null) {
  //     //   history.push("/login");
  //     // debounceMountHistorySales();
  //   // } else {
  //     debounceMountHistorySales();
  //   // }
  // }, []);
  const debounceMountListPPNIN = useCallback(debounce(mountListPPNIN, 400));

  const debounceMountGetTotalPPNIN = useCallback(
    debounce(mountGetTotalPPNIN, 400)
  );
  async function mountListPPNIN() {
    const offset = limitPPNIN * currentPagePPNIN - limitPPNIN;
    try {
      const getListPPNIN = await api.getDataApriori2(
        // userPT.pt_id,
        offset,
        limitPPNIN
      );
      const { data } = getListPPNIN.data;
      setListPPNIN(data);
      // console.log("data", listPPNIN);
      // setPaginationShowPPNIN(true);
    } catch (error) {
      // setPaginationShowPPNIN(false);
      // setIsLoading(false);
      console.log(error);
    }
  }

  async function mountGetTotalPPNIN() {
    try {
      const getTotalPPNIN = await api.getTotalProduct();
      const { data, metadata } = getTotalPPNIN.data;
      setMaxPagePPNIN(parseInt(Math.ceil(data.cnt / limitPPNIN)));
      console.log("datatotal", data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    debounceMountListPPNIN();
    debounceMountGetTotalPPNIN();
    console.log("maxPPNIN", maxPagePPNIN);
  }, [limitPPNIN, currentPagePPNIN,maxPagePPNIN]);

  const debounceMountHistorySales = useCallback(debounce(getItem, 400));

  async function getItem() {
    // const newParams = {
    //   ptid: PTID,
    //   outcode: gudangID,
    // };
    setIsLoading(true);
    try {
      const getItem = await api.getItem();

      const { data } = getItem.data;
      if (data !== null) {
        setResultHeader(data);
        setIsLoading(false);
      } else {
        setResultHeader([]);
        setResponseHeader("DATA NOT FOUND !!!");
        setResponseModalIsOpen(true);
        setIsLoading(false);
      }
    } catch (error) {
      setResponseBody(error.message);
      setResponseHeader("Failed To Load");
      setResponseModalIsOpen(true);
      setIsLoading(false);
    }
  }

  function enterPressDetail(e) {
    switch (e.key) {
      case "Enter":
        toDetail(keyword);
        break;
      default:
    }
  }

  function toDetail(item) {
    console.log("item-index", item);
    console.log("router",router);
    router.push(`/historysales/${item}`);
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40%",
    bgcolor: "background.paper",
    p: 4,
  };

  function handleFirstPagePPNIN() {
    setEditCurrentPagePPNIN(1);
    setCurrentPagePPNIN(1);
    if (editCurrentPagePPNIN > maxPagePPNIN) {
      setEditCurrentPagePPNIN(maxPagePPNIN);
      setEditCurrentPagePPNIN(maxPagePPNIN);
    } else if (editCurrentPagePPNIN < 1) {
      setEditCurrentPagePPNIN(1);
      setCurrentPagePPNIN(1);
    }
  }

  useEffect(() => {
    setEditCurrentPagePPNIN(1);
    setCurrentPagePPNIN(1);
  }, [limitPPNIN]);

  function handlePrevPagePPNIN() {
    // setIsLoading(true)
    var prev = 0;
    prev = parseInt(editCurrentPagePPNIN) - 1;
    setEditCurrentPagePPNIN(prev);
    setCurrentPagePPNIN(prev);
    if (editCurrentPagePPNIN > maxPagePPNIN) {
    // setIsLoading(false)
    setEditCurrentPagePPNIN(maxPagePPNIN);
      setCurrentPage(maxPagePPNIN);
    } else if (editCurrentPagePPNIN < 1) {
    // setIsLoading(false)
      setEditCurrentPagePPNIN(1);
      setCurrentPagePPNIN(1);
    }
  }

  const handleChange1PPNIN = (e) => {
    var regexNumber = /^-?\d*\.?\d*$/;
    if (maxPagePPNIN !== "") {
      if (!regexNumber.test(e.target.value)) {
      } else {
        setEditCurrentPagePPNIN(e.target.value);
      }
    }
  };

  function handleEnterPressPagePPNIN(e) {
    var code = e.charCode || e.which;
    if (code === 13) {
      e.preventDefault();
      if (parseInt(editCurrentPagePPNIN) > maxPagePPNIN) {
        setEditCurrentPagePPNIN(maxPagePPNIN);
        setCurrentPagePPNIN(maxPagePPNIN);
      } else if (
        parseInt(editCurrentPagePPNIN) < 0 ||
        parseInt(editCurrentPagePPNIN) == 0
      ) {
        setEditCurrentPagePPNIN(1);
        setCurrentPagePPNIN(1);
      } else {
        setEditCurrentPagePPNIN(e.target.value);
        setCurrentPagePPNIN(e.target.value);
      }
    }
  }

  function handleNextPagePPNIN() {
    // setIsLoading(true)
    var next = 0;
    next = parseInt(editCurrentPagePPNIN) + 1;
    setEditCurrentPagePPNIN(next);
    setCurrentPagePPNIN(next);
    if (editCurrentPagePPNIN > maxPagePPNIN) {
    // setIsLoading(false)
      setEditCurrentPagePPNIN(maxPagePPNIN);
      setCurrentPagePPNIN(maxPagePPNIN);
      // setIndexPPNOUT(5)
    } else if (editCurrentPagePPNIN < 1) {
      // setIsLoading(false)
      setEditCurrentPagePPNIN(1);
      setCurrentPagePPNIN(1);
    }
  }

  function handleLastPagePPNIN() {
    setEditCurrentPagePPNIN(maxPagePPNIN);
    setCurrentPagePPNIN(maxPagePPNIN);
    if (editCurrentPagePPNIN > maxPagePPNIN) {
      setEditCurrentPagePPNIN(maxPagePPNIN);
      setCurrentPagePPNIN(maxPagePPNIN);
    } else if (editCurrentPagePPNIN < 1) {
      setEditCurrentPagePPNIN(1);
      setCurrentPagePPNIN(1);
    }
  }

  // const isDesktopOrLaptop = useMediaQuery({
  //   query: "(min-width: 1224px)",
  // });
  // const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  // const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  // const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  // const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  return (
    // <>
    //   {isTabletOrMobile === true ? (
    //     <>
    //       <Box sx={{ width: "auto", p: 0 }}>
    //         <Grid container>
    //           <Typography sx={{ mb: 2 }} variant="h7">
    //             {language === "ID"
    //               ? "RIWAYAT PENJUALAN MOBILE"
    //               : "HISTORY SALES MOBILE"}
    //           </Typography>{" "}
    //         </Grid>
    //         <Grid container border="medium">
    //           <Grid item flex={6}>
    //             <FormControl
    //               variant="outlined"
    //               size="small"
    //               sx={{ width: "auto" }}
    //             >
    //               <InputLabel size="small">
    //                 {language === "ID" ? "Cari" : "Search"}
    //               </InputLabel>
    //               <OutlinedInput
    //                 label={language === "ID" ? "Cari" : "Search"}
    //                 onKeyDown={(e) => enterPressDetail(e)}
    //                 onChange={(e) => setKeyword(e.target.value)}
    //                 endAdornment={
    //                   <InputAdornment position="end">
    //                     <IconButton
    //                       sx
    //                       aria-label="toggle password visibility"
    //                       onClick={() => toDetail(keyword)}
    //                       edge="end"
    //                     >
    //                       <Search />
    //                     </IconButton>
    //                   </InputAdornment>
    //                 }
    //               />
    //             </FormControl>
    //           </Grid>
    //         </Grid>

    //         <Paper>
    //           <Table size="small" sx={{ mt: 2 }}>
    //             <TableHead>
    //               <TableRow>
    //                 {fields &&
    //                   fields.map((head, index) => (
    //                     <TableCell
    //                       sx={{
    //                         fontSize: 10,
    //                         textAlign: "center",
    //                       }}
    //                       key={index}
    //                     >
    //                       {head.name}
    //                     </TableCell>
    //                   ))}
    //               </TableRow>
    //             </TableHead>
    //             <TableBody>
    //               {resultHeader &&
    //                 resultHeader.map((item, index) => (
    //                   <TableRow key={index}>
    //                     <TableCell sx={{ textAlign: "center", fontSize: 10 }}>
    //                       {item.trans_num === "" ||
    //                       item.trans_num === null
    //                         ? "-"
    //                         : item.trans_num}
    //                     </TableCell>
    //                     <TableCell sx={{ textAlign: "center", fontSize: 10 }}>
    //                       {item.trans_tanggaltransaksi === "" ||
    //                       item.trans_tanggaltransaksi === null
    //                         ? "-"
    //                         : formatDate(
    //                             item.trans_tanggaltransaksi,
    //                             "dddd, DD MMMM YYYY HH:mm:ss"
    //                           )}
    //                     </TableCell>
    //                     <TableCell
    //                       sx={{
    //                         textAlign: "center",
    //                         fontSize: 10,
    //                       }}
    //                     >
    //                       {item.trans_totaltransaksi === "" ||
    //                       item.trans_totaltransaksi === null
    //                         ? "-"
    //                         : formatRupiah(item.trans_totaltransaksi)}
    //                     </TableCell>
    //                     <TableCell sx={{ textAlign: "center" }}>
    //                       <Button
    //                         variant="contained"
    //                         onClick={() => toDetail(item.trans_num)}
    //                         sx={{
    //                           maxWidth: "10px",
    //                           maxHeight: "10px",
    //                           minWidth: "10px",
    //                           minHeight: "10px",
    //                         }}
    //                       >
    //                         {" "}
    //                         {language === "ID" ? (
    //                           <Typography sx={{ fontSize: 5 }}>
    //                             RINCIAN
    //                           </Typography>
    //                         ) : (
    //                           "DETAIL"
    //                         )}
    //                       </Button>
    //                     </TableCell>
    //                   </TableRow>
    //                 ))}
    //             </TableBody>
    //           </Table>
    //         </Paper>
    //         <Modal open={responseModalIsOpen}>
    //           <Box sx={style}>
    //             <Grid textAlign="center">
    //               <Typography fontWeight={700}>{responseHeader}</Typography>
    //             </Grid>
    //             <Grid mt={2} mb={2}>
    //               <Divider />
    //             </Grid>
    //             <Grid textAlign="center">
    //               <Typography>{responseBody}</Typography>
    //             </Grid>
    //             <Grid textAlign="center" mt={2}>
    //               <Button
    //                 onClick={() => setResponseModalIsOpen(false)}
    //                 variant="contained"
    //                 color="error"
    //               >
    //                 Close
    //               </Button>
    //             </Grid>
    //           </Box>
    //         </Modal>

    //         <Modal open={isLoading}>
    //           <Box sx={style} style={{ textAlign: "center" }}>
    //             <CircularProgress>PLEASE WAIT...</CircularProgress>
    //           </Box>
    //         </Modal>
    //       </Box>
    //     </>
    //   ) : (
    //     <>
          <Box sx={{ width: "100%", p: 3 }}>
            <Grid container>
              <Typography sx={{ mb: 2, ml: 2 }} variant="h5">
                {language === "ID" ? "RIWAYAT PENJUALAN" : "HISTORY SALES"}
              </Typography>{" "}
            </Grid>
            <Grid container border="medium">
              <Grid item flex={6}>
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ width: "100%" }}
                >
                  <InputLabel size="small">
                    {language === "ID" ? "Cari" : "Search"}
                  </InputLabel>
                  <OutlinedInput
                    label={language === "ID" ? "Cari" : "Search"}
                    onKeyDown={(e) => enterPressDetail(e)}
                    onChange={(e) => setKeyword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => toDetail(keyword)}
                          edge="end"
                        >
                          <Search />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>

            <Paper>
              <Table size="small" sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    {fields &&
                      fields.map((head, index) => (
                        <TableCell
                          sx={{
                            fontWeight: "600",
                            textAlign: "center",
                          }}
                          key={index}
                        >
                          {head.name}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listPPNIN &&
                    listPPNIN.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ textAlign: "center" }}>
                          {item.trannum === "" ||
                          item.trannum === null
                            ? "-"
                            : item.trannum}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {item.time_recorded === "" ||
                          item.time_recorded === null
                            ? "-"
                            : formatDate(
                                item.time_recorded,
                                "dddd, DD MMMM YYYY HH:mm:ss"
                              )}
                        </TableCell>
                        <TableCell
                          sx={{ textAlign: "center", borderColor: "warning" }}
                        >
                          {item.sumvalue === "" ||
                          item.sumvalue === null
                            ? "-"
                            // : formatRupiah(item.trans_totaltransaksi)}
                            : item.sumvalue}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <Button
                            variant="contained"
                            onClick={() => toDetail(item.trannum)}
                          >
                            {" "}
                            {language === "ID" ? "RINCIAN" : "DETAIL"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              
            </Paper>
            <Grid
                        container
                        direction="row"
                        spacing={2}
                        sx={{ justifyContent: "center" }}
                        mt={2}
                      >
                        <Grid item>
                          <Select
                            size="small"
                            value={limitPPNIN}
                            onChange={(e) => setLimitPPNIN(e.target.value)}
                          >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                          </Select>
                        </Grid>
                        <Grid item>
                          <Button
                            sx={{ m: 0 }}
                            // fullWidth
                            variant="contained"
                            onClick={() => handleFirstPagePPNIN()}
                            disabled={parseInt(editCurrentPagePPNIN) === 1}
                          >
                            <FirstPageIcon />
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            sx={{ m: 0 }}
                            variant="contained"
                            disabled={parseInt(editCurrentPagePPNIN) === 1}
                            onClick={() => handlePrevPagePPNIN()}
                          >
                            <ArrowBackIosIcon />{" "}
                          </Button>
                        </Grid>
                        <Grid item>
                          <TextField
                            size="small"
                            sx={{ width: "5em" }}
                            value={editCurrentPagePPNIN}
                            onChange={(e) => handleChange1PPNIN(e)}
                            onKeyDown={(e) => handleEnterPressPagePPNIN(e)}
                          ></TextField>
                        </Grid>
                        <Grid item>
                          <Typography variant="h4">/</Typography>
                        </Grid>
                        <Grid item>
                          <TextField
                            sx={{ width: "5em" }}
                            size="small"
                            value={maxPagePPNIN}
                            disabled
                          ></TextField>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            size="normal"
                            disabled={
                              parseInt(editCurrentPagePPNIN) ===
                              parseInt(maxPagePPNIN)
                            }
                            onClick={() => handleNextPagePPNIN()}
                          >
                            <ArrowForwardIosIcon />
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            onClick={() => handleLastPagePPNIN()}
                            disabled={
                              parseInt(editCurrentPagePPNIN) ===
                              parseInt(maxPagePPNIN)
                            }
                          >
                            <LastPageIcon />
                          </Button>
                        </Grid>
                      </Grid>
            <Modal open={responseModalIsOpen}>
              <Box sx={style}>
                <Grid textAlign="center">
                  <Typography fontWeight={700}>{responseHeader}</Typography>
                </Grid>
                <Grid mt={2} mb={2}>
                  <Divider />
                </Grid>
                <Grid textAlign="center">
                  <Typography>{responseBody}</Typography>
                </Grid>
                <Grid textAlign="center" mt={2}>
                  <Button
                    onClick={() => setResponseModalIsOpen(false)}
                    variant="contained"
                    color="error"
                  >
                    Close
                  </Button>
                </Grid>
              </Box>
            </Modal>

            <Modal open={isLoading}>
              <Box sx={style} style={{ textAlign: "center" }}>
                <CircularProgress>PLEASE WAIT...</CircularProgress>
              </Box>
            </Modal>
          </Box>
    //     </>
    //   )}
    // </>
  );
};
export default HistorySales;
