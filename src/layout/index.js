import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Box } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";

import Header from "./Header";
import { getAuthToken, showToast } from "../utils/helper";
import { loggedInUserAction } from "../redux/loggedInUser";
import { fetchLoggedInUserData } from "../service/loggedInUser";

const drawerWidth = 300;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
    ...(open && {
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const LayoutProvider = () => {
  const theme = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = getAuthToken();

  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        handleDrawerClose();
      }
    };

    window.addEventListener("resize", handleResize);

    // Initial screen size on component mount
    // setScreenSize({ width: window.innerWidth, height: window.innerHeight });

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // fetch logged in user details start
  const fetchLoggedInUser = async () => {
    try {
      const response = await fetchLoggedInUserData();
      if (response.statusCode === 200) {
        const latestBillNo = response.data.latestBillNo;
        const latestCustomerNo = response.data.latestCustomerNo;
        localStorage.setItem('latestBillNo', latestBillNo);
        localStorage.setItem("latestCustomerNo", latestCustomerNo);
        dispatch(loggedInUserAction.storeLoggedInUserData(response.data));
        navigate(pathname);
      } else {
        showToast(response.message, false);
      }
    } catch (error) {
      showToast(error.message, false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLoggedInUser();
    }
    // eslint-disable-next-line
  }, [token]);

  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password")
  ) {
    return (
      <>
        <Box>
          <Outlet />
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Box>
          <Header
            handleDrawerOpen={handleDrawerOpen}
            handleDrawerClose={handleDrawerClose}
            open={open}
          />
          <Main open={open} className="page-wrapper">
            <DrawerHeader theme={theme} />
            <Outlet />
          </Main>
        </Box>
      </>
    );
  }
};

export default LayoutProvider;
