import { toast } from "react-toastify";

const toastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: {
    zIndex: 99999
  }
};

export const handleSuccess = (msg) => {
  toast.success(msg, toastOptions);
};

export const handleError = (msg) => {
  toast.error(msg, toastOptions);
};
