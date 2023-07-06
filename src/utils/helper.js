import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (Message, status) => {
  console.log("show toast");

  if (status) {
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

export const setAuthToken = (value) => {
  if (value) {
    localStorage.setItem("token", value);
  }
};

export const getAuthToken = () => {
  const value = localStorage.getItem("token");
  if (value) {
    return value;
  } else {
    return null;
  }
};

export const removeStorageToken = () => {
  localStorage.clear();
};

export const checkIsAuthenticated = () => {
  const value = getAuthToken();
  if (value === null) {
    return redirect("/login");
  }
  return null;
};

export const logoutHandler = () => {
  removeStorageToken();
  window.location.href = "/login";
};
