import axios from "axios";
import { toast } from "react-toastify";
import { logoutHandler, showToast } from "../utils/helper";
const baseUrl = process.env.REACT_APP_BASE_URL;

const axiosInstance = axios.create();

export const authHeader = () => {
  // return authorization header with basic auth credentials
  //   const user = localStorage.getItem("dataToken");

  //   if (user) {
  //     return { headers: { Authorization: `Bearer ${user}` } };
  //     // return { Authorization: `Bearer ${user.token}` };
  //   } else {
  //     return {};
  //   }
  // return { headers: { "x-api-key": "05646635804321276" } };

  if (localStorage.getItem("token")) {
    return {
      headers: {
        "x-api-key": "05646635804321276",
        Authorization: localStorage.getItem("token"),
      },
    };
  } else {
    return {
      headers: {
        "x-api-key": "05646635804321276",
      },
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

export const get = async (url) => {
  const response = await axios
    .get(`${baseUrl}${url}`, authHeader())
    .then((res) => {
      if (res.status === 200) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.error(err);
    });
  return response;
};

export const remove = async (url, data = null) => {
  const response = await axios
    .delete(`${baseUrl}${url}`, authHeader())
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      console.error(err);
      if (err.response.data.statusCode === 401) {
        showToast(err.response.data.message, false);
        logoutHandler();
      }
      return err.response.data;
    });
  return response;
};

export const patch = async (url, data) => {
  return await axios
    .patch(`${baseUrl}${url}`, data, authHeader())
    .then((res) => {
      if (res.status === 200) {
        return res;
        // if (res.data.success) {
        //   return res.data.data.list ? res.data.data.list : res.data;
        // } else {
        //   return [];
        // }
      } else {
        return [];
      }
    })
    .catch((err) => {
      // return err?.response?.data;
      console.error(err);
      if (err.response.data.statusCode === 401) {
        showToast(err.response.data.message, false);
        logoutHandler();
      }
      return err.response.data;
    });
};

export const post = async (url, data) => {
  return await axios
    .post(`${baseUrl}${url}`, data, authHeader())
    .then((res) => {
      if (res.status === 200) {
        return res.data;
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.response.data.statusCode === 401) {
        showToast(err.response.data.message, false);
        logoutHandler();
      }
      return err.response.data;
    });
};

export const put = async (url, data) => {
  return await axios
    .put(`${baseUrl}${url}`, data, authHeader())
    .then((res) => {
      if (res.status === 200) {
        return res.data;
        // if (res.data.success) {
        //   return res.data.data.list ? res.data.data.list : res.data;
        // } else {
        //   return [];
        // }
      } else {
        return [];
      }
    })
    .catch((err) => {
      console.error(err);
      if (err.response.data.statusCode === 401) {
        showToast(err.response.data.message, false);
        logoutHandler();
      }
      return err.response.data;
    });
};

export const AxiosInterceptor = ({ children }) => {
  console.warn("AxiosInterceptor ");
  axiosInstance.interceptors.response.use(
    (response) => {
      console.warn(response);
      return response;
    },
    (err) => {
      console.warn("AxiosInterceptor err ", err);
      if (err?.response?.data.statusCode === 401) {
        toast.error("SESSION EXPIRE", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        localStorage.clear();
        window.location.href = "/login";
      }
      console.log("outof if");
      return err;
    }
  );

  return children;
};
