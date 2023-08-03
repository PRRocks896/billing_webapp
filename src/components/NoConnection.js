import React from "react";
import "../assets/styles/nointernet.scss";
// import noInternet from "../assets/images/no-connection.png";

const NoConnection = () => {
  return (
    <div className="no-internet-page">
      <h1>No Internet Connection</h1>
      <p>Please check your internet connection and try again.</p>
      {/* <img src={noInternet} alt="No Internet" /> */}
    </div>
  );
};

export default NoConnection;
