import React from "react";
import "../assets/styles/notfound.scss";
import notfoundimage from "../assets/images/404.png";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found-page">
      <h1>404 Page Not Found</h1>
      <p>Oops! Looks like the page you are looking for doesn't exist.</p>
      <img src={notfoundimage} alt="404" />
      <p>Let's get you back to the homepage.</p>
      <br />
      {/* <br /> */}
      <Link to={"/"} replace={true}>
        <Button className="btn btn-tertiary">GO TO HOME</Button>
      </Link>
    </div>
  );
};

export default NotFound;
