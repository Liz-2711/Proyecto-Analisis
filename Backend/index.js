const express = require("express");
const cors = require("cors");
const ColoringGraphs = require("./Casos/coloringGraphs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Endpoint to handle the graph
app.post("/graph", (req, res) => {
    try {
        const { numNodes, numColors, edges, colors } = req.body;

        console.log("Request Payload:", { numNodes, numColors, edges, colors });

        // Validate edges
        if (!edges || !Array.isArray(edges)) {
            return res.status(400).json({ error: "Edges must be an array of pairs." });
        }

        // Validate colors
        if (!colors || !Array.isArray(colors) || colors.length !== numColors) {
            return res.status(400).json({ error: "Invalid colors array provided." });
        }

        const coloringGraph = new ColoringGraphs(numNodes);

        // Convert node identifiers to indices and add edges
        // Convert node identifiers to indices and add edges
for (const [from, to] of edges) {
    const fromIndex = from; // Already numeric
    const toIndex = to; // Already numeric

    if (fromIndex >= numNodes || toIndex >= numNodes || fromIndex < 0 || toIndex < 0) {
        return res.status(400).send({ error: `Edge out of range: [${from}, ${to}].` });
    }

    coloringGraph.addEdge(fromIndex, toIndex);
}


        // Verify if the graph is connected
        if (!coloringGraph.isConnected()) {
            return res.status(400).json({
                error: "The graph is not connected. Ensure all nodes are reachable.",
            });
        }

        // Calculate graph coloring
        const startTime = performance.now();
        // Calculate graph coloring with detailed steps
        const { success, steps } = coloringGraph.graphColoring(numColors);
        const executionTime = performance.now() - startTime;

if (!success) {
    return res.status(400).send({
        error: `The graph cannot be colored with ${numColors} colors.`,
    });
}

// Include colors in the response for each step
const stepsWithColors = steps.map((step) => ({
    vertex: step.vertex,
    color: colors[step.color], // Ensure mapping from index to color hex
    result: (step.result || []).map((colorIndex) =>
        colorIndex === -1 ? null : colors[colorIndex]
    ), // Safely map all indices to hex codes
}));



const graphData = {
    nodes: Array.from({ length: numNodes }, (_, i) => ({
        id: `Node ${i}`,
        color: stepsWithColors[stepsWithColors.length - 1]?.result[i] || "gray",
    })),
    links: edges.map(([from, to]) => ({
        source: from,
        target: to,
    })),
    executionTime: `${executionTime.toFixed(2)}ms`,
    steps: stepsWithColors, // Include detailed steps
};


        console.log("Response Payload:", graphData);
        res.json(graphData);
    } catch (err) {
        console.error("Internal Server Error:", err);
        res.status(500).json({ error: "Internal Server Error. Please try again." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
