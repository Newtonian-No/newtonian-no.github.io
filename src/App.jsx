import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GrayGooPage from "./pages/GrayGooPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/graygoo/" element={<GrayGooPage />} />
    </Routes>
  );
}

export default App;
