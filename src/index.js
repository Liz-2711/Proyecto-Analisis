import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GraphColoring from "./pages/coloringGrafo";
import Knapsack from "./pages/knapsack";


// Placeholder for other algorithm components
const OtherAlgorithm1 = () => <h1>Other Algorithm 1 - Coming Soon!</h1>;
const OtherAlgorithm2 = () => <h1>Other Algorithm 2 - Coming Soon!</h1>;

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/graph-coloring" element={<GraphColoring />} />
      <Route path="/knapsack" element={<Knapsack />} />
      <Route path="/other-algorithm-2" element={<OtherAlgorithm2 />} />
    </Routes>
  </BrowserRouter>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
