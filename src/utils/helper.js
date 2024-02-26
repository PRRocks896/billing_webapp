import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showTwoDecimal = (value) => {
  return (Math.round(parseFloat(value) * 100) / 100).toFixed(2);
}

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

export const listPayload = (page, where = {}, rows = 10, pagination = {}, descending = true) => {
  return {
    where: {
      isDeleted: false,
      ...where,
    },
    pagination: {
      sortBy: "createdAt",
      descending: descending,
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

export const convertAmountToWords = (amount) => {
  const singleDigits = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const thousands = ["", "thousand", "lacs", "crores"];

  function convertThreeDigits(num) {
      let result = "";
      let hundred = Math.floor(num / 100);
      num %= 100;
      if (hundred > 0) {
          result += singleDigits[hundred] + " hundred ";
      }
      if (num === 0) return result.trim();
      if (result !== "") result += "and ";
      if (num < 10) {
          result += singleDigits[num];
      } else if (num < 20) {
          result += teens[num - 10];
      } else {
          let ten = Math.floor(num / 10);
          result += tens[ten];
          let one = num % 10;
          if (one > 0) {
              result += " " + singleDigits[one];
          }
      }
      return result.trim();
  }

  if (amount === 0) return "zero";

  let result = "";
  let i = 0;

  while (amount > 0) {
      if (amount % 1000 !== 0) {
          result = convertThreeDigits(amount % 1000) + " " + thousands[i] + " " + result;
      }
      amount = Math.floor(amount / 1000);
      i++;
  }

  return result.trim();
}
