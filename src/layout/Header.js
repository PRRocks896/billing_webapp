import React, { useMemo } from "react";
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
import Button from "@mui/material/Button";
import Clock from "../components/Clock";
import Avatar from "@mui/material/Avatar";
import { useMediaQuery } from "@mui/material";
import ProfileIcon from '../assets/images/profile icon.svg';
import { useEffect, useState } from "react";
import Popover from "@mui/material/Popover";


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

const Header = ({ handleDrawerOpen, handleDrawerClose, open, setShowModal }) => {
  const data = useSelector((state) => state.loggedInUser);
  let location = useLocation();
  let pageTitle = "";

  if (location.pathname === "/") {
    pageTitle = "Home";
  } else if (location.pathname.includes("/")) {
    pageTitle = location.pathname.split("/")[1];
  }
  pageTitle = pageTitle.toUpperCase();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? "profile-popover" : undefined;



  const managerName = useMemo(() => {
    return localStorage.getItem("managerName") || "";
  }, [localStorage.getItem("managerName")]);

  const isSmallScreen = useMediaQuery('(max-width:320px)');

  useEffect(() => {
    if (isSmallScreen && open) {
      handleDrawerClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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
          <Box className="manager-name">
            <Button style={{ width: '180px' }} className="btn btn-tertiary" onClick={() => setShowModal(true)}>
              {/* {managerName} */}
              Select Manager
            </Button>
          </Box>
          <Box className="username">
            <Box sx={{ display: { xs: 'none', sm: 'flex', flexWrap: "wrap", gap: '10' }, alignItems: 'center' }}>
              <UserName firstName={data?.firstName} lastName={data?.lastName} />
              <Clock />
            </Box>
          </Box>
          <Avatar
            className="profile-icon"
            alt="User Name"
            src={ProfileIcon}
            sx={{ width: 50, height: 50, cursor: "pointer" }}
            aria-describedby={id}
            onClick={handleClick}
          />

          <Popover
            id={id}
            open={openPopover}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box sx={{ p: 2, minWidth: 150 }}>
              <Typography variant="subtitle2">{data?.firstName} {data?.lastName}</Typography>
              <Clock />
            </Box>
          </Popover>
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
        <Sidebar />
      </Drawer>
    </>
  );
};

export default Header;
