import { Edit, PaddingOutlined } from "@mui/icons-material";
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
  Divider,
  Select,
  Stack,
  Modal,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  FormHelperText,
  Collapse,
  CircularProgress,
  Icon,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "../../utils/link";
import { Add, Search, Book, RemoveRedEye } from "@mui/icons-material";
import { useRouter } from "next/router";
import { debounce } from "lodash";
import ModalWrapper from "../../components/ModalWrapper";
import ModalInputWrapper from "../../components/ModalInputWrapper";
import api from "../../services/pos";
import { formatDate } from "../../utils/text";
import { getStorage } from "../../utils/storage";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Posv2 = () => {
  const router = useRouter();
  const [locale, setLocale] = useState("ID");
  const scanInputRef = useRef(null);
  // const PTID = JSON.parse(getStorage("pt")).pt_id;
  const PTID = "9";
  // const gudangID = JSON.parse(getStorage("outlet")).out_code;
  const gudangID = "A63";

  const [selectedCategory, setSelectedCategory] = useState("b");
  const [resultHistoryHeader, setResultHistoryHeader] = useState([]);
  const [resultHistoryDetail, setResultHistoryDetail] = useState([]);
  const [resultHistory, setResultHistory] = useState([]);
  const [validationError, setValidationError] = useState(false);
  const [today, setDate] = useState(new Date());
  const [ccNumber, setCcNumber] = useState("");
  const [strookNumber, setStrookNumber] = useState("");
  const [dateTrandHistory, setDateTrandHistory] = useState("");
  const day = today.toLocaleDateString(locale, { weekday: "long" });
  const [newTransaction, setNewTransaction] = useState([]);
  const [newTempTransaction, setNewTempTransaction] = useState([]);
  const [total, setTotal] = useState(0);
  const [grandTotalTransaction, setGrandTotalTransaction] = useState(0);
  const [kembalian, setKembalian] = useState(0);
  const [cashValue, setCashValue] = useState(0);
  const [btnInsertTransaction, setBtnInsertTransaction] = useState(true);
  const [resultBatchHeader, setResultBatchHeader] = useState({});
  const [resultBatch, setResultBatch] = useState([]);
  const [paymentType, setPaymentType] = useState("Choose");
  // const [paymentTypeName, setPaymentTypeName] = useState(''); //eslint-disable-line
  const [paymentTypeHost, setPaymentTypeHost] = useState("");
  const [pembulatan, setPembulatan] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [responseHeader, setResponseHeader] = useState("");
  const [responseBody, setResponseBody] = useState("");
  const [numberQty, setNumberQty] = useState([]);

  const [responseModalIsOpen, setResponseModalIsOpen] = useState(false);
  const [ScanNameTagModal, setScanNamtagModalIsOpen] = useState(false);
  const [MembershipModalIsOpen, setMembershipModalIsOpen] = useState(false);
  const [modalUploadFilesIsOpen, setModalUploadFilesIsOpen] = useState(false);
  const [modalTransfer, setModalTransfer] = useState(false);
  const [modalSave, setModalSave] = useState(false);
  const [modalBatch, setModalBatch] = useState(false);
  const [showCreditMethod, setShowCreditMethod] = useState(true);

  const [showVoucherMethod, setShowVoucherMethod] = useState(true);

  const [disableSearch, setDisableSearch] = useState(true);
  const [disabledSelectedCategory, setDisabledSelectedCategory] =
    useState(true);
  const [disableResep, setDisableResep] = useState(true);
  const [seeResep, setSeeResep] = useState(false);
  const [disableAdd, setDisableAdd] = useState(false);

  const [match, setMatch] = useState(false);

  const [selectedFile, setSelectedFile] = useState();
  const [isSelected, setIsSelected] = useState();

  // barcodeasd
  const [scanned, setScanned] = useState(false);
  const [scannedNameTag, setScannedNameTag] = useState(false);
  const [noMember, setNoMember] = useState("");
  const [nipUser, setNipUser] = useState("");
  const [timer, setTimer] = useState(null);

  const [hideNOMember, setHideNOMember] = useState(true);
  const [tipeMember, setTipeMember] = useState("NonMember");
  const [hideNOMemberModal, setHideNOMemberModal] = useState(false);
  const [konfirmasiMember, setkonfirmasiMember] = useState(true);
  const [namaMember, setNamaMember] = useState("");
  const [runningID, setRunningID] = useState("");

  const [inputSearch, setInputSearch] = useState("");
  const [nextPage, setNextPage] = useState("Y");

  const date = `${day}, ${today.getDate()} ${today.toLocaleDateString(locale, {
    month: "long",
  })}\n\n`;
  // const hour = today.getHours();
  // const wish = `Good ${(hour < 12 && 'Morning') || (hour < 17 && 'Afternoon') || 'Evening'}, `;
  const time = today.toLocaleTimeString(locale, {
    hour: "numeric",
    hour12: true,
    minute: "numeric",
    second: "numeric",
  });
  const userID = JSON.parse(window.sessionStorage.getItem("profile"))
    ? JSON.parse(window.sessionStorage.getItem("profile")).mem_nip
    : "";
  // set input cc number

  const formatAndSetCcNumber = (e) => {
    const inputVal = e.target.value.replace(/ /g, "");
    let inputNumbersOnly = inputVal.replace(/\D/g, "");

    if (inputNumbersOnly.length > 16) {
      inputNumbersOnly = inputNumbersOnly.substr(0, 16);
    }

    const splits = inputNumbersOnly.match(/.{1,4}/g);

    let spacedNumber = "";
    if (splits) {
      spacedNumber = splits.join(" ");
    }
    setCcNumber(spacedNumber);
  };

  const searchby = [
    {
      label: "Barcode",
      value: "b",
    },
    {
      label: "Procode",
      value: "p",
    },
    {
      label: "History",
      value: "h",
    },
  ];
  const tableHeader = [{ name: "Daftar Barang" }, { name: "Jumlah Transaksi" }];
  const fieldsbatch = [
    { name: "Batch" },
    { name: "Expired" },
    { name: "Stock" },
    { name: "Qty" },
    { name: "Action" },
  ];

  // const toggleTransfer = () => {
  //   // setPaymentType('0')
  //   getPaymentType();
  //   // setModalTransfer(!modalTransfer);
  // };

  useEffect(() => {
    if (namaMember === "" || namaMember === "-") {
      setScanned(false);
      setNoMember("");
    } else {
      setScanned(true);
    }
  }, [strookNumber]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [locale]);

  useEffect(() => {
    if (resultHistory.length === 0) {
      setDisableAdd(true);
    } else {
      setDisableAdd(false);
    }
    // eslint-disable-next-line
  }, [resultHistory]);

  const toggleScanNameTag = () => {
    generateRunningID();
    setScanNamtagModalIsOpen(!ScanNameTagModal);
    setkonfirmasiMember(true);
    setScannedNameTag(false);
    setNipUser("");
    setHideNOMemberModal(false);
  };
  const closedtoggleScanNameTag = () => {
    setScanNamtagModalIsOpen(!ScanNameTagModal);
    setkonfirmasiMember(true);
    setScannedNameTag(false);
    setNipUser("");
    setHideNOMemberModal(false);
  };

  // toggle modal membership
  const toggleMembershipModal = () => {
    setMembershipModalIsOpen(!MembershipModalIsOpen);
    if (namaMember === "" || namaMember === "-") {
      setScanned(false);
      setNoMember("");
    } else {
      setScanned(true);
    }
  };

  const toggleCloseMembershipModal = () => {
    setMembershipModalIsOpen(false);
    setkonfirmasiMember(true);
    setHideNOMemberModal(false);
    setDisableAdd(false);
  };

  function toggleNotMembershipModal() {
    buttonDisabler();
    setMembershipModalIsOpen(false);
    setHideNOMemberModal(true);
    setTipeMember("NonMember");
    setHideNOMember(true);
    // setkonfirmasiMember(false);
    setHideNOMemberModal(false);
    setkonfirmasiMember(true);
    setResultHistoryHeader([]);
    setResultHistory([]);
    setResultHistoryDetail([]);
    setStrookNumber("");
    // getStrookNumber();
  }
  // useEffect(() => {
  //   document.getElementById("SearchProduct").focus()
  // }, [MembershipModalIsOpen])
  //untuk scan member todo
  // function toggleOpenMembershipModal() {
  //     setTimeout(() => {
  //         scanInputRef.current.focus();
  //     }, 50);
  //     setNoMember('')
  //     setScanned(false)
  //     setHideNOMemberModal(true)
  //     setkonfirmasiMember(false)
  // }
  function toggleOpenMembershipModalTESTING() {
    setTimeout(() => {
      // scanInputRef.current.focus();
    }, 50);
    setNoMember("");
    setScanned(false);
    setHideNOMemberModal(true);
    setkonfirmasiMember(false);
  }

  function toggleOKMembershipModal() {
    getMemberDetail();
  }
  function getMemberDetail() {
    setHideNOMember(false);
    setDisableAdd(true);

    toggleCloseMembershipModal();
  }
  function resetAll() {
    window.location.reload();
    setDisableSearch(true);
    setDisabledSelectedCategory(true);
    setInputSearch("");
    // debounceMountPOS();
    setDisableResep(true);
    setNewTransaction([]);
    setNumberQty([]);
    setCashValue(0);
    setKembalian(0);
    setStrookNumber("");
    setPaymentType("Choose");
    setNipUser("");
    setNoMember("");
    setNamaMember("");
  }
  function onChangePaymentOption(event) {
    var nama = paymentOption.find(function (element) {
      return element.pay_code === event.target.value;
    });
    setPaymentType(event.target.value);
    // setPaymentTypeName(nama.pay_name);
    setPaymentTypeHost(nama.host_kdkartu);

    var tempsString = String(total);
    var temps = total;
    var tempTotal = tempsString.slice(-2);
    setPembulatan(Number(tempTotal));
    // console.log("tempTotal", tempTotal);

    if (event.target.value === "0") {
      if (tempTotal !== "00") {
        // console.log("tempssssssss", temps.replace(temps.slice(-2), "00"));
        // console.log("tempssssssss 2", Math.floor(temps / 100) * 100);
        // tempTotal = temps.replace(temps.slice(-2), "00")
        tempTotal = Math.floor(temps / 100) * 100;
        setTotal(Number(tempTotal));
      } else {
        setTotal(Number(total));
      }
    } else {
      var temp = 0;
      newTransaction.forEach((transaction) => {
        temp +=
          transaction.sale_sellqty * transaction.sale_saleprice -
          // + (transaction.sale_Qty *transaction.sale_SalePrice * transaction.sale_VAT) /100
          (transaction.sale_sellqty *
            transaction.sale_disccenpct *
            transaction.sale_saleprice) /
            100 -
          (transaction.sale_sellqty *
            transaction.sale_discmbrsup *
            transaction.sale_saleprice) /
            100;
        // - (transaction.sale_Qty * transaction.sale_DiscSpcl * transaction.sale_SalePrice) / 100; // todoDiskon
      });
      setTotal(Number(temp));
      setPembulatan(Number(0));
    }
  }
  const changeHandler = (event) => {
    setSelectedFile(URL.createObjectURL(event.target.files[0]));
    setIsSelected(true);
  };
  useEffect(() => {
    setShowCreditMethod(false);
    if (paymentType === "0") {
      setShowCreditMethod(true);
      setShowVoucherMethod(true);
    } else {
      setShowCreditMethod(false);
      setShowVoucherMethod(true);
    }
  }, [paymentType]);

  const handleSubmission = () => {
    const formData = new FormData();

    formData.append("File", selectedFile);

    fetch("https://freeimage.host/api/1/upload?key=<YOUR_API_KEY>", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log("Success:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  //todo
  const [paymentOption, setPaymentOption] = useState([]);

  const toggleResponseModal = () => {
    setResponseModalIsOpen(true);
  };
  function toggleCloseSaveModal() {
    setResponseModalIsOpen(false);
  }
  // modal upload
  const toggleModalUpload = () => {
    setModalUploadFilesIsOpen(true);
  };
  function toggleModalUploadClose() {
    setModalUploadFilesIsOpen(false);
  }

  const toggleTransfer = (type) => {
    // setPaymentType('0')
    getPaymentType();
    // setModalTransfer(!modalTransfer);
  };

  const toggleTransferClosed = () => {
    setModalTransfer(false);
  };

  const toggleBatch = (item, index) => {
    setModalBatch(!modalBatch);
    // item[index].sale_Qty = 0
  };

  const toggleBatchClosed = () => {
    setModalBatch(false);
    setResultBatch([]);
    setResultBatchHeader([]);
  };

  const toggleModalSave = () => {
    setModalSave(true);
  };
  const toggleModalSaveClosed = () => {
    setModalSave(false);
  };

  function keyPresshandleChangeQty(item, index, e) {
    // console.log('keyPresshandleChangeQty',item, index, e);
    switch (e.key) {
      case "Enter":
        // console.log('keyPresshandleChangeQty enter',item, index, e);
        doneChangeQty(item, index);
        break;
      default:
    }
  }
  function onChangeNameTag(event) {
    // document.getElementById("scanNametag").focus();

    setNipUser(event.target.value);
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
      setTimeout(() => {
        setScannedNameTag(true); // todo123
        setNipUser(event.target.value);
      }, 10)
    );
  }

  useEffect(() => {
    setNipUser(nipUser);
    if (nipUser !== "" && scannedNameTag === true) {
      if (nipUser.length < 5) {
        // todo
        // setkonfirmasiMember(true)
      } else {
        setScanNamtagModalIsOpen(false);
        toggleMembershipModal();
      }
    }
    // eslint-disable-next-line
  }, [nipUser, scannedNameTag]);

  useEffect(() => {
    setNoMember(noMember);
    // todo member
    // if (noMember !== "" && scanned === true) {
    //   getMember();
    // }
    if (noMember !== "" && scanned === true) {
      if (noMember.length < 2) {
        setTipeMember("NonMember");
        setNamaMember("-");
        setDisableSearch(false);
        setDisabledSelectedCategory(false);
        setDisableResep(false);
        // getStrookNumber();
        setIsLoading(false);
      } else {
        getMemberTesting();
      }
    }
    // eslint-disable-next-line
  }, [noMember, scanned]);
  function getMemberTesting() {
    setTipeMember("Member");
    setHideNOMember(false);
    setNamaMember(noMember);
    setDisableSearch(false);
    setDisabledSelectedCategory(false);
    setDisableResep(false);
    // getStrookNumber();
    setIsLoading(false);
  }

  useEffect(() => {
    // document.getElementById("SearchProduct").focus();
  }, [ScanNameTagModal]);

  function onChangeBarcode(event) {
    // document.getElementById("SearchbyScanning").focus();
    // console.log('e', event);
    // switch (event.key) {
    //   case "Escape":
    //     setMembershipModalIsOpen(MembershipModalIsOpen);
    //     break;
    //   default:
    // }

    setNoMember(event.target.value);
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
      setTimeout(() => {
        setScanned(true);
        setNoMember(event.target.value);
        setResultHistoryHeader([]);
        setResultHistory([]);

        setResultHistoryDetail([]);
        setStrookNumber("");
        setMembershipModalIsOpen(!MembershipModalIsOpen);
      }, 10)
    );
  }

  // //payment amount
  // useEffect(() => {
  //   if (cashValue < grandTotalTransaction) {
  //     setDisableButtonPayment(true);
  //   } else {
  //     setDisableButtonPayment(false);
  //   }
  //   // eslint-disable-next-line
  // }, [cashValue]);

  function handleChangeQty(item, index, evt) {
    var tempArr = [];
    if (numberQty.length !== 0) {
      tempArr = [...numberQty];
      tempArr.splice(index, 1, Number(evt.target.value));
    } else {
      tempArr = new Array(resultBatch.length).fill(0, 0, resultBatch.length);
      tempArr.splice(index, 1, Number(evt.target.value));
    }
    setNumberQty(tempArr);
  }

  function doneChangeQty(item, index) {
    setResultHistory([]);
    item.sale_proname =
      resultBatchHeader === null ? "-" : resultBatchHeader.pro_name;
    item.sale_activeyn = "Y";
    item.sale_racik = 0;
    item.sale_medqty = 0;
    item.sale_medqtybns = 0;
    item.sale_saleprice = 0;
    item.sale_sellqtybns = 0;
    item.sale_trannum = "";
    item.sale_recipenum = "0";
    // item.sale_sellqty = 0;
    item.sale_medprice = 0;
    item.sale_medpack = "";
    item.sale_vatvalue = 0;
    item.sale_counteryn = "";
    item.sale_procod = resultBatchHeader.pro_code;
    item.sale_batch = item.batch;
    item.sale_expdate = item.expired_date;
    item.sale_sellqty =
      newTempTransaction[index] &&
      newTempTransaction[index].sale_Batch === item.batch
        ? newTempTransaction[index].sale_sellqty
        : numberQty[index];
    item.sale_saleprice = resultBatchHeader.pro_saleprice;

    // item.sale_sellpackname = resultBatchHeader.pro_sellpackname;
    item.sale_sellpack = resultBatchHeader.pro_sellpackname;

    // item.sale_DiscCen = 0;
    // item.sale_DiscSup = 0;
    item.sale_disccen = 0;
    item.sale_discsup = 0;

    // item.sale_DiscMbrCen = 0;
    // item.sale_discmbrcen = tipeMember === 'NonMember' ? 0 : (item.sale_Qty * 2 * item.sale_SalePrice) / 100
    // item.sale_discmbrsup = 0;
    item.sale_discmbrcen =
      tipeMember === "NonMember"
        ? 0
        : (item.sale_sellqty * 2 * item.sale_saleprice) / 100;
    item.sale_discmbrsup = 0;

    item.sale_vouchsupp = 0;

    // item.sale_DiscSupPct = 0;
    // item.sale_DiscCenPct = tipeMember === 'NonMember' ? 0 : 2;//todoooo
    item.sale_discsuppct = 0;
    item.sale_disccenpct = tipeMember === "NonMember" ? 0 : 2;

    // item.sale_reasonid_refund = "";
    item.sale_reasonid_refund = 0;

    item.sale_vat = resultBatchHeader.pro_vat;
    // item.sale_VAT = 2;
    item.sale_CanRefundYN = "N";
    item.sale_amount =
      item.sale_sellqty * item.sale_saleprice -
      // + (item.sale_sellqty * item.sale_SalePrice * item.sale_VAT) / 100
      (item.sale_sellqty * item.sale_disccenpct * item.sale_saleprice) / 100 -
      (item.sale_sellqty * item.sale_discmbrsup * item.sale_saleprice) / 100;
    // - (item.sale_sellqty * item.sale_DiscSpcl * item.sale_SalePrice) / 100; // todoDiskon

    var tempNewTempTransaction = [...newTempTransaction];
    tempNewTempTransaction.splice(index, 1, item);
    setNewTempTransaction(tempNewTempTransaction);

    if (newTransaction.length !== 0) {
      // console.log("1");
      var found = newTransaction.find(
        (transaction) =>
          transaction.sale_batch === item.sale_batch &&
          transaction.sale_procod === item.sale_procod
      );
      newTransaction.forEach((element) => {
        if (element.sale_procod === item.sale_procod) {
          if (element.sale_batch === item.sale_batch) {
            // console.log('item.sale_sellqty', item.sale_sellqty);
            item.sale_amount =
              (item.sale_sellqty + numberQty[index]) * item.sale_saleprice -
              // + ((item.sale_sellqty + numberQty[index]) * item.sale_SalePrice * item.sale_VAT) /  100

              ((item.sale_sellqty + numberQty[index]) *
                item.sale_disccenpct *
                item.sale_saleprice) /
                100 -
              ((item.sale_sellqty + numberQty[index]) *
                item.sale_discmbrsup *
                item.sale_saleprice) /
                100;
            // - (item.sale_sellqty * item.sale_DiscSpcl * item.sale_SalePrice) / 100; // todoDiskon;
            index = 0;
            // console.log('item.sale_Amount', item.sale_Amount);
            resultBatch.forEach((batch, i) => {
              if (batch.batch === element.sale_batch) {
                index = i;
              }
            });
            // console.log('element.sale_sellqty', element.sale_sellqty);
            element.sale_sellqty += numberQty[index];
          }
        }

        if (found === undefined) {
          // console.log("2");
          setNewTransaction([...newTransaction, item]);
          var temp = 0;
          newTransaction.forEach((transaction) => {
            temp +=
              transaction.sale_sellqty * transaction.sale_saleprice -
              // + (transaction.sale_sellqty * transaction.sale_SalePrice * transaction.sale_VAT) / 100
              (transaction.sale_sellqty *
                transaction.sale_disccenpct *
                transaction.sale_saleprice) /
                100 -
              (transaction.sale_sellqty *
                transaction.sale_discmbrsup *
                transaction.sale_saleprice) /
                100;
            // - (item.sale_sellqty * item.sale_DiscSpcl * item.sale_SalePrice) / 100; // todoDiskon
          });
          temp +=
            item.sale_sellqty * item.sale_saleprice -
            // + (item.sale_sellqty * item.sale_SalePrice * item.sale_VAT) / 100
            (item.sale_sellqty * item.sale_disccenpct * item.sale_saleprice) /
              100 -
            (item.sale_sellqty * item.sale_discmbrsup * item.sale_saleprice) /
              100;
          // - (item.sale_sellqty * item.sale_DiscSpcl * item.sale_SalePrice) / 100; // todoDiskon
          setTotal(temp);
        }
      });
    } else {
      // console.log("3");
      setNewTransaction([...newTransaction, item]);
    }

    if (newTransaction.length !== 0) {
      // console.log("4");
      if (found) {
        // console.log("5");

        var temp = 0;
        newTransaction.forEach((transaction) => {
          // console.log('transaction.sale_sellqty', transaction.sale_sellqty);
          transaction.sale_amount =
            transaction.sale_sellqty * transaction.sale_saleprice -
            // + (transaction.sale_sellqty * transaction.sale_SalePrice * transaction.sale_VAT) / 100
            (transaction.sale_sellqty *
              transaction.sale_disccenpct *
              transaction.sale_saleprice) /
              100 -
            (transaction.sale_sellqty *
              transaction.sale_discmbrsup *
              transaction.sale_saleprice) /
              100;
          // - (item.sale_sellqty * item.sale_DiscSpcl * item.sale_SalePrice) / 100; // todoDiskon

          temp +=
            transaction.sale_sellqty * transaction.sale_saleprice -
            // + (transaction.sale_sellqty * transaction.sale_SalePrice * transaction.sale_VAT) / 100
            (transaction.sale_sellqty *
              transaction.sale_disccenpct *
              transaction.sale_saleprice) /
              100 -
            (transaction.sale_sellqty *
              transaction.sale_discmbrsup *
              transaction.sale_saleprice) /
              100;
          // - (item.sale_sellqty * item.sale_DiscSpcl * item.sale_SalePrice) / 100; // todoDiskon
        });
        setTotal(temp);
      }
    } else {
      // console.log("6");
      setTotal(
        item.sale_sellqty * item.sale_saleprice -
          // + (item.sale_sellqty * item.sale_SalePrice * item.sale_VAT) / 100
          (item.sale_sellqty * item.sale_disccenpct * item.sale_saleprice) /
            100 -
          (item.sale_sellqty * item.sale_discmbrsup * item.sale_saleprice) / 100
        // - (item.sale_Qty * item.sale_DiscSpcl * item.sale_SalePrice) / 100; // todoDiskon
      );
    }
    // setTotal(
    //       item.sale_Qty * item.sale_SalePrice -
    //         // + (item.sale_Qty * item.sale_SalePrice * item.sale_VAT) / 100
    //         (item.sale_Qty * item.sale_DiscCenPct * item.sale_SalePrice) / 100 -
    //         (item.sale_Qty * item.sale_DiscMbrSup * item.sale_SalePrice) / 100
    //       // - (item.sale_Qty * item.sale_DiscSpcl * item.sale_SalePrice) / 100; // todoDiskon
    //     );

    var tempArr = [...numberQty];
    tempArr.splice(index, 1, 0);
    setNumberQty(tempArr);
  }

  useEffect(() => {
    // console.log('grand total ', total);
    if (newTransaction.length !== 0) {
      // console.log('grand total ', total);
      let calculate = total;
      setGrandTotalTransaction(calculate);
    }
  }, [total, newTransaction]);

  useEffect(() => {
    if (cashValue !== 0) {
      let calculateChange = cashValue - grandTotalTransaction;
      setKembalian(calculateChange);
      if (kembalian >= 0) {
        setBtnInsertTransaction(false);
      } else {
        setBtnInsertTransaction(true);
      }
    } else {
      setKembalian(0);
    }
  }, [grandTotalTransaction, cashValue, kembalian]);
  // useEffect(()=>{
  //     console.log("condition", kembalian>=0);
  //     if (kembalian >=0) {
  //         setBtnInsertTransaction(false)
  //     }else{
  //         setBtnInsertTransaction(true)
  //     }
  // }, [kembalian])

  // function handleChangeItem(evt, index, tipe) {
  //     let items = [...newTransaction];
  //     let item = { ...items[index] };

  //     if (tipe === "DiscMbrCen") {
  //         item.sale_DiscMbrCen = evt.target.value;
  //         item.sale_Amount = ((((item.sale_Qty * item.sale_SalePrice) + ((item.sale_Qty * item.sale_SalePrice * item.sale_VAT) / 100)) - ((item.sale_Qty * item.sale_DiscMbrCen * item.sale_SalePrice) / 100) - ((item.sale_Qty * item.sale_DiscMbrSup * item.sale_SalePrice) / 100))) //todo

  //     }
  //     if (tipe === "DiscMbrSup") {
  //         item.sale_DiscMbrSup = evt.target.value;
  //         item.sale_Amount = ((((item.sale_Qty * item.sale_SalePrice) + ((item.sale_Qty * item.sale_SalePrice * item.sale_VAT) / 100)) - ((item.sale_Qty * item.sale_DiscMbrCen * item.sale_SalePrice) / 100) - ((item.sale_Qty * item.sale_DiscMbrSup * item.sale_SalePrice) / 100))) //todo
  //     }
  //     items[index] = item;
  //     setNewTransaction(items)
  // }

  async function insertTransaction() {
    setBtnInsertTransaction(true);
    setIsLoading(true);

    var payload = {
      sale_runningid: runningID,
      sale_ptid: parseInt(PTID),
      sale_outcode: gudangID,
      sale_projectid: 0,
      sale_mbrcard: noMember,
      sale_trantotal: grandTotalTransaction,
      sale_tranpayment: cashValue,
      sale_tranchange: kembalian,
      sale_totdisccen: 0,
      sale_totdiscsup: 0,
      sale_totdiscmbrcen: 0,
      sale_totdiscbbrsup: 0,
      sale_trancashout: 0,
      sale_totvouchcen: 0,
      sale_totvouchsup: 0,
      sale_salesperson: nipUser,
      sale_rounding: pembulatan,
      sale_deliverynumber: "",
      sale_deliverydate: "",
      sale_orderidecommerce: "",
      sale_prevrounding: pembulatan,
      sale_paymentmethod: parseInt(paymentType),
      sale_cardnumber: ccNumber,
      sale_hostkdkartu: parseInt(paymentTypeHost),
      sale_recipenum: "",
      sale_urlprescription: "",
      sale_extradisc: 0,
      sale_outletb2b: "",

      faktur: {
        fak_sellername: "",
        fak_addressseller: "",
        fak_npwpselle: "",
        fak_buyername: "",
        fak_addressbuyer: "",
        fak_npwpbuyer: "",
      },
      refund: {
        sale_refundyn: "",
        sale_oldtrannum: "",
        sale_nosuratjalan: "",
      },
      detail: newTransaction,
    };
    console.log("payload", payload);
    try {
      const insert = await api.insertTransaction(payload);
      console.log("insert", insert.status);
      if (insert.status === 200) {
        setIsLoading(false);
        // setResponseHeader(language === "ID" ? "BERHASIL!" : "SUCCESS!");
        setResponseHeader("SUCCESS!");

        setNewTransaction([]);
        setNumberQty([]);
        setResponseModalIsOpen(true);
        resetAll();
        toggleModalSaveClosed();
      } else {
        setIsLoading(false);
        // setResponseHeader(language === "ID" ? "GAGAL!" : "FAILED!");
        setResponseHeader("FAILED!");
        setResponseModalIsOpen(true);
        toggleModalSaveClosed();
      }
    } catch (error) {
      alert(error);
      setIsLoading(false);
      toggleModalSaveClosed();
    }
  }

  async function printHistoryStruk() {
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
      trannum: strookNumber,
    };
    setIsLoading(true);
    try {
      const printStrook = await api.printHistoryStruk(
        PTID,
        gudangID,
        strookNumber
      );

      const url = printStrook.config.baseURL + printStrook.config.url;
      fetch(url).then((response) => {
        if (response.status === 200) {
          response.blob().then((blob) => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = strookNumber + ".pdf";
            a.click();
            setIsLoading(false);
            const pdfWindow = window.open();
            pdfWindow.location.href = a;
          });
        }
      });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    if (inputSearch.length === 7) {
      setMatch(true);
    } else if (inputSearch.length === 12) {
      setMatch(true);
      setDisableResep(true);
    } else if (inputSearch.length === 15) {
      setMatch(true);
    } else {
      setMatch(false);
    }
  }, [inputSearch]);

  function keydownjumlah(e) {
    switch (e.key) {
      case "Enter":
        toggleTransferClosed();
        break;
      default:
    }
  }

  function deleteNewTrans(index) {
    var tempDeletedItem =
      index.sale_sellqty * index.sale_saleprice -
      (index.sale_sellqty * index.sale_disccenpct * index.sale_saleprice) /
        100 -
      (index.sale_sellqty * index.sale_discmbrsup * index.sale_saleprice) / 100;
    var tempGrandTotal = grandTotalTransaction - tempDeletedItem;
    setTotal(tempGrandTotal);
    setGrandTotalTransaction(tempGrandTotal);
    var tempArr = [...newTransaction];
    var target = index;
    var tempsArr = tempArr.filter((item) => item !== target);
    setNewTransaction(tempsArr);
    if (newTransaction.length === 1) {
      //klo newtrans 0
      setPembulatan(0);
      setGrandTotalTransaction(0);
      setKembalian(0);
      setCashValue(0);
      setBtnInsertTransaction(true);
      setTotal(0);
    }
  }

  function buttonDisabler(e) {
    setDisableSearch(false);
    setDisabledSelectedCategory(false);
    setDisableResep(false);
  }

  function keyPressHandle(e) {
    switch (e.key) {
      case "Enter":
        setResponseModalIsOpen(false);
        break;
      default:
    }
  }

  useEffect(() => {
    if (selectedCategory === "b") {
      setInputSearch("");
      setDisableResep(true);
      setSeeResep(false);
    } else if (selectedCategory === "p") {
      setInputSearch("");
      setDisableResep(true);
      setSeeResep(false);
    } else if (selectedCategory === "h") {
      setInputSearch("");
      setSeeResep(true);
    }
  }, [selectedCategory]);

  // useEffect(() => {
  //   // if (userID === "") {
  //   //   history.push("/login");
  //   // } else {
  //   debounceMountPOS(PTID, gudangID);
  //   // }
  // }, []);

  const debounceMountPOS = useCallback(
    debounce(mountGetHistoryTransactions, 400)
  );

  async function mountGetHistoryTransactions() {
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
    };
    setIsLoading(true);

    try {
      const getHistory = await api.getHistoryTransactions(newParams);
      const { data } = getHistory.data;
      setResultHistory([data]);
      setStrookNumber(data.sale_trannum);
      setDateTrandHistory(data.sale_trandate);
      if (data.sale_mbrcard !== "") {
        setTipeMember("Member");
        setNamaMember(data.sale_mbrName);
        setHideNOMember(false);
      }
      setIsLoading(false);
    } catch (error) {
      setStrookNumber("-");
      setResponseHeader("HISTORY NOT FOUND !!!");
      setResponseBody("");
      setResponseModalIsOpen(true);
      setResultHistoryHeader([]);
      setResultHistory([]);

      setResultHistoryDetail([]);
      setIsLoading(false);
    }
  }

  const debounceMountGetProductByProcode = useCallback(
    debounce(getProductByProcode, 400)
  );
  async function getProductByProcode() {
    const newParams = {
      outcode: gudangID,
      procode: inputSearch,
    };
    setIsLoading(true);
    try {
      const getProductByProcode = await api.getProductByProcode(newParams);
      const { data } = getProductByProcode.data;
      if (data !== null && data !== undefined) {
        if (data.stock !== null) {
          setIsLoading(false);
          setResultBatch(data.stock);
          numberQty.fill(0, 0, data.stock.length);
          newTempTransaction.fill(0, 0, data.stock.length);
          setResultBatchHeader(data);
          toggleBatch();
          // toggleMembershipModal()
        } else if (data.stock === null) {
          setIsLoading(false);
          setResultBatchHeader(data);
          toggleBatch();
        } else {
          setIsLoading(false);
          setResultBatch([]);
          setResponseHeader("NOT FOUND !!!");
          setResponseModalIsOpen(true);
        }
      } else {
        // setResponseHeader(response.data.error.msg)
        // setResponseModalIsOpen(true)
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setResponseModalIsOpen(true);
      setResponseHeader("FAILED TO LOAD DATA");
      setResponseBody(error.message);
    }
  }

  const debounceMountGetProductByBarcode = useCallback(
    debounce(getProductByBarcode, 400)
  );

  async function getProductByBarcode() {
    const newParams = {
      outcode: gudangID,
      barcode: inputSearch,
    };
    setIsLoading(true);
    try {
      const getProductByBarcode = await api.getProductByBarcode(newParams);
      const { data } = getProductByBarcode.data;
      if (data !== null) {
        if (data.stock !== null) {
          setResultBatch(data.stock);
          numberQty.fill(0, 0, data.stock.length);
          newTempTransaction.fill(0, 0, data.stock.length);
          setResultBatchHeader(data);
          toggleBatch();
          // toggleMembershipModal()
          setIsLoading(false);
        } else if (data.stock === null) {
          setResultBatchHeader(data);
          toggleBatch();
          setIsLoading(false);
        } else {
          setResultBatch([]);
          // setResponseHeader(
          //   language === "ID" ? "TIDAK DITEMUKAN !!!" : "NOT FOUND !!!"
          // );
          setResponseHeader("DATA STOCK NOT FOUND !!!");
          setResponseModalIsOpen(true);
          setIsLoading(false);
        }
      } else {
        setResponseHeader("FAILED TO LOAD DATA");
        setResponseBody("NO DATA");
        setResponseModalIsOpen(true);
        setIsLoading(false);
      }
      if (getProductByBarcode.data.error.code === 500) {
        setResponseHeader("FAILED TO LOAD DATA");
        setResponseBody("Response Error 500");
        setResponseModalIsOpen(true);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setResponseHeader("FAILED TO LOAD DATA");
      setResponseBody(error.message);
      setResponseModalIsOpen(true);
    }
  }

  async function findHistoryTransactions() {
    setIsLoading(true);
    const newParams = {
      ptid: PTID,
      outcode: gudangID,
      notranno: inputSearch,
    };
    try {
      const findHistory = await api.findHistoryTransactions(newParams);
      const { data } = findHistory.data;
      if (data !== null) {
        if (data) {
          setResultHistory(data);
          setStrookNumber(data[0].sale_trannum);
          setDateTrandHistory(data[0].sale_trandate);
          if (data[0].sale_mbrcard !== "") {
            setTipeMember("Member");
            setNamaMember(sale_mbrname);
            setHideNOMember(false);
          }
          setIsLoading(false);
        } else {
          setStrookNumber("-");
          setResponseHeader("HISTORY NOT FOUND !!!");
          setResponseBody("");
          setResponseModalIsOpen(true);
          setResultHistoryHeader([]);
          setResultHistory([]);
          setResultHistoryDetail([]);
          setIsLoading(false);
        }
      } else {
        setResponseHeader("HISTORY NOT FOUND !!!");
        setResponseBody("");
        setResponseModalIsOpen(true);
        setResultHistoryHeader([]);
        setResultHistory([]);
        setResultHistoryDetail([]);
        setIsLoading(false);
      }
    } catch (error) {
      alert(error.message);
      setIsLoading(false);
    }
  }

  async function getPaymentType() {
    const newParams = {
      outcode: gudangID,
    };
    setIsLoading(true);
    try {
      const getPaymentType = await api.getPaymentType(newParams);
      console.log("getPaymentType", getPaymentType);
      if (getPaymentType.data.data !== null) {
        setPaymentOption(getPaymentType.data.data);
        setIsLoading(false);
        setModalTransfer(!modalTransfer);
      } else {
        setResponseHeader(getPaymentType.data.error.msg);
        setResponseModalIsOpen(true);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setResponseModalIsOpen(true);
      setResponseHeader("FAILED TO GET DATA !!!");
      setResponseBody(error.message);
    }
  }

  function apiChecker(e) {
    switch (e.key) {
      case "Enter":
        if (selectedCategory === "b") {
          getProductByBarcode();
        } else if (selectedCategory === "p") {
          debounceMountGetProductByProcode();
        } else if (selectedCategory === "h") {
          findHistoryTransactions();
        }
        break;
      default:
    }
    if (e.button === 0) {
      if (selectedCategory === "b") {
        getProductByBarcode();
      } else if (selectedCategory === "p") {
        debounceMountGetProductByProcode();
      } else if (selectedCategory === "h") {
        findHistoryTransactions();
      }
    }
  }
  function generateRunningID() {
    var dates = formatDate(today, "YYYYMMDDhhmmsssss");

    setRunningID(gudangID + dates);
  }
  function handleMouseDownSearch(e) {
    // if (e.buttons == 1) {
    if (inputSearch === "" || inputSearch === " ") {
      setValidationError(true);
    } else {
      setValidationError(false);
    }
    // }
  }

  useEffect(() => {
    if (inputSearch === "" || inputSearch === " ") {
      setValidationError(true);
    } else {
      setValidationError(false);
    }
  }, [inputSearch]);

  function handleBlurSearch() {
    setValidationError(false);
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

  function proses() {
    setNextPage("N");
  }

  function back() {
    setNextPage("Y");
  }

  return (
    <>
      {
        nextPage === "Y" ? (
          <Box sx={{ width: "100%", p: 3 }}>
            <Grid
              container
              justifyContent={"space-between"}
              sx={{ marginBottom: "1%" }}
            >
              <Grid container item xs={10}>
                <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
                  POLA PEMBELIAN KONSUMEN
                </Typography>
              </Grid>
            </Grid>

            {/* <Paper sx={{ mt: 2 }} elevation={6}> */}
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: "55vh" }}
            >
              <Grid>
                <Typography sx={{ ml: 2, fontWeight: 700 }}>
                  Input Periode Tanggal
                </Typography>
              </Grid>
              <Divider sx={{ borderBottomWidth: 3, ml: 2, mr: 2 }} />
              <Grid item xs={6}>
                <Grid container sx={{ m: 1 }}>
                  <ModalInputWrapper
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      width: "9em",
                    }}
                  >
                    <Typography variant="body1" sx={{ p: 1, fontWeight: 400 }}>
                      Periode Awal
                    </Typography>
                  </ModalInputWrapper>
                  {/* <TextField
              sx={{ width: "60%" }}
              size="small"
              disabled
              value={date + " " + time}
            ></TextField> */}
                  <DesktopDatePicker
                    // label="Periode Awal"
                    // value={selectedStartDatePPNOUT}
                    // onChange={(newValue) => {
                    //   setSelectedStartDatePPNOUT(newValue);
                    // }}
                    renderInput={(params) => (
                      <TextField
                        // layout="responsive"
                        size="small"
                        {...params}
                        sx={{
                          background: "white",
                          // mr: 1,
                          // width: "14vw",
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* <Grid
            item
            // style={{ flexBasis: mx600 ? "45%" : "23%" }}
            // className={Style.items}
            // flex={0}
          >
            <DesktopDatePicker
              label="Periode Awal"
              // value={selectedStartDatePPNOUT}
              // onChange={(newValue) => {
              //   setSelectedStartDatePPNOUT(newValue);
              // }}
              renderInput={(params) => (
                <TextField
                  // layout="responsive"
                  size="small"
                  {...params}
                  sx={{
                    background: "white",
                    // mr: 1,
                    // width: "14vw",
                  }}
                />
              )}
            />
          </Grid> */}

                {resultHistory.length !== 0 ? (
                  <Grid container sx={{ m: 1 }}>
                    <ModalInputWrapper
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        width: "9em",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ p: 1, fontWeight: 400 }}
                      >
                        Transaction Date
                      </Typography>
                    </ModalInputWrapper>
                    <TextField
                      sx={{ width: "60%" }}
                      size="small"
                      disabled
                      value={formatDate(
                        resultHistory[0].sale_trandate,
                        "dddd, DD MMMM YYYY HH:mm:ss"
                      )}
                    ></TextField>
                  </Grid>
                ) : null}

                <Grid container sx={{ m: 1 }}>
                  <ModalInputWrapper
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      width: "9em",
                    }}
                  >
                    <Typography variant="body1" sx={{ p: 1, fontWeight: 400 }}>
                      Periode Akhir
                    </Typography>
                  </ModalInputWrapper>
                  {/* <TextField
              sx={{ width: "60%" }}
              size="small"
              disabled
              value={tipeMember}
            ></TextField> */}
                  <DesktopDatePicker
                    // label="Periode Awal"
                    // value={selectedStartDatePPNOUT}
                    // onChange={(newValue) => {
                    //   setSelectedStartDatePPNOUT(newValue);
                    // }}
                    renderInput={(params) => (
                      <TextField
                        // layout="responsive"
                        size="small"
                        {...params}
                        sx={{
                          background: "white",
                          // mr: 1,
                          // width: "14vw",
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid
                  item
                  // style={{ flexBasis: mx600 ? "45%" : "23%" }}
                  // className={Style.items}
                  // flex={0}
                  // float="center"
                  textAlign="center"
                  mt={2}
                >
                  <Button
                    variant="contained"
                    sx={{
                      // my: 1.2,
                      // ml: 4,
                      backgroundColor: "green",
                      // width: "1vw",
                      // fontWeight: 600,
                      // float: "right",

                      // padding:5
                    }}
                    // onClick={() =>
                    //   debounceMountGeneratePPNOUT(
                    //     formatDate(selectedStartDatePPNOUT, "YYYYMMDD"),
                    //     formatDate(selectedEndDatePPNOUT, "YYYYMMDD")
                    //   )
                    // }
                    // disabled={validationProses}
                    onClick={() => proses()}
                  >
                    PROSES
                  </Button>
                </Grid>
              </Grid>

              {/* <Grid>
          <Typography sx={{ ml: 2, fontWeight: 700 }}>
            Input Periode Tanggal
          </Typography>
        </Grid>

        <Table size="small" sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              {tableHeader &&
                tableHeader.map((head, index) => (
                  <TableCell
                    sx={{
                      fontWeight: "600",
                    }}
                    key={index}
                  >
                    {head.name}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {newTransaction &&
              newTransaction.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {item.sale_procod === "" || item.sale_procod === null
                      ? "-"
                      : item.sale_procod}{" "}
                  </TableCell>
                  <TableCell sx={{ textAlign: "left" }}>
                    {item.sale_proname === "" || item.sale_proname === null
                      ? "-"
                      : item.sale_proname}
                  </TableCell>
                  <TableCell sx={{ textAlign: "left" }}>
                    {item.sale_batch === "" || item.sale_batch === null
                      ? "-"
                      : item.sale_batch}
                  </TableCell>
                  <TableCell sx={{ textAlign: "left" }}>
                    {item.sale_sellqty === "" || item.sale_sellqty === null
                      ? "-"
                      : item.sale_sellqty}
                  </TableCell>
                  <TableCell sx={{ textAlign: "left" }}>
                    {item.sale_sellpack === "" || item.sale_sellpack === null
                      ? "-"
                      : item.sale_sellpack}
                  </TableCell>
                  <TableCell sx={{ textAlign: "left" }}>
                    {item.sale_saleprice === "" || item.sale_saleprice === null
                      ? "-"
                      : item.sale_saleprice}
                  </TableCell>
                  <TableCell>
                    {item.sale_disccenpct === "" ||
                    item.sale_disccenpct === null
                      ? "-"
                      : item.sale_disccenpct}
                    {"%"}
                  </TableCell>
                  <TableCell>
                    {item.sale_discmbrcen === "" ||
                    item.sale_discmbrcen === null
                      ? "-"
                      : (item.sale_sellqty *
                          item.sale_disccenpct *
                          item.sale_saleprice) /
                        100}
                  </TableCell>
                  <TableCell>
                    {item.sale_discmbrsup === "" ||
                    item.sale_discmbrsup === null
                      ? "-"
                      : item.sale_discmbrsup}
                    {"%"}
                  </TableCell>
                  <TableCell>
                    {item.sale_discmbrsup === "" ||
                    item.sale_discmbrsup === null
                      ? "-"
                      : (item.sale_sellqty *
                          item.sale_discmbrsup *
                          item.sale_saleprice) /
                        100}
                  </TableCell>
                  <TableCell>
                    {item.sale_amount === "" || item.sale_amount === null
                      ? "-"
                      : item.sale_sellqty * item.sale_saleprice -
                        (item.sale_sellqty *
                          item.sale_disccenpct *
                          item.sale_saleprice) /
                          100 -
                        (item.sale_sellqty *
                          item.sale_discmbrsup *
                          item.sale_saleprice) /
                          100}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={(e) => deleteNewTrans(item, index)}
                      color="error"
                    >
                      {<DeleteIcon />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table> */}
            </Grid>
            {/* </Paper> */}
            <Modal closeOnBackdrop={false} open={modalBatch}>
              <ModalWrapper sx={{ height: "50%" }}>
                <Grid>
                  <Typography sx={{ mb: 2 }} align="center" variant="h5">
                    LIST BATCH NUMBER
                  </Typography>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                  }}
                  display={"flex"}
                >
                  <ModalInputWrapper
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      width: "12em",
                    }}
                  >
                    <Typography
                      fullWidth
                      variant="body1"
                      sx={{ p: 1, fontWeight: 600 }}
                    >
                      Product Name
                    </Typography>
                  </ModalInputWrapper>
                  <TextField
                    size="small"
                    fullWidth
                    disabled
                    value={resultBatchHeader.pro_name}
                  ></TextField>
                </Box>
                <Box
                  sx={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                  }}
                  display={"flex"}
                >
                  <ModalInputWrapper
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      width: "12em",
                    }}
                  >
                    <Typography
                      fullWidth
                      variant="body1"
                      sx={{ p: 1, fontWeight: 600 }}
                    >
                      Sale Pack
                    </Typography>
                  </ModalInputWrapper>
                  <TextField
                    size="small"
                    fullWidth
                    disabled
                    value={resultBatchHeader.pro_sellpackname}
                  ></TextField>
                </Box>

                <Box>
                  <Table size="small" sx={{ mt: 2 }}>
                    <TableHead>
                      <TableRow>
                        {fieldsbatch &&
                          fieldsbatch.map((head, index) => (
                            <TableCell
                              sx={{
                                fontWeight: "600",
                              }}
                              key={index}
                            >
                              {head.name}
                            </TableCell>
                          ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {resultBatch &&
                        resultBatch.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {item.batch === "" || item.batch === null
                                ? "-"
                                : item.batch}{" "}
                            </TableCell>
                            <TableCell sx={{ textAlign: "left" }}>
                              {item.expired_date === "" ||
                              item.expired_date === null
                                ? "-"
                                : item.expired_date.substring(0, 10)}
                            </TableCell>
                            <TableCell sx={{ textAlign: "left" }}>
                              {item.qty === "" || item.qty === null
                                ? "-"
                                : item.qty}
                            </TableCell>
                            <TableCell sx={{ textAlign: "left" }}>
                              <TextField
                                size="small"
                                type="number"
                                onChange={(evt) =>
                                  handleChangeQty(item, index, evt)
                                }
                                onKeyPress={(evt) =>
                                  keyPresshandleChangeQty(item, index, evt)
                                }
                                value={numberQty[index]}
                              ></TextField>
                            </TableCell>

                            <TableCell>
                              <Button
                                variant="contained"
                                disabled={
                                  numberQty[index] > item.qty ||
                                  numberQty[index] === 0 ||
                                  numberQty.length === 0 ||
                                  numberQty[index] < 0
                                }
                                id={`btnOke${item.batch}`}
                                color="primary"
                                onClick={() => doneChangeQty(item, index)}
                              >
                                OK
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Box>

                <Box sx={{ mt: 4, textAlign: "center" }}>
                  <Button
                    sx={{ ml: 1 }}
                    variant="contained"
                    color="error"
                    onClick={() => toggleBatchClosed()}
                  >
                    Cancel
                  </Button>
                </Box>
              </ModalWrapper>
            </Modal>
            {/* modalbatch */}
            {/* response */}
            <Modal open={responseModalIsOpen}>
              <Box sx={style}>
                <Grid textAlign="center">
                  <Typography>{responseHeader}</Typography>
                </Grid>
                <Grid mt={2} mb={2}>
                  <Divider />
                </Grid>
                <Grid textAlign="center">
                  <Typography>{responseBody}</Typography>
                </Grid>
                <Grid textAlign="center" mt={2}>
                  <Button
                    onClick={toggleCloseSaveModal.bind(this)}
                    variant="contained"
                    color="error"
                  >
                    Close
                  </Button>
                </Grid>
              </Box>
            </Modal>
            {/* response */}

            {/* nametag */}
            <Modal closeOnBackdrop={false} open={ScanNameTagModal}>
              {/* <ModalWrapper sx={{ height: "50%", width: "50%" }}> */}
              <Box sx={style}>
                <Grid>
                  <Typography sx={{ mb: 2 }} align="center" variant="h5">
                    Sales Person
                  </Typography>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                  SCAN BARCODE ON YOUR NAMETAG
                </Typography>
                <Box
                  sx={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                  }}
                  display={"flex"}
                >
                  <ModalInputWrapper
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      width: "8em",
                    }}
                  >
                    <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                      NIP
                    </Typography>
                  </ModalInputWrapper>
                  <TextField
                    fullWidth
                    disabled={scannedNameTag}
                    onChange={onChangeNameTag}
                    onKeyDown={onChangeNameTag}
                    onBlur={onChangeNameTag}
                    value={nipUser}
                    type="text"
                    placeholder="SCAN"
                    autoComplete="off"
                  ></TextField>
                </Box>
                <Grid>
                  <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Button
                      sx={{ ml: 1 }}
                      variant="contained"
                      color="error"
                      onClick={closedtoggleScanNameTag.bind(this)}
                    >
                      CANCEL
                    </Button>
                  </Box>

                  <Collapse in={hideNOMemberModal}>
                    <Box
                      sx={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                      }}
                      display={"flex"}
                    >
                      <ModalInputWrapper
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                          width: "8em",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ p: 1, fontWeight: 600 }}
                        >
                          Member ID
                        </Typography>
                      </ModalInputWrapper>
                      <TextField
                        fullWidth
                        disabled={scanned}
                        onChange={onChangeBarcode}
                        onKeyDown={onChangeBarcode}
                        onBlur={onChangeBarcode}
                        value={noMember}
                        type="text"
                        placeholder="SCAN MEMBER ID"
                        autoComplete="off"
                      ></TextField>
                    </Box>
                    <Box sx={{ mt: 4, textAlign: "center" }}>
                      <Button
                        sx={{ ml: 1 }}
                        variant="contained"
                        color="error"
                        disabled // todo member
                        onClick={toggleOKMembershipModal.bind(this)}
                      >
                        OK
                      </Button>
                    </Box>
                  </Collapse>
                </Grid>
                {/* </ModalWrapper> */}
              </Box>
            </Modal>
            {/* nametag */}

            {/* membership */}
            <Modal closeOnBackdrop={false} open={MembershipModalIsOpen}>
              {/* <ModalWrapper sx={{ height: "30%", width: "50%" }}> */}
              <Box sx={style} style={{ textAlign: "center" }}>
                <Grid>
                  <Typography sx={{ mb: 2 }} align="center" variant="h5">
                    MEMBERSHIP
                  </Typography>
                </Grid>
                <Divider sx={{ my: 2 }} />

                <Collapse in={konfirmasiMember}>
                  <Grid container sx={{ justifyContent: "center" }}>
                    <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                      THIS IS MEMBER TRANSACTIONS?
                    </Typography>
                  </Grid>

                  <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Button
                      sx={{ ml: 1 }}
                      variant="contained"
                      color="success"
                      onClick={toggleOpenMembershipModalTESTING.bind(this)}
                    >
                      YES
                    </Button>
                    <Button
                      sx={{ ml: 1 }}
                      variant="contained"
                      color="error"
                      onClick={toggleNotMembershipModal.bind(this)}
                    >
                      NO
                    </Button>
                  </Box>
                </Collapse>

                <Collapse in={hideNOMemberModal}>
                  <Box
                    sx={{
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                    }}
                    display={"flex"}
                  >
                    <ModalInputWrapper
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        width: "8em",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ p: 1, fontWeight: 600 }}
                      >
                        Member ID
                      </Typography>
                    </ModalInputWrapper>
                    <TextField
                      fullWidth
                      disabled={scanned}
                      onChange={onChangeBarcode}
                      onKeyDown={onChangeBarcode}
                      onBlur={onChangeBarcode}
                      // onKeyDown={(e) => onkeydownMemberID(e)}
                      value={noMember}
                      type="text"
                      placeholder="SCAN MEMBER ID"
                      autoComplete="off"
                    ></TextField>
                  </Box>
                  <Grid>
                    <Box sx={{ mt: 4, textAlign: "center" }}>
                      <Button
                        sx={{ ml: 1 }}
                        variant="contained"
                        color="error"
                        onClick={toggleOKMembershipModal.bind(this)}
                      >
                        OK
                      </Button>
                    </Box>
                  </Grid>
                </Collapse>
              </Box>
              {/* </ModalWrapper> */}
            </Modal>
            {/* membership */}

            {/* payment */}
            <Modal closeOnBackdrop={false} open={modalTransfer}>
              <Box sx={style}>
                {/* <ModalWrapper sx={{ height: "100%", width: "50%" }}> */}
                <Grid>
                  <Typography sx={{ mb: 2 }} align="center" variant="h5">
                    TYPE OF PAYMENT
                  </Typography>
                </Grid>
                <Divider sx={{ my: 2 }} />

                <Grid container textAlign="center">
                  <ModalInputWrapper
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      width: "10em",
                    }}
                  >
                    <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                      METHOD
                    </Typography>
                  </ModalInputWrapper>
                  <Select
                    fullWidth
                    sx={{ width: "50%" }}
                    defaultValue="Choose"
                    value={paymentType}
                    onChange={(e) => onChangePaymentOption(e)}
                  >
                    {paymentOption &&
                      paymentOption.map((todo, i) => {
                        return (
                          <option key={i} value={todo.pay_code}>
                            {todo.pay_name}
                          </option>
                        );
                      })}
                  </Select>
                </Grid>

                <Grid container>
                  <ModalInputWrapper
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      width: "10em",
                    }}
                  >
                    <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                      AMOUNT
                    </Typography>
                  </ModalInputWrapper>
                  <TextField
                    fullWidth
                    sx={{ width: "50%" }}
                    type="number"
                    placeholder={"INPUT AMOUNT"}
                    autoComplete="off"
                    onChange={(e) => setCashValue(Number(e.target.value))}
                    value={cashValue}
                    onKeyDown={(e) => keydownjumlah(e)}
                  ></TextField>
                </Grid>

                <Grid hidden={showVoucherMethod} container>
                  <ModalInputWrapper
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      width: "10em",
                    }}
                  >
                    <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                      VOUCHER
                    </Typography>
                  </ModalInputWrapper>
                  <TextField
                    sx={{ width: "50%" }}
                    type="text"
                    fullWidth
                    placeholder={"INPUT VOUCHER CODE"}
                    autoComplete="off"
                  ></TextField>
                </Grid>

                <Grid hidden={showCreditMethod} container>
                  <ModalInputWrapper
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      width: "10em",
                    }}
                  >
                    <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                      CARD NUMBER
                    </Typography>
                  </ModalInputWrapper>
                  <TextField
                    sx={{ width: "50%" }}
                    type="text"
                    fullWidth
                    value={ccNumber}
                    onChange={formatAndSetCcNumber}
                    placeholder={"INPUT CARD NUMBER"}
                    autoComplete="off"
                  ></TextField>
                </Grid>

                <Grid>
                  <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Button
                      disabled={
                        grandTotalTransaction > cashValue || cashValue === 0
                      }
                      onClick={() => toggleTransferClosed()}
                      variant="contained"
                    >
                      DONE
                    </Button>
                  </Box>
                </Grid>
                {/* </ModalWrapper> */}
              </Box>
            </Modal>
            {/* payment */}

            {/* save */}
            <Modal closeOnBackdrop={false} open={modalSave}>
              <ModalWrapper sx={{ height: "25%", width: "50%" }}>
                <Grid
                  container
                  sx={{ justifyContent: "center", textAlign: "center" }}
                >
                  <Typography
                    sx={{ mb: 2 }}
                    align="center"
                    textAlign="center"
                    variant="h5"
                  >
                    ARE YOU SURE WANT TO SAVE THIS TRANSACTION?
                  </Typography>
                </Grid>
                <Divider sx={{ my: 2 }} />

                <Grid textAlign="center">
                  {/* <Box sx={{ mt: 1, textAlign: "center" }}> */}

                  {/* </Box> */}

                  <Button
                    sx={{ ml: 2 }}
                    variant="contained"
                    disabled={btnInsertTransaction}
                    color="info"
                    onClick={() => insertTransaction()}
                  >
                    YES
                  </Button>
                  <Button
                    sx={{ ml: 2 }}
                    variant="contained"
                    color="error"
                    onClick={toggleModalSaveClosed.bind(this)}
                  >
                    NO
                  </Button>
                  {/* </Box> */}
                </Grid>
              </ModalWrapper>
            </Modal>
            {/* save */}

            <Modal open={isLoading}>
              <Box sx={style} style={{ textAlign: "center" }}>
                <CircularProgress>PLEASE WAIT...</CircularProgress>
              </Box>
            </Modal>

            <Modal open={modalUploadFilesIsOpen}>
              <Box sx={style}>
                <Typography>Upload</Typography>
                <Grid mt={2} mb={2}>
                  <Divider fullWidth></Divider>
                </Grid>
                <div>
                  <input
                    type="file"
                    name="file"
                    onChange={changeHandler}
                  ></input>
                  {isSelected ? (
                    <div>
                      <img
                        src={selectedFile}
                        style={{ widht: "30px", height: "30px" }}
                        alt="description"
                      />
                    </div>
                  ) : (
                    <p>Select a file to show details</p>
                  )}
                </div>

                <Button onClick={handleSubmission}>SUBMIT</Button>
                <Button onClick={toggleModalUploadClose.bind(this)}>OK</Button>
              </Box>
            </Modal>
          </Box>
        ) : (
          <Box sx={{ width: "100%", p: 3 }}>
            <Grid
              container
              justifyContent={"space-between"}
              sx={{ marginBottom: "1%" }}
            >
              <Grid container item xs={10}>
                <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
                  POLA PEMBELIAN KONSUMEN
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent={"space-between"}
              sx={{ marginBottom: "1%" }}
            >
              <Grid
                item
                // style={{ flexBasis: mx600 ? "45%" : "23%" }}
                // className={Style.items}
                // flex={0}
                // float="center"
                // textAlign="center"
                mt={2}
              >
                <Button
                  variant="contained"
                  sx={{
                    // my: 1.2,
                    // ml: 4,
                    backgroundColor: "green",
                    // width: "1vw",
                    // fontWeight: 600,
                    // float: "right",

                    // padding:5
                  }}
                  // onClick={() =>
                  //   debounceMountGeneratePPNOUT(
                  //     formatDate(selectedStartDatePPNOUT, "YYYYMMDD"),
                  //     formatDate(selectedEndDatePPNOUT, "YYYYMMDD")
                  //   )
                  // }
                  // disabled={validationProses}
                  onClick={() => back()}
                >
                  <IconButton>
                    <ArrowBackIcon />
                  </IconButton>
                </Button>
              </Grid>
            </Grid>

            {/* <Paper sx={{ mt: 2 }} elevation={6}> */}
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{ minHeight: "55vh" }}
            >
              <Grid>
                <Typography sx={{ ml: 2, fontWeight: 700 }}>
                  Barang yang sering dibeli Konsumen
                </Typography>
              </Grid>
              <Divider sx={{ borderBottomWidth: 3, ml: 2, mr: 2 }} />
              <Grid item xs={6}>
                <Table size="small" sx={{ mt: 2 }}>
                  <TableHead>
                    <TableRow>
                      {tableHeader &&
                        tableHeader.map((head, index) => (
                          <TableCell
                            sx={{
                              fontWeight: "600",
                            }}
                            key={index}
                          >
                            {head.name}
                          </TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {newTransaction &&
                      newTransaction.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {item.sale_procod === "" ||
                            item.sale_procod === null
                              ? "-"
                              : item.sale_procod}{" "}
                          </TableCell>
                          <TableCell sx={{ textAlign: "left" }}>
                            {item.sale_proname === "" ||
                            item.sale_proname === null
                              ? "-"
                              : item.sale_proname}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Grid>

              {/* <Grid>
          <Typography sx={{ ml: 2, fontWeight: 700 }}>
            Input Periode Tanggal
          </Typography>
        </Grid>

        <Table size="small" sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              {tableHeader &&
                tableHeader.map((head, index) => (
                  <TableCell
                    sx={{
                      fontWeight: "600",
                    }}
                    key={index}
                  >
                    {head.name}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {newTransaction &&
              newTransaction.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {item.sale_procod === "" || item.sale_procod === null
                      ? "-"
                      : item.sale_procod}{" "}
                  </TableCell>
                  <TableCell sx={{ textAlign: "left" }}>
                    {item.sale_proname === "" || item.sale_proname === null
                      ? "-"
                      : item.sale_proname}
                  </TableCell>
                  <TableCell sx={{ textAlign: "left" }}>
                    {item.sale_batch === "" || item.sale_batch === null
                      ? "-"
                      : item.sale_batch}
                  </TableCell>
                  <TableCell sx={{ textAlign: "left" }}>
                    {item.sale_sellqty === "" || item.sale_sellqty === null
                      ? "-"
                      : item.sale_sellqty}
                  </TableCell>
                  <TableCell sx={{ textAlign: "left" }}>
                    {item.sale_sellpack === "" || item.sale_sellpack === null
                      ? "-"
                      : item.sale_sellpack}
                  </TableCell>
                  <TableCell sx={{ textAlign: "left" }}>
                    {item.sale_saleprice === "" || item.sale_saleprice === null
                      ? "-"
                      : item.sale_saleprice}
                  </TableCell>
                  <TableCell>
                    {item.sale_disccenpct === "" ||
                    item.sale_disccenpct === null
                      ? "-"
                      : item.sale_disccenpct}
                    {"%"}
                  </TableCell>
                  <TableCell>
                    {item.sale_discmbrcen === "" ||
                    item.sale_discmbrcen === null
                      ? "-"
                      : (item.sale_sellqty *
                          item.sale_disccenpct *
                          item.sale_saleprice) /
                        100}
                  </TableCell>
                  <TableCell>
                    {item.sale_discmbrsup === "" ||
                    item.sale_discmbrsup === null
                      ? "-"
                      : item.sale_discmbrsup}
                    {"%"}
                  </TableCell>
                  <TableCell>
                    {item.sale_discmbrsup === "" ||
                    item.sale_discmbrsup === null
                      ? "-"
                      : (item.sale_sellqty *
                          item.sale_discmbrsup *
                          item.sale_saleprice) /
                        100}
                  </TableCell>
                  <TableCell>
                    {item.sale_amount === "" || item.sale_amount === null
                      ? "-"
                      : item.sale_sellqty * item.sale_saleprice -
                        (item.sale_sellqty *
                          item.sale_disccenpct *
                          item.sale_saleprice) /
                          100 -
                        (item.sale_sellqty *
                          item.sale_discmbrsup *
                          item.sale_saleprice) /
                          100}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={(e) => deleteNewTrans(item, index)}
                      color="error"
                    >
                      {<DeleteIcon />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table> */}
            </Grid>
            {/* </Paper> */}
            <Modal closeOnBackdrop={false} open={modalBatch}>
              <ModalWrapper sx={{ height: "50%" }}>
                <Grid>
                  <Typography sx={{ mb: 2 }} align="center" variant="h5">
                    LIST BATCH NUMBER
                  </Typography>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                  }}
                  display={"flex"}
                >
                  <ModalInputWrapper
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      width: "12em",
                    }}
                  >
                    <Typography
                      fullWidth
                      variant="body1"
                      sx={{ p: 1, fontWeight: 600 }}
                    >
                      Product Name
                    </Typography>
                  </ModalInputWrapper>
                  <TextField
                    size="small"
                    fullWidth
                    disabled
                    value={resultBatchHeader.pro_name}
                  ></TextField>
                </Box>
                <Box
                  sx={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                  }}
                  display={"flex"}
                >
                  <ModalInputWrapper
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      width: "12em",
                    }}
                  >
                    <Typography
                      fullWidth
                      variant="body1"
                      sx={{ p: 1, fontWeight: 600 }}
                    >
                      Sale Pack
                    </Typography>
                  </ModalInputWrapper>
                  <TextField
                    size="small"
                    fullWidth
                    disabled
                    value={resultBatchHeader.pro_sellpackname}
                  ></TextField>
                </Box>

                <Box>
                  <Table size="small" sx={{ mt: 2 }}>
                    <TableHead>
                      <TableRow>
                        {fieldsbatch &&
                          fieldsbatch.map((head, index) => (
                            <TableCell
                              sx={{
                                fontWeight: "600",
                              }}
                              key={index}
                            >
                              {head.name}
                            </TableCell>
                          ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {resultBatch &&
                        resultBatch.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {item.batch === "" || item.batch === null
                                ? "-"
                                : item.batch}{" "}
                            </TableCell>
                            <TableCell sx={{ textAlign: "left" }}>
                              {item.expired_date === "" ||
                              item.expired_date === null
                                ? "-"
                                : item.expired_date.substring(0, 10)}
                            </TableCell>
                            <TableCell sx={{ textAlign: "left" }}>
                              {item.qty === "" || item.qty === null
                                ? "-"
                                : item.qty}
                            </TableCell>
                            <TableCell sx={{ textAlign: "left" }}>
                              <TextField
                                size="small"
                                type="number"
                                onChange={(evt) =>
                                  handleChangeQty(item, index, evt)
                                }
                                onKeyPress={(evt) =>
                                  keyPresshandleChangeQty(item, index, evt)
                                }
                                value={numberQty[index]}
                              ></TextField>
                            </TableCell>

                            <TableCell>
                              <Button
                                variant="contained"
                                disabled={
                                  numberQty[index] > item.qty ||
                                  numberQty[index] === 0 ||
                                  numberQty.length === 0 ||
                                  numberQty[index] < 0
                                }
                                id={`btnOke${item.batch}`}
                                color="primary"
                                onClick={() => doneChangeQty(item, index)}
                              >
                                OK
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Box>

                <Box sx={{ mt: 4, textAlign: "center" }}>
                  <Button
                    sx={{ ml: 1 }}
                    variant="contained"
                    color="error"
                    onClick={() => toggleBatchClosed()}
                  >
                    Cancel
                  </Button>
                </Box>
              </ModalWrapper>
            </Modal>
            {/* modalbatch */}
            {/* response */}
            <Modal open={responseModalIsOpen}>
              <Box sx={style}>
                <Grid textAlign="center">
                  <Typography>{responseHeader}</Typography>
                </Grid>
                <Grid mt={2} mb={2}>
                  <Divider />
                </Grid>
                <Grid textAlign="center">
                  <Typography>{responseBody}</Typography>
                </Grid>
                <Grid textAlign="center" mt={2}>
                  <Button
                    onClick={toggleCloseSaveModal.bind(this)}
                    variant="contained"
                    color="error"
                  >
                    Close
                  </Button>
                </Grid>
              </Box>
            </Modal>
            {/* response */}

            {/* nametag */}
            <Modal closeOnBackdrop={false} open={ScanNameTagModal}>
              {/* <ModalWrapper sx={{ height: "50%", width: "50%" }}> */}
              <Box sx={style}>
                <Grid>
                  <Typography sx={{ mb: 2 }} align="center" variant="h5">
                    Sales Person
                  </Typography>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                  SCAN BARCODE ON YOUR NAMETAG
                </Typography>
                <Box
                  sx={{
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                  }}
                  display={"flex"}
                >
                  <ModalInputWrapper
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      width: "8em",
                    }}
                  >
                    <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                      NIP
                    </Typography>
                  </ModalInputWrapper>
                  <TextField
                    fullWidth
                    disabled={scannedNameTag}
                    onChange={onChangeNameTag}
                    onKeyDown={onChangeNameTag}
                    onBlur={onChangeNameTag}
                    value={nipUser}
                    type="text"
                    placeholder="SCAN"
                    autoComplete="off"
                  ></TextField>
                </Box>
                <Grid>
                  <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Button
                      sx={{ ml: 1 }}
                      variant="contained"
                      color="error"
                      onClick={closedtoggleScanNameTag.bind(this)}
                    >
                      CANCEL
                    </Button>
                  </Box>

                  <Collapse in={hideNOMemberModal}>
                    <Box
                      sx={{
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                      }}
                      display={"flex"}
                    >
                      <ModalInputWrapper
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                          width: "8em",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{ p: 1, fontWeight: 600 }}
                        >
                          Member ID
                        </Typography>
                      </ModalInputWrapper>
                      <TextField
                        fullWidth
                        disabled={scanned}
                        onChange={onChangeBarcode}
                        onKeyDown={onChangeBarcode}
                        onBlur={onChangeBarcode}
                        value={noMember}
                        type="text"
                        placeholder="SCAN MEMBER ID"
                        autoComplete="off"
                      ></TextField>
                    </Box>
                    <Box sx={{ mt: 4, textAlign: "center" }}>
                      <Button
                        sx={{ ml: 1 }}
                        variant="contained"
                        color="error"
                        disabled // todo member
                        onClick={toggleOKMembershipModal.bind(this)}
                      >
                        OK
                      </Button>
                    </Box>
                  </Collapse>
                </Grid>
                {/* </ModalWrapper> */}
              </Box>
            </Modal>
            {/* nametag */}

            {/* membership */}
            <Modal closeOnBackdrop={false} open={MembershipModalIsOpen}>
              {/* <ModalWrapper sx={{ height: "30%", width: "50%" }}> */}
              <Box sx={style} style={{ textAlign: "center" }}>
                <Grid>
                  <Typography sx={{ mb: 2 }} align="center" variant="h5">
                    MEMBERSHIP
                  </Typography>
                </Grid>
                <Divider sx={{ my: 2 }} />

                <Collapse in={konfirmasiMember}>
                  <Grid container sx={{ justifyContent: "center" }}>
                    <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                      THIS IS MEMBER TRANSACTIONS?
                    </Typography>
                  </Grid>

                  <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Button
                      sx={{ ml: 1 }}
                      variant="contained"
                      color="success"
                      onClick={toggleOpenMembershipModalTESTING.bind(this)}
                    >
                      YES
                    </Button>
                    <Button
                      sx={{ ml: 1 }}
                      variant="contained"
                      color="error"
                      onClick={toggleNotMembershipModal.bind(this)}
                    >
                      NO
                    </Button>
                  </Box>
                </Collapse>

                <Collapse in={hideNOMemberModal}>
                  <Box
                    sx={{
                      border: "1px solid rgba(0, 0, 0, 0.12)",
                    }}
                    display={"flex"}
                  >
                    <ModalInputWrapper
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                        width: "8em",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ p: 1, fontWeight: 600 }}
                      >
                        Member ID
                      </Typography>
                    </ModalInputWrapper>
                    <TextField
                      fullWidth
                      disabled={scanned}
                      onChange={onChangeBarcode}
                      onKeyDown={onChangeBarcode}
                      onBlur={onChangeBarcode}
                      // onKeyDown={(e) => onkeydownMemberID(e)}
                      value={noMember}
                      type="text"
                      placeholder="SCAN MEMBER ID"
                      autoComplete="off"
                    ></TextField>
                  </Box>
                  <Grid>
                    <Box sx={{ mt: 4, textAlign: "center" }}>
                      <Button
                        sx={{ ml: 1 }}
                        variant="contained"
                        color="error"
                        onClick={toggleOKMembershipModal.bind(this)}
                      >
                        OK
                      </Button>
                    </Box>
                  </Grid>
                </Collapse>
              </Box>
              {/* </ModalWrapper> */}
            </Modal>
            {/* membership */}

            {/* payment */}
            <Modal closeOnBackdrop={false} open={modalTransfer}>
              <Box sx={style}>
                {/* <ModalWrapper sx={{ height: "100%", width: "50%" }}> */}
                <Grid>
                  <Typography sx={{ mb: 2 }} align="center" variant="h5">
                    TYPE OF PAYMENT
                  </Typography>
                </Grid>
                <Divider sx={{ my: 2 }} />

                <Grid container textAlign="center">
                  <ModalInputWrapper
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      width: "10em",
                    }}
                  >
                    <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                      METHOD
                    </Typography>
                  </ModalInputWrapper>
                  <Select
                    fullWidth
                    sx={{ width: "50%" }}
                    defaultValue="Choose"
                    value={paymentType}
                    onChange={(e) => onChangePaymentOption(e)}
                  >
                    {paymentOption &&
                      paymentOption.map((todo, i) => {
                        return (
                          <option key={i} value={todo.pay_code}>
                            {todo.pay_name}
                          </option>
                        );
                      })}
                  </Select>
                </Grid>

                <Grid container>
                  <ModalInputWrapper
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      width: "10em",
                    }}
                  >
                    <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                      AMOUNT
                    </Typography>
                  </ModalInputWrapper>
                  <TextField
                    fullWidth
                    sx={{ width: "50%" }}
                    type="number"
                    placeholder={"INPUT AMOUNT"}
                    autoComplete="off"
                    onChange={(e) => setCashValue(Number(e.target.value))}
                    value={cashValue}
                    onKeyDown={(e) => keydownjumlah(e)}
                  ></TextField>
                </Grid>

                <Grid hidden={showVoucherMethod} container>
                  <ModalInputWrapper
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      width: "10em",
                    }}
                  >
                    <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                      VOUCHER
                    </Typography>
                  </ModalInputWrapper>
                  <TextField
                    sx={{ width: "50%" }}
                    type="text"
                    fullWidth
                    placeholder={"INPUT VOUCHER CODE"}
                    autoComplete="off"
                  ></TextField>
                </Grid>

                <Grid hidden={showCreditMethod} container>
                  <ModalInputWrapper
                    sx={{
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                      width: "10em",
                    }}
                  >
                    <Typography variant="body1" sx={{ p: 1, fontWeight: 600 }}>
                      CARD NUMBER
                    </Typography>
                  </ModalInputWrapper>
                  <TextField
                    sx={{ width: "50%" }}
                    type="text"
                    fullWidth
                    value={ccNumber}
                    onChange={formatAndSetCcNumber}
                    placeholder={"INPUT CARD NUMBER"}
                    autoComplete="off"
                  ></TextField>
                </Grid>

                <Grid>
                  <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Button
                      disabled={
                        grandTotalTransaction > cashValue || cashValue === 0
                      }
                      onClick={() => toggleTransferClosed()}
                      variant="contained"
                    >
                      DONE
                    </Button>
                  </Box>
                </Grid>
                {/* </ModalWrapper> */}
              </Box>
            </Modal>
            {/* payment */}

            {/* save */}
            <Modal closeOnBackdrop={false} open={modalSave}>
              <ModalWrapper sx={{ height: "25%", width: "50%" }}>
                <Grid
                  container
                  sx={{ justifyContent: "center", textAlign: "center" }}
                >
                  <Typography
                    sx={{ mb: 2 }}
                    align="center"
                    textAlign="center"
                    variant="h5"
                  >
                    ARE YOU SURE WANT TO SAVE THIS TRANSACTION?
                  </Typography>
                </Grid>
                <Divider sx={{ my: 2 }} />

                <Grid textAlign="center">
                  {/* <Box sx={{ mt: 1, textAlign: "center" }}> */}

                  {/* </Box> */}

                  <Button
                    sx={{ ml: 2 }}
                    variant="contained"
                    disabled={btnInsertTransaction}
                    color="info"
                    onClick={() => insertTransaction()}
                  >
                    YES
                  </Button>
                  <Button
                    sx={{ ml: 2 }}
                    variant="contained"
                    color="error"
                    onClick={toggleModalSaveClosed.bind(this)}
                  >
                    NO
                  </Button>
                  {/* </Box> */}
                </Grid>
              </ModalWrapper>
            </Modal>
            {/* save */}

            <Modal open={isLoading}>
              <Box sx={style} style={{ textAlign: "center" }}>
                <CircularProgress>PLEASE WAIT...</CircularProgress>
              </Box>
            </Modal>

            <Modal open={modalUploadFilesIsOpen}>
              <Box sx={style}>
                <Typography>Upload</Typography>
                <Grid mt={2} mb={2}>
                  <Divider fullWidth></Divider>
                </Grid>
                <div>
                  <input
                    type="file"
                    name="file"
                    onChange={changeHandler}
                  ></input>
                  {isSelected ? (
                    <div>
                      <img
                        src={selectedFile}
                        style={{ widht: "30px", height: "30px" }}
                        alt="description"
                      />
                    </div>
                  ) : (
                    <p>Select a file to show details</p>
                  )}
                </div>

                <Button onClick={handleSubmission}>SUBMIT</Button>
                <Button onClick={toggleModalUploadClose.bind(this)}>OK</Button>
              </Box>
            </Modal>
          </Box>
        )
        // : (
        //   <Typography>Test</Typography>
        // )
      }
    </>
  );
};
export default Posv2;
