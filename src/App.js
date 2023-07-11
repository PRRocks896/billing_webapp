import React, { useCallback, useLayoutEffect } from "react";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { ToastContainer } from "react-toastify";
import Loader from "./components/Loader";

// css imports
import "./assets/styles/global.scss";
import "./assets/styles/sidebar.scss";
import "./assets/styles/header.scss";
import "./assets/styles/login.scss";
import "./assets/styles/customer.scss";
import "./assets/styles/home.scss";
import "react-toastify/dist/ReactToastify.css";
import { fetchLoggedInUserData } from "./service/loggedInUser";
import { loggedInUserAction } from "./redux/loggedInUser";
import { useDispatch } from "react-redux";
import { showToast } from "./utils/helper";

const App = () => {
  const dispatch = useDispatch();

  // fetch logged in user details start
  const fetchLoggedInUser = useCallback(async () => {
    try {
      console.log("fetchLoggedInUser");
      const response = await fetchLoggedInUserData();
      console.log(response);
      if (response.statusCode === 200) {
        dispatch(loggedInUserAction.storeLoggedInUserData(response.data));
      } else {
        showToast(response.messageCode, false);
      }
    } catch (error) {
      console.log(error);
      showToast(error.message, false);
    }
  }, [dispatch]);

  useLayoutEffect(() => {
    fetchLoggedInUser();
  }, [fetchLoggedInUser]);

  return (
    <>
      <ToastContainer />
      <Loader />
      <RouterProvider router={routes} />
    </>
  );
};

export default App;
