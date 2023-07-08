import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { useSelector } from "react-redux";

const Loader = () => {
  const { isLoading } = useSelector((state) => state.loader);

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
    >
      <CircularProgress />
    </Backdrop>
  );
};

export default Loader;
