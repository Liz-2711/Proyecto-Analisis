import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GraphColoring from "./pages/coloringGrafo";
import Knapsack from "./pages/knapsack";

// Placeholder components for other algorithms
const OtherAlgorithm1 = () => <h1>Other Algorithm 1 - Coming Soon!</h1>;
const OtherAlgorithm2 = () => <h1>Other Algorithm 2 - Coming Soon!</h1>;

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Home route */}
      <Route path="/" element={<Home />} />
      {/* Routes for different algorithms */}
      <Route path="/graph-coloring" element={<GraphColoring />} />
      <Route path="/knapsack" element={<Knapsack />} />
      <Route path="/other-algorithm-2" element={<OtherAlgorithm2 />} />
    </Routes>
  </BrowserRouter>
);

export default App;
   