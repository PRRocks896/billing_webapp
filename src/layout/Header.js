import React from "react";
import { FiAlignJustify } from "react-icons/fi";
import SiteLogo from "../assets/images/logo.png";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Clock from "../components/Clock";

const drawerWidth = 300;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const UserName = React.memo(({ firstName = "", lastName = "" }) => {
  return <Typography>{firstName + " " + lastName}</Typography>;
});

const Header = ({ handleDrawerOpen, handleDrawerClose, open }) => {
  const data = useSelector((state) => state.loggedInUser);
  let location = useLocation();

  let pageTitle = "";

  if (location.pathname === "/") {
    pageTitle = "Home";
  } else if (location.pathname.includes("/")) {
    pageTitle = location.pathname.split("/")[1];
  }
  pageTitle = pageTitle.toUpperCase();

  return (
    <>
      <AppBar position="fixed" open={open} className="header">
        <Toolbar className="toolbar">
          <IconButton
            className="arrow-btn"
            aria-label="open drawer"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <FiAlignJustify /> : <FiAlignJustify />}
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            className="page-title"
          >
            {pageTitle}
          </Typography>
          <Box className="username">
            <UserName firstName={data?.firstName} lastName={data?.lastName} />
            <Clock />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        className="sidebar"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader className="site-logo">
          <img src={SiteLogo} alt="Sitelogo" width={140} height={80} />
        </DrawerHeader>
        <Sidebar/>
      </Drawer>
    </>
  );
};

export default Header;
