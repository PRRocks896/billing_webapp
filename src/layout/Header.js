import React, { useEffect, useState } from "react";
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
import { Stores, getStoreData } from "../utils/db";
import SyncModal from "../components/SyncModal";

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

  const loggedInUser = useSelector((state) => state.loggedInUser);
  const { id } = loggedInUser;
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [billCount, setBillCount] = useState(0);

  // check syncing
  const checkBillDataExist = async (flag = 0) => {
    const billData = await getStoreData(Stores.Bills);
    if (billData.statusCode === 200 && billData.data.length) {
      const lastRecord = billData.data[billData.data.length - 1];
      if (flag === 0) {
        if (new Date(lastRecord.createdAt).getDate() !== new Date().getDate()) {
          setBillCount(billData.data.length);
          setIsSyncModalOpen(true);
        }
      } else {
        setBillCount(billData.data.length);
        setIsSyncModalOpen(true);
      }
    }
  };
  useEffect(() => {
    checkBillDataExist();
  }, [id]);

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
        <Sidebar checkBillDataExist={checkBillDataExist} />
      </Drawer>

      {isSyncModalOpen && (
        <SyncModal
          isSyncModalOpen={isSyncModalOpen}
          count={billCount}
          setIsSyncModalOpen={setIsSyncModalOpen}
          // fetchBillData={fetchBillData}
        />
      )}
    </>
  );
};

export default Header;
