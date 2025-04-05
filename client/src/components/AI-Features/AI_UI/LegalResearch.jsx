import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { getResponse } from "../responseStore.js";
import LegalResearchLogic from "../AI/legal_research_logic.jsx";
import {
  ArrowDownToLine,
  AlertCircle,
  FileText,
  Search,
  Loader2,
  Book,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  HistoryIcon,
} from "lucide-react";

const LegalResearch = () => {
  const [researchTopic, setResearchTopic] = useState(
    "Contract Breach in Indian Law"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [reportText, setReportText] = useState("");
  const [error, setError] = useState(null);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [reportOpen, setReportOpen] = useState(true);
  const [showTips, setShowTips] = useState(false);

  const researchTips = [
    "Include the jurisdiction (e.g., 'under US law' or 'in the UK')",
    "Specify the time period if relevant (e.g., 'current regulations' or 'historical development')",
    "Include specific statutes or case names if you're looking for analysis on them",
    "Narrow your topic to get more detailed analysis rather than broad overviews",
  ];

  const handleGenerateReport = () => {
    if (!researchTopic.trim()) {
      setError("Please enter a legal topic.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setReportText("");
    setTriggerFetch(true);
    setReportOpen(true);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([reportText], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${researchTopic.replace(
      /\s+/g,
      "_"
    )}_Research_Report.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Watch for report updates via getResponse
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      const result = getResponse();
      if (result && result !== reportText) {
        setReportText(result);
        setIsLoading(false);
        clearInterval(interval); // stop checking once response is fetched
      }
    }, 500); // poll every 500ms

    return () => clearInterval(interval); // cleanup
  }, [isLoading, reportText]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="text-blue-100" size={24} />
              Legal Research Assistant
            </h2>
            <p className="text-blue-100 mt-1 max-w-xl">
              Generate comprehensive legal research reports with
              jurisdiction-specific analysis
            </p>
          </div>

          <div className="bg-white/10 rounded-lg px-3 py-2 text-sm text-blue-50 flex items-center">
            <HistoryIcon size={14} className="mr-1.5" />
            AI-powered research
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Input Section */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
          <div className="mb-4">
            <label
              htmlFor="researchTopic"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Research Topic
            </label>
            <div className="relative">
              <input
                id="researchTopic"
                type="text"
                value={researchTopic}
                onChange={(e) => setResearchTopic(e.target.value)}
                placeholder="e.g., Contract Breach in Indian Law"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10"
              />
              <Search
                className="absolute left-3 top-3.5 text-gray-400"
                size={18}
              />
            </div>

            {/* Research Tips Section */}
            <div className="mt-3">
              <button
                onClick={() => setShowTips(!showTips)}
                className="text-blue-600 text-sm flex items-center hover:text-blue-700 font-medium"
              >
                {showTips ? (
                  <ChevronUp size={16} className="mr-1" />
                ) : (
                  <ChevronDown size={16} className="mr-1" />
                )}
                {showTips ? "Hide research tips" : "Show research tips"}
              </button>

              {showTips && (
                <div className="mt-2 text-sm text-gray-600 bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                    <Book size={14} className="mr-1.5" />
                    Tips for better research results:
                  </h4>
                  <ul className="space-y-1.5 pl-5 list-disc">
                    {researchTips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handleGenerateReport}
              disabled={isLoading}
              className={`px-5 py-2.5 font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } flex items-center gap-2`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Generate Research Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading and Error Messages */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-blue-50 mb-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
              </div>
              <p className="text-gray-800 font-medium text-lg">
                Researching '{researchTopic}'
              </p>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Our AI is analyzing relevant cases, statutes, and legal
                commentary. This typically takes 30-60 seconds.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 flex gap-3 items-start mb-6">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Research Results with ReactMarkdown */}
        {reportText && !isLoading && (
          <div className="mt-6 border rounded-lg border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="bg-blue-50 border-b border-blue-100 py-3 px-4 flex justify-between items-center">
              <div className="flex items-center">
                <CheckCircle size={16} className="text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-800">Research Report</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setReportOpen(!reportOpen)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none flex items-center"
                >
                  {reportOpen ? (
                    <>
                      <ChevronUp size={16} className="mr-1" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} className="mr-1" />
                      Expand
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none"
                >
                  <ArrowDownToLine size={16} />
                  Download
                </button>
              </div>
            </div>

            {reportOpen && (
              <div className="p-4">
                <div className="prose prose-blue max-w-none bg-white p-6 rounded-lg border border-gray-200">
                  <ReactMarkdown>{reportText}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {triggerFetch && <LegalResearchLogic researchTopic={researchTopic} />}
    </div>
  );
};

export default LegalResearch;
