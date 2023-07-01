import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (Message, status) => {
  console.log("show toast");

  if (status) {
    // toast.success(Message, {
    //   position: "top-right",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: false,
    //   draggable: false,
    //   progress: undefined,
    //   className: "custom-toast",
    // });
    // toast.error(Message, {
    //   position: "top-right",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: false,
    //   draggable: false,
    //   progress: undefined,
    //   className: "custom-toast",
    // });
    toast.success(Message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  } else {
    toast.error(Message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
};
