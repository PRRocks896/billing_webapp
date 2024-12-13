import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showTwoDecimalWithoutRound = (value) => {
  return `${value?.split(".")[0]}.${value?.split(".")[1]?.slice(0, 2) || 0}`;
};

export const showTwoDecimal = (value) => {
  return (Math.round(parseFloat(value) * 100) / 100).toFixed(2);
};

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

export const listPayload = (
  page,
  where = {},
  rows = 10,
  pagination = {},
  descending = true
) => {
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
  const singleDigits = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];
  const thousands = ["", "thousand", "lakh", "crore"];

  function convertTwoDigits(num) {
    if (num < 10) return singleDigits[num];
    if (num < 20) return teens[num - 10];
    let ten = Math.floor(num / 10);
    let one = num % 10;
    return tens[ten] + (one ? " " + singleDigits[one] : "");
  }

  function convertThreeDigits(num) {
    let hundred = Math.floor(num / 100);
    let remainder = num % 100;
    let result = "";
    if (hundred) {
      result += singleDigits[hundred] + " hundred";
      if (remainder) {
        result += " and ";
      }
    }
    if (remainder) {
      result += convertTwoDigits(remainder);
    }
    return result;
  }

  if (amount === 0) return "zero";

  let result = "";
  let parts = [];
  let i = 0;

  // Handle thousands separately
  while (amount > 0) {
    let part = amount % (i === 1 ? 100 : 1000);
    if (part > 0) {
      let partInWords = convertThreeDigits(part);
      if (thousands[i]) {
        partInWords += " " + thousands[i];
      }
      parts.unshift(partInWords);
    }
    amount = Math.floor(amount / (i === 1 ? 100 : 1000));
    i++;
  }

  result = parts.join(" ").trim();
  return result;
};
