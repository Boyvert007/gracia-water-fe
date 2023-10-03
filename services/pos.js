import axios from "axios";
import { getStorage } from "../utils/storage";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 10000,
});

const stockPrint = axios.create({
  baseURL: `https://api.cfu.pharmalink.id`,
  timeout: 10000,
});

const pos1 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_VN_API_URL,
  timeout: 10000,
});

// const getHistoryTransactions = async (params) => {
const getHistoryTransactions = async () => {
  return await api.get(`/pos/v1/sales?type=gethistorysales`, {
    headers: {
      // // Authorization: `${getStorage("access_token")}`,
    },
    // params,
  });
};

const getProductByProcode = async (params) => {
  return await pos1.get(`/logistic/v2/pos/scan`, {
    headers: {
      // // Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getProductByBarcode = async (params) => {
  return await pos1.get(`/logistic/v2/pos/scan`, {
    headers: {
      // // Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getPaymentType = async (gudangID) => {
  return await api.get(`/finance/v1/master/payments?outcode=${gudangID}`, {});
};

const findHistoryTransactions = async (params) => {
  return await api.get(
    `pos/v1/sales?type=getsalesbytrannum&notranno=${params}`,
    {
      headers: {
        // // Authorization: `${getStorage("access_token")}`,
      },
      // params,
    }
  );
};

const getProductsByProcod = async (procod) => {
  return await api.get(`pos/v1/sales?type=productbyprocod&procod=${procod}`, {
    headers: {
      // // Authorization: `${getStorage("access_token")}`,
    },
    // params,
  });
};
const insertNewTransaction = async (body) => {
  return await api.post(`pos/v1/sales?type=insertproductnew`, body, {
    headers: {
      // // Authorization: `${getStorage("access_token")}`,
    },
  });
};

const insertNewTransaction1 = async () => {
  return await api.post(`pos/v1/sales?type=insertproductnewperma`, {
    headers: {
      // // Authorization: `${getStorage("access_token")}`,
    },
  });
};

const getDataProduct2 = async () => {
  return await api.get(`pos/v1/sales?type=getdataproduct2`, {
    headers: {
      // // Authorization: `${getStorage("access_token")}`,
    },
    // params,
  });
};

const getDataApriori2 = async (offset, limit) => {
  return await api.get(
    `pos/v1/sales?type=getdataapriori2&offset=${offset}&limit=${limit}`,
    {
      headers: {
        // // Authorization: `${getStorage("access_token")}`,
      },
      // params,
    }
  );
};

const getTotalProduct = async () => {
  return await api.get(`pos/v1/sales?type=gettotalproduct`, {
    headers: {
      // // Authorization: `${getStorage("access_token")}`,
    },
    // params,
  });
};

const insertTransaction = async (body) => {
  return await api.post(`/logistic/v2/sales/insertsalesnew`, body, {
    headers: {
      // // Authorization: `${getStorage("access_token")}`,
    },
  });
};

const insertRefund = async (body) => {
  return await api.post(`/logistic/v2/sales/insertrefund`, body);
};

const printHistoryStruk = async (PTID, gudangID, strookNumber) => {
  console.log("strook number", strookNumber);
  return await api.get(
    `/logistic/v2/sales/generatestruknew?ptid=${PTID}&outcode=${gudangID}&trannum=${strookNumber}`,
    {
      headers: {
        "Content-Type": "application/pdf",
      },
      responseType: "blob",
    }
  );
};

const getItem = async (params) => {
  return await api.get(`pos/v1/sales?type=getlastdatapos`, {
    headers: {
      // // Authorization: `${getStorage("access_token")}`,
    },
    // params,
  });
};

const getByCategory = async (params) => {
  return await api.get(`/logistic/v2/sales/getdatarefund`, {
    headers: {
      // // Authorization: `${getStorage("access_token")}`,
    },
    params,
  });
};

const getReason = async () => {
  return await stockPrint.get(`/bridging-internal/cfu10?type=getreason`);
};

export default {
  getHistoryTransactions,
  getProductByProcode,
  getPaymentType,
  getProductByBarcode,
  findHistoryTransactions,
  insertTransaction,
  printHistoryStruk,
  getItem,
  getByCategory,
  getReason,
  insertRefund,
  getProductsByProcod,
  insertNewTransaction,
  getDataProduct2,
  getDataApriori2,
  getTotalProduct,
  insertNewTransaction1,
};
