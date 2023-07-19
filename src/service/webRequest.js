import axios from "axios";
import { toast } from "react-toastify";
import { logoutHandler } from "../utils/helper";
// import { logoutHandler, showToast } from "../utils/helper";
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
  const response = await axiosInstance
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
      return err;
    });
  return response;
};

export const remove = async (url, data = null) => {
  const response = await axiosInstance
    .delete(`${baseUrl}${url}`, authHeader())
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      return err.response.data;
    });
  return response;
};

export const patch = async (url, data) => {
  return await axiosInstance
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
      console.error(err);
      return err.response.data;
    });
};

export const post = async (url, data) => {
  // return await axiosInstance
  //   .post(`${baseUrl}${url}`, data, authHeader())
  //   .then((res) => {
  //     if (res.status === 200) {
  //       console.log(res);
  //       return res.data;
  //     } else {
  //       return null;
  //     }
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     return err.response.data;
  //   });
  const response = await axiosInstance
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
      return err.response.data;
    });
  return response;
};

export const put = async (url, data) => {
  return await axiosInstance
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
      // if (err.response.data.statusCode === 401) {
      //   showToast(err.response.data.message, false);
      //   logoutHandler();
      // }
      return err.response.data;
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
        }, 5000);
      }

      return Promise.reject(err);
    }
  );

  return children;
};
