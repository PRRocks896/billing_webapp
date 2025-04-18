import React from "react";
import "../assets/styles/nointernet.scss";

const NoConnection = () => {
  return (
    <div className="no-connection-card">
      <div className="no-internet-page">
        <h1>No Internet Connection</h1>
        <p>Please check your internet connection and try again.</p>
      </div>
    </div>
  );
};

export default NoConnection;
