import React, { useEffect } from "react";

import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import {
  IconButton,
  Box,
  Drawer,
  Typography,
  Divider,
  Toolbar,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { FiUser, FiLogOut, FiAlignJustify } from "react-icons/fi";
import SiteLogo from "../assets/images/logo.png";
import ProfileImage from "../assets/images/avatar2.jpg";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import { logoutHandler, showToast } from "../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoggedInUserData } from "../service/loggedInUser";
import { loggedInUserAction } from "../redux/loggedInUser";

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

const Header = ({ handleDrawerOpen, handleDrawerClose, open }) => {
  const data = useSelector((state) => state.loggedInUser);
  const dispatch = useDispatch();
  let location = useLocation();
  // let pageTitle = location.pathname.slice(1).toUpperCase();
  let pageTitle = "";

  if (location.pathname === "/") {
    pageTitle = "Home";
  } else if (location.pathname.includes("/")) {
    pageTitle = location.pathname.split("/")[1];
  }
  pageTitle = pageTitle.toUpperCase();

  // account dropdown
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openAccount = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // fetch logged in user details start
  const fetchLoggedInUser = async () => {
    try {
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
  };
  useEffect(() => {
    fetchLoggedInUser();
  }, []);

  // fetch logged in user details end

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

          <Box className="account-dropdown">
            <Tooltip title="Profile Setting">
              <IconButton
                onClick={handleClick}
                aria-controls={openAccount ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={openAccount ? "true" : undefined}
              >
                <Avatar className="avatar">
                  <img src={ProfileImage} alt="account img" />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            className="account-dropdown-menu"
            anchorEl={anchorEl}
            id="account-menu"
            open={openAccount}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* <MenuItem onClick={handleClose}> */}

            {/* </MenuItem> */}
            {/* <MenuItem onClick={handleClose}> */}

            <Box className="user-details">
              <Box className="user-img">
                <img src={ProfileImage} alt="account img" />
              </Box>
              <Typography
                variant="span"
                component="span"
                className="text-grey user-position"
                align="center"
              >
                {data?.px_role?.name}
              </Typography>
              <Typography
                variant="h5"
                component="h5"
                className="text-green user-name"
                align="center"
              >
                {data?.firstName + " " + data?.lastName}
              </Typography>
            </Box>
            <Box className="links">
              <Divider />
              <MenuItem className="menu-link">
                <ListItemIcon className="link-icon">
                  <FiUser />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem className="menu-link" onClick={logoutHandler}>
                <ListItemIcon className="link-icon">
                  <FiLogOut />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Box>
          </Menu>
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
          <img src={SiteLogo} alt="Sitelogo" width={218} height={140} />
          {/* <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <FiChevronLeft /> : <FiChevronRight />}
                    </IconButton> */}
        </DrawerHeader>
        <Sidebar />
      </Drawer>
    </>
  );
};

export default Header;
