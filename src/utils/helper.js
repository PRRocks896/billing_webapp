import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (Message, status) => {
  if (status) {
    toast.success(Message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
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
      hideProgressBar: true,
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

export const listPayload = (page, where = {}, rows = 10, pagination = {}) => {
  return {
    where: {
      isDeleted: false,
      ...where,
    },
    pagination: {
      sortBy: "createdAt",
      descending: true,
      rows: rows,
      page: page + 1,
      ...pagination,
    },
  };
};

export const rightsAccess = (accessModules, pathname) => {
  if (accessModules && accessModules.length > 0) {
    const selectedModule = accessModules.find(
      (res) => res.px_module.path === pathname
    );
    return {
      add: selectedModule.add || false,
      edit: selectedModule.edit || false,
      delete: selectedModule.delete || false,
    };
  } else {
    return {
      add: false,
      edit: false,
      delete: false,
    };
  }
};
