import React, { useState, useRef, useEffect } from "react";
import ForceGraph3D from "react-force-graph-3d";
import { InputNumber, Button, Select } from "antd";
import { SketchPicker } from "react-color";
import ExecutionTimeChart from "../Componentes/ExecutionTime";
import { Layout, Row, Col } from "antd";
const { Header, Content } = Layout;
const { Option } = Select;


const ColoringGraph = () => {
    const [numNodes, setNumNodes] = useState(5);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [executionTime, setExecutionTime] = useState(null);
    const [executionTimes, setExecutionTimes] = useState([]);
    const [numColors, setNumColors] = useState(3);
    const [colorType, setColorType] = useState("predefined");
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [colorPalette, setColorPalette] = useState([
        "#FF0000", // Red
        "#00FF00", // Green
        "#0000FF", // Blue
    ]);
    const graphRef = useRef();

    // Add nodes dynamically to the graph
    const handleAddNodes = () => {
        const newNodes = Array.from({ length: numNodes }, (_, i) => ({
            id: `Node ${i}`,
            color: "gray", // Default color
        }));
        setNodes(newNodes);
        setEdges([]);
        setSelectedNode(null);
        setGraphData(null);
        setSteps([]);
        setCurrentStepIndex(-1);
    };

    // Handle user click on a node to create edges
    const handleNodeClick = (nodeId) => {
        if (selectedNode === null) {
            setSelectedNode(nodeId);
        } else {
            if (
                selectedNode !== nodeId &&
                !edges.some(([a, b]) => (a === selectedNode && b === nodeId) || (a === nodeId && b === selectedNode))
            ) {
                setEdges((prevEdges) => [...prevEdges, [selectedNode, nodeId]]);
            }
            setSelectedNode(null);
        }
    };

    // Handle color changes for each node
    const handleColorChange = (color, index) => {
        const updatedPalette = [...colorPalette];
        updatedPalette[index] = color.hex;
        setColorPalette(updatedPalette);
    };

    // Generate graph coloring
    const handleGenerateGraph = async () => {
        try {
            const formattedEdges = edges.map(([from, to]) => [
                parseInt(from.replace("Node ", "")),
                parseInt(to.replace("Node ", "")),
            ]);

            const response = await fetch("http://localhost:5000/graph", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    numNodes: nodes.length,
                    numColors,
                    edges: formattedEdges,
                    colors: colorPalette,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                const updatedNodes = nodes.map((node, i) => ({
                    ...node,
                    color: "gray",
                }));

                setNodes(updatedNodes);
                setGraphData(data);
                setExecutionTime(data.executionTime);
                setSteps(data.steps);
                setCurrentStepIndex(0);

                // Add execution time for comparison
                setExecutionTimes((prev) => [
                    ...prev,
                    { id: `Run ${prev.length + 1}`, time: parseFloat(data.executionTime) },
                ]);
            } else {
                throw new Error(data.error || "Something went wrong.");
            }
        } catch (err) {
            console.error("Error:", err.message);
            alert(`Error generating graph coloring: ${err.message}`);
        }
    };

    // Update node colors dynamically for the current step
    useEffect(() => {
        if (currentStepIndex >= 0 && steps.length > 0) {
            const currentStep = steps[currentStepIndex];
            const updatedNodes = nodes.map((node) => {
                if (node.id === `Node ${currentStep.vertex}`) {
                    return { ...node, color: currentStep.color };
                }
                return node;
            });
            setNodes(updatedNodes);

            // Refresh the graph to apply color changes
            if (graphRef.current) {
                graphRef.current.refresh();
            }
        }
    }, [currentStepIndex, steps]);

    return (
        <div style={{ padding: "20px", width: "100%", maxWidth: "1200px", margin: "0 auto" }}>

            <h1>3D Graph Coloring</h1>
            <div style={{ marginBottom: "20px" }}>
                <InputNumber
                    min={1}
                    placeholder="Number of Nodes"
                    value={numNodes}
                    onChange={(value) => setNumNodes(value)}
                    style={{ marginRight: "10px" }}
                />
                <Button type="primary" onClick={handleAddNodes}>
                    Add Nodes
                </Button>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <InputNumber
                    min={1}
                    placeholder="Number of Colors"
                    value={numColors}
                    onChange={(value) => {
                        setNumColors(value);
                        setColorPalette(
                            Array.from({ length: value }, (_, i) => colorPalette[i] || "#FFFFFF")
                        );
                    }}
                    style={{ marginRight: "10px" }}
                />
                <Select value={colorType} onChange={(value) => setColorType(value)} style={{ width: 200 }}>
                    <Option value="predefined">Predefined Colors</Option>
                    <Option value="custom">Custom Colors</Option>
                </Select>
            </div>

            <div>
    <h3>Color Palette</h3>
    <div
        style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "space-between", // Ensures alignment and spacing
        }}
    >
        {Array.from({ length: numColors }, (_, i) => (
        <div
            key={i}
            style={{
                flex: "1 1 20%",
                maxWidth: "20%", 
                marginBottom: "20px",
            }}
        >
                <SketchPicker
                    color={colorPalette[i]}
                    onChange={(color) => handleColorChange(color, i)}
                />
                <p style={{ textAlign: "center" }}>Color {i + 1}</p>
            </div>
        ))}
    </div>
</div>


            <div style={{ height: "500px", marginTop: "20px" }}>
                <ForceGraph3D
    ref={graphRef}
    width={800} 
    height={500}
    graphData={{
        nodes,
        links: edges.map(([from, to]) => ({
            source: from,
            target: to,
        })),
    }}
    nodeLabel="id"
    nodeColor={(node) => node.color}
    linkWidth={2}
    onNodeClick={(node) => handleNodeClick(node.id)}
    nodeRelSize={4} // Node size
    d3AlphaDecay={0.05} // Slow down simulation for better layout
    d3VelocityDecay={0.3} // Add drag to stabilize nodes
    d3ForceConfig={{
        charge: { strength: -20 }, // Make nodes less repulsive
        link: { distance: 50 },   // Bring connected nodes closer
    }}
/>

            </div>

            <div style={{ marginTop: "20px" }}>
                <Button type="primary" onClick={handleGenerateGraph}>
                    Generate Coloring
                </Button>
            </div>

            {steps.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                    <h3>Step-by-Step Visualization</h3>
                    <p>
                        {`Step ${currentStepIndex + 1}: Vertex ${
                            steps[currentStepIndex]?.vertex
                        } was assigned color ${
                            steps[currentStepIndex]?.color
                        }.`}
                    </p>
                    <div>
                        <Button
                            disabled={currentStepIndex <= 0}
                            onClick={() => setCurrentStepIndex((prev) => prev - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            disabled={currentStepIndex >= steps.length - 1}
                            onClick={() => setCurrentStepIndex((prev) => prev + 1)}
                            style={{ marginLeft: "10px" }}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            <ExecutionTimeChart executionTimes={executionTimes} />
        </div>
    );
};

export default ColoringGraph;
