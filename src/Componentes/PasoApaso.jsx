import React, { useState } from "react";

const StepByStepVisualization = ({ steps }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNextStep = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    };

    const handlePreviousStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const current = steps[currentStep];

    return (
        <div style={{ marginTop: "20px" }}>
            <h2>Step-by-Step Visualization</h2>
            <div>
                <p>
                    <strong>Step {currentStep + 1}:</strong> Vertex{" "}
                    <strong>{current.vertex}</strong> was assigned color{" "}
                    <span style={{ color: current.color }}>{current.color}</span>.
                </p>
                <h3>Current Coloring:</h3>
                <ul>
                    {current.result.map((color, index) => (
                        <li key={index}>
                            Node {index}:{" "}
                            <span style={{ color: color || "gray" }}>
                                {color || "Uncolored"}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div style={{ marginTop: "10px" }}>
                <button onClick={handlePreviousStep} disabled={currentStep === 0}>
                    Previous
                </button>
                <button
                    onClick={handleNextStep}
                    disabled={currentStep === steps.length - 1}
                    style={{ marginLeft: "10px" }}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default StepByStepVisualization;
