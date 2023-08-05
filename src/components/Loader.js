import React from "react";
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
      <span className="loader"></span>
    </Backdrop>
  );
};

export default Loader;
