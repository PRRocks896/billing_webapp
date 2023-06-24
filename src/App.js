import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutProvider from "./layout";

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
