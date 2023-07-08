import axios from "axios";
import { toast } from "react-toastify";
const baseUrl = process.env.REACT_APP_BASE_URL;

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
      return err.response.data;
    });
};

export const AxiosInterceptor = ({ children }) => {
  console.warn("AxiosInterceptor ");
  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      console.warn("AxiosInterceptor ", err.response);
      if (err?.response?.status === 401) {
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
        // localStorage.clear();
        // const errPayload = {
        //   code: err.response.data.status,
        //   status:"fail",
        //   message:err.response.data.message}
        // dispatch(setFeedback(errPayload));
      }
      return err.response;
    }
  );

  return children;
};
