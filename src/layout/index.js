import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";

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
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth);
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

  const { pathname } = useLocation();
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
