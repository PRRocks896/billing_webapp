import React from "react";
import { RouterProvider } from "react-router-dom";

// css imports
import './assets/styles/global.scss';
import './assets/styles/sidebar.scss';
import './assets/styles/header.scss';
import routes from "./routes";

function App() {
  return (
    <>
      <RouterProvider router={routes}/>
    </>
  );
}

export default App;
