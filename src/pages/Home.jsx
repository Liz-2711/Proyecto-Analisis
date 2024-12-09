import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h1>Choose an Algorithm</h1>
      <button onClick={() => navigate("/graph-coloring")}>
        Graph Coloring (Current)
      </button>
      <button onClick={() => navigate("/other-algorithm-1")}>
        Other Algorithm 1
      </button>
      <button onClick={() => navigate("/other-algorithm-2")}>
        Other Algorithm 2
      </button>
      <button onClick={() => navigate("/travelling-salesman")}>
        Travelling Salesman
      </button>
    </div>
  );
};

export default Home;
