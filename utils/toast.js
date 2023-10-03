import { isString } from "lodash";
import { useState } from "react";
import toast from "react-hot-toast";

const useToast = () => {
  const [keys, setKeys] = useState([]);

  const closeLoading = () => {
    if (keys.length >= 1) {
      keys.map(() => toast.remove());
    }
  };

  const closeToast = () => {
    toast.remove();
  };

  const customToast = (message, { options }) => {
    toast.custom(message, options);
  };

  const toastLoading = (message) => {
    const key = toast.loading(message, { duration: 0 });

    setKeys((current) => [...current, key]);
  };

  const toastSuccess = (message) => {
    toast.remove();
    toast.success(message);
  };

  const toastInfo = (message) => {
    toast.remove();
    toast(message);
  };

  const toastError = (error) => {
    toast.remove();

    if (error.response) {
      toast.error(error.response.data.message);
    } else if (isString(error)) {
      toast.error(error);
    } else {
      toast.error(
        "Sorry. Ada kesalahan sistem dari sisi kami. Silahkan reload halaman ini"
      );
    }
  };

  const displayToast = (variant, data, options = {}) => {
    switch (variant) {
      case "error":
        toastError(data);
        break;
      case "success":
        toastSuccess(data);
        break;
      case "loading":
        toastLoading(data);
        break;
      case "info":
        toastInfo(data);
        break;
      default:
        closeLoading();

        customToast(data, options);
    }
  };

  return [displayToast, closeToast];
};

export default useToast;
