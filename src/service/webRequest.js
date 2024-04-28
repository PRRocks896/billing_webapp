import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import { logoutHandler } from "../utils/helper";

const baseUrl = process.env.REACT_APP_BASE_URL;

const axiosInstance = axios.create();

export const authHeader = (params = {}) => {
  if (localStorage.getItem("token")) {
    return {
      headers: {
        "x-api-key": "05646635804321276",
        Authorization: localStorage.getItem("token"),
      },
      params,
    };
  } else {
    return {
      headers: {
        "x-api-key": "05646635804321276",
      },
      params,
    };
  }
};

export const attachId = (url, id) => {
  if (id) {
    return `${url}${id}`;
  } else {
    return url;
  }
};

export const get = async (url, params = {}) => {
  const response = await axiosInstance
    .get(`${baseUrl}${url}`, authHeader(params))
    .then((res) => {
      if (res?.status === 200) {
        return res?.data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      return err;
    });
  return response;
};

export const remove = async (url, data = null) => {
  const response = await axiosInstance
    .delete(`${baseUrl}${url}`, authHeader())
    .then((res) => {
      return res?.data;
    })
    .catch((err) => {
      return err?.response?.data;
    });
  return response;
};

export const patch = async (url, data) => {
  return await axiosInstance
    .patch(`${baseUrl}${url}`, data, authHeader())
    .then((res) => {
      if (res?.status === 200) {
        return res;
      } else {
        return [];
      }
    })
    .catch((err) => {
      return err?.response?.data;
    });
};

export const post = async (url, data) => {
  const response = await axiosInstance
    .post(`${baseUrl}${url}`, data, authHeader())
    .then((res) => {
      if (res?.status === 200) {
        return res?.data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      return err?.response?.data;
    });
  return response;
};

export const put = async (url, data) => {
  return await axiosInstance
    .put(`${baseUrl}${url}`, data, authHeader())
    .then((res) => {
      if (res?.status === 200) {
        return res?.data;
      } else {
        return [];
      }
    })
    .catch((err) => {
      return err?.response?.data;
    });
};

export const getXlxsWithFile = async (url, data, fileName) => {
  return axiosInstance.post(`${baseUrl}${url}`, data, {
    responseType: "blob", //Force to receive data in a Blob Format
    headers: {
      "x-api-key": "05646635804321276",
      Authorization: localStorage.getItem("token"),
    }
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  });
}

export const getXlsx = async (url, data) => {
  return axiosInstance.post(`${baseUrl}${url}`, data, {
    responseType: "blob", //Force to receive data in a Blob Format
    headers: {
      "x-api-key": "05646635804321276",
      Authorization: localStorage.getItem("token"),
    }
  }).then((response) => {
    //Create a Blob from the PDF Stream
    const { userID, startDate, endDate } = data;
    let fileName = `Green day spa all branch sales report ${moment(startDate).format('DD-MM-yyyy')}_${moment(endDate).format('DD-MM-yyyy')}.xlsx`.toUpperCase();
    if(userID && userID.length === 1) {
      fileName = `${userID[0].label === 'All' ? 'green day spa all branch' : userID[0].label} sales report ${moment(startDate).format('DD-MM-yyyy')} ${moment(endDate).format('DD-MM-yyyy')}.xlsx`.toUpperCase();
    } else {
      fileName = `Green day spa selected branch sales report ${moment(startDate).format('DD-MM-yyyy')} ${moment(endDate).format('DD-MM-yyyy')}.xlsx`.toUpperCase();
    }
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  });
}

export const getPDF = async (url, data, title = `Green_Day_Sales_Report_${new Date().toDateString()}.xlsx`) => {
  return axiosInstance
    .post(`${baseUrl}${url}`, data, {
      responseType: "blob", //Force to receive data in a Blob Format
      headers: {
        "x-api-key": "05646635804321276",
        Authorization: localStorage.getItem("token"),
      },
    })
    .then((response) => {
      //Create a Blob from the PDF Stream
      // const file = new Blob([response?.data], { type: "application/pdf" });
      // return URL.createObjectURL(file);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', title);
      document.body.appendChild(link);
      link.click();
      //Build a URL from the file
      // const fileURL = URL.createObjectURL(file);
      //Open the URL on new Window
      // window.open(fileURL);
      // return fileURL;
    }).catch((err) => {
      toast.error(err?.response.statusText, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
};

export const AxiosInterceptor = ({ children }) => {
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (err) => {
      if (err?.response?.data.statusCode === 401) {
        toast.error("SESSION EXPIRE", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          logoutHandler();
        }, 3000);
      } 
      // else if(err?.response?.data.statusCode === 404) {
      //   toast.error(err?.response.data.statusText, {
      //     position: "top-right",
      //     autoClose: 5000,
      //     hideProgressBar: true,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //     theme: "light",
      //   });
      // } 
      else {
        return Promise.reject(err);
      }
    }
  );

  return children;
};
