import React from "react";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";

// css imports
import './assets/styles/global.scss';
import './assets/styles/sidebar.scss';
import './assets/styles/header.scss';
import './assets/styles/customer.scss';
import './assets/styles/home.scss';

function App() {
  return (
    <>
      <RouterProvider router={routes}/>
    </>
  );
}

export default App;
