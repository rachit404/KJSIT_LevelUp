import { useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  categoryStyles,
  categoryDescriptions,
  categoryFlowcharts,
} from "./category.js";
import { ChevronRight, RotateCcw, Activity, Info, Command } from "lucide-react";

export default function Flow() {
  const [selectedCategory, setSelectedCategory] = useState("category1");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showFlow, setShowFlow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryDescription, setCategoryDescription] = useState("");
  const [flowKey, setFlowKey] = useState(0); // Key for forcing re-render

  // Initialize with first category
  useEffect(() => {
    setCategoryDescription(categoryDescriptions["category1"]);
    setNodes(categoryFlowcharts["category1"].nodes);
    setEdges(categoryFlowcharts["category1"].edges);
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleCategoryChange = (category) => {
    if (category === selectedCategory) return;

    setSelectedCategory(category);
    setCategoryDescription(categoryDescriptions[category]);

    // Reset flow state
    setShowFlow(false);
    setLoading(false);

    // Apply new category data with small delay to allow transition
    setTimeout(() => {
      setNodes(categoryFlowcharts[category].nodes);
      setEdges(categoryFlowcharts[category].edges);
      setFlowKey((prev) => prev + 1); // Force ReactFlow to re-render properly
    }, 200);
  };

  const handleGenerateClick = () => {
    setLoading(true);
    setShowFlow(false);

    // Simulate data loading/processing
    setTimeout(() => {
      setLoading(false);
      setShowFlow(true);
    }, 1500);
  };

  const resetFlow = () => {
    setNodes(categoryFlowcharts[selectedCategory].nodes);
    setEdges(categoryFlowcharts[selectedCategory].edges);
    setFlowKey((prev) => prev + 1);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Command size={18} className="mr-2 text-blue-600" />
              Flow Categories
            </h2>
          </div>

          <div className="overflow-y-auto flex-1">
            <div className="p-4 space-y-2">
              {Object.entries(categoryStyles).map(
                ([cat, { label, base, active }]) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`w-full px-4 py-3 rounded-lg font-medium text-left transition-all duration-200 flex items-center justify-between ${
                      selectedCategory === cat
                        ? `${active} shadow-sm`
                        : `${base} hover:bg-gray-50`
                    }`}
                  >
                    <span>{label}</span>
                    {selectedCategory === cat && (
                      <ChevronRight size={16} className="opacity-70" />
                    )}
                  </button>
                )
              )}
            </div>

            <div className="px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Info size={15} className="mr-1.5 text-blue-600" />
                Description
              </h3>
              <div className="p-3 bg-gray-50 rounded-lg text-gray-700 text-sm border border-gray-200">
                {categoryDescription}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleGenerateClick}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:bg-blue-700 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Activity size={18} className="mr-2" />
                  Generate Flowchart
                </>
              )}
            </button>

            {showFlow && (
              <button
                onClick={resetFlow}
                className="w-full mt-2 border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center"
              >
                <RotateCcw size={16} className="mr-2 text-gray-500" />
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Main Content - Flowchart Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">
                {selectedCategory && categoryStyles[selectedCategory]?.label}{" "}
                Flow
              </span>
            </div>
            {showFlow && (
              <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center">
                <Info size={12} className="mr-1" />
                Drag to reposition • Scroll to zoom
              </div>
            )}
          </div>

          <div className="flex-1 relative">
            {loading ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-medium">
                  Generating your flowchart...
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  This may take a moment
                </p>
              </div>
            ) : !showFlow ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gray-50">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Activity size={42} className="text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No Flowchart Generated Yet
                </h3>
                <p className="text-gray-500 max-w-md">
                  Select a category from the sidebar and click "Generate
                  Flowchart" to visualize the flow
                </p>
              </div>
            ) : (
              <ReactFlow
                key={flowKey}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                className="bg-gray-50"
                proOptions={{ hideAttribution: true }}
              >
                <Controls
                  position="bottom-right"
                  showInteractive={false}
                  className="bg-white shadow-md"
                />
                <MiniMap
                  nodeStrokeWidth={3}
                  zoomable
                  pannable
                  position="bottom-left"
                  className="border border-gray-200 shadow-sm"
                  style={{ background: "white" }}
                />
                <Background variant="dots" gap={16} size={1} color="#e5e7eb" />
              </ReactFlow>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
