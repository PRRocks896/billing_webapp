import React from "react";
// import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { useSelector } from "react-redux";
import "../assets/styles/loader.scss";

const Loader = () => {
  const { isLoading } = useSelector((state) => state.loader);

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
    >
      {/* <CircularProgress
        disableShrink={false}
        thickness={2}
        size={70}
        color="#000"
      /> */}
      <span class="loader"></span>
    </Backdrop>
  );
};

export default Loader;
