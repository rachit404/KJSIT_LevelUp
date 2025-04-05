import React from "react";
import Flow from "./Flow.jsx";

const LawRoadMap = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-200 p-6 text-blue-950 text-center text-3xl font-bold">
        Law RoadMap
      </div>

      <div className="p-6">
        <Flow />
      </div>

      <div className="p-8 bg-gray-100 mt-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Additional Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="font-semibold text-lg mb-2">Flow Types</h3>
            <p>
              Choose from different flow types including linear, decision, and
              loop flows.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="font-semibold text-lg mb-2">Interactions</h3>
            <p>
              Click and drag nodes to rearrange. Use the minimap for navigation.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="font-semibold text-lg mb-2">Controls</h3>
            <p>Zoom in/out and pan using the control panel or mouse wheel.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawRoadMap;
