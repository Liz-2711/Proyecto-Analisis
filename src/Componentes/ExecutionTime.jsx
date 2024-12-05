import React from "react";
import Plot from "react-plotly.js";

const ExecutionTimeChart = ({ executionTimes }) => {
    return (
        <div style={{ marginTop: "20px" }}>
            <h2>Execution Time Comparison</h2>
            <Plot
                data={[
                    {
                        x: executionTimes.map((time) => time.id),
                        y: executionTimes.map((time) => time.time),
                        type: "bar",
                        marker: { color: "blue" },
                    },
                ]}
                layout={{
                    title: "Execution Time for Different Runs",
                    xaxis: { title: "Run" },
                    yaxis: { title: "Execution Time (ms)" },
                }}
            />
        </div>
    );
};

export default ExecutionTimeChart;
