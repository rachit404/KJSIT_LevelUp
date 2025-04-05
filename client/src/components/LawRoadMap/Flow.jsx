import { useCallback, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  categoryStyles,
  categoryDescriptions,
  categoryFlowcharts,
} from "./category.js";

export default function Flow() {
  const [selectedCategory, setSelectedCategory] = useState("category1");
  const [nodes, setNodes, onNodesChange] = useNodesState(
    categoryFlowcharts.category1.nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    categoryFlowcharts.category1.edges
  );
  const [showFlow, setShowFlow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryDescription, setCategoryDescription] = useState(
    categoryDescriptions["category1"]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setNodes(categoryFlowcharts[category].nodes);
    setEdges(categoryFlowcharts[category].edges);
    setCategoryDescription(categoryDescriptions[category]);
    setShowFlow(false);
    setLoading(false);
  };

  const handleGenerateClick = () => {
    setLoading(true);
    setShowFlow(false);
    setTimeout(() => {
      setLoading(false);
      setShowFlow(true);
    }, 2500); // simulate async operation
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Flow Type Buttons */}
      <div className="flex justify-center flex-wrap gap-4 p-6 bg-white rounded-lg shadow mx-4 my-4">
        {Object.entries(categoryStyles).map(
          ([cat, { label, base, active }]) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2 rounded font-medium border ${
                selectedCategory === cat ? active : base
              }`}
            >
              {label}
            </button>
          )
        )}
      </div>

      {/* Category Description */}
      <div className="text-center px-6 py-4 mx-auto max-w-3xl text-gray-700 font-medium">
        {categoryDescription}
      </div>

      {/* Generate Button */}
      <div className="flex justify-center my-2">
        <button
          onClick={handleGenerateClick}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 transition duration-300"
        >
          Generate
        </button>
      </div>

      {/* Flowchart or Loader */}
      <div className="flex-1 p-4">
        <div className="w-full h-full min-h-[500px] border-2 border-gray-300 rounded-2xl shadow-lg overflow-hidden bg-white flex items-center justify-center">
          {loading ? (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-indigo-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                Generating flowchart...
              </p>
            </div>
          ) : showFlow ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          ) : (
            <p className="text-gray-500 text-lg">
              Click "Generate" to load the flowchart
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
