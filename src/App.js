import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutProvider from "./layout";

// css imports
import './assets/styles/global.scss';
import './assets/styles/sidebar.scss';
import './assets/styles/header.scss';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutProvider/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
