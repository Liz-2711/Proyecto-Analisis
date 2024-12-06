import React from "react";
import Plot from "react-plotly.js";

const ExecutionTimeChart = ({ executionTimes }) => {
    // Generate traces for each run
    const traces = executionTimes.map((time, index) => ({
        opacity: 0.8,
        color: `hsl(${(index * 360) / executionTimes.length}, 100%, 50%)`,
        type: "mesh3d",
        x: [index, index, index + 1, index + 1], // Base x-coordinates for 3D bars
        y: [0, 1, 1, 0], // Base y-coordinates for 3D bars
        z: [0, 0, time.time, time.time], // Height (z-axis) represents execution time
        name: time.id, // Label for legend
        hoverinfo: "name+z", // Show Run ID and execution time on hover
    }));

    // Layout for the chart
    const layout = {
        title: "3D Execution Time Comparison",
        scene: {
            xaxis: { title: "Run Index" },
            yaxis: { title: "Bar Width (Static)" },
            zaxis: { title: "Execution Time (ms)" },
        },
        height: 600,
        margin: { l: 0, r: 0, t: 50, b: 0 },
        showlegend: true,
    };

    return (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
            <h2>Execution Time Comparison</h2>
            <Plot data={traces} layout={layout} style={{ width: "100%", height: "500px" }} />
        </div>
    );
};

export default ExecutionTimeChart;
