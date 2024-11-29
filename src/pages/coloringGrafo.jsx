import React, { useEffect, useState } from "react";
import axios from "axios";
import { ForceGraph3D } from "react-force-graph";
import * as THREE from "three";

const GraphColoring = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [numNodes, setNumNodes] = useState(5);
  const [numColors, setNumColors] = useState(3);
  const [selectedColors, setSelectedColors] = useState([]);

  useEffect(() => {
    const defaultColors = Array.from({ length: numColors }, (_, index) =>
      `hsl(${(index * 360) / numColors}, 100%, 50%)`
    );
    setSelectedColors(defaultColors);
  }, [numColors]);

  const fetchGraphData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/graph", {
        params: { numNodes, numColors },
      });
      setGraphData(response.data);
      setSteps(response.data.steps);
      setCurrentStep(0); // Reset to the first step
    } catch (error) {
      console.error("Error fetching graph data:", error.response?.data || error.message);
      alert("Failed to fetch graph data. Please check the backend.");
    }
  };

  const handleColorChange = (index, newColor) => {
    const updatedColors = [...selectedColors];
    updatedColors[index] = newColor;
    setSelectedColors(updatedColors);
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h1>Graph Coloring Visualization</h1>
      <div>
        <label>
          Number of Nodes:{" "}
          <input
            type="number"
            value={numNodes}
            onChange={(e) => setNumNodes(Number(e.target.value))}
            min="1"
          />
        </label>
        <br />
        <label>
          Number of Colors:{" "}
          <input
            type="number"
            value={numColors}
            onChange={(e) => setNumColors(Number(e.target.value))}
            min="1"
          />
        </label>
        <br />
        <div>
          <h3>Choose Colors:</h3>
          {Array.from({ length: numColors }).map((_, index) => (
            <input
              key={index}
              type="color"
              value={selectedColors[index] || "#ffffff"}
              onChange={(e) => handleColorChange(index, e.target.value)}
            />
          ))}
        </div>
        <button onClick={fetchGraphData}>Generate Graph</button>
      </div>
      <div>
        <h3>
          Step: {currentStep + 1} / {steps.length}
        </h3>
        <input
          type="range"
          min="0"
          max={steps.length - 1}
          value={currentStep}
          onChange={(e) => setCurrentStep(Number(e.target.value))}
        />
      </div>
      <ForceGraph3D
        graphData={{
          nodes: graphData.nodes.map((node) => ({
            ...node,
            color: selectedColors[steps[currentStep]?.result[parseInt(node.id.split(" ")[1], 10)] || 0],
          })),
          links: graphData.links,
        }}
        nodeAutoColorBy="group"
        nodeThreeObject={(node) => {
          const sprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
              color: node.color,
            })
          );
          sprite.scale.set(8, 8, 1);
          return sprite;
        }}
        linkWidth={2}
      />
    </div>
  );
};

export default GraphColoring;
