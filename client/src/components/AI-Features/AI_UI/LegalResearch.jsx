// LegalResearch.jsx
import React, { useState, useEffect } from "react";
import { getResponse } from "../responseStore.js";
import LegalResearchLogic from "../AI/legal_research_logic.jsx";

const LegalResearch = () => {
  const [researchTopic, setResearchTopic] = useState(
    "Contract Breach in Indian Law"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [reportText, setReportText] = useState("");
  const [error, setError] = useState(null);
  const [triggerFetch, setTriggerFetch] = useState(false);

  const handleGenerateReport = () => {
    if (!researchTopic.trim()) {
      setError("Please enter a legal topic.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setReportText("");
    setTriggerFetch(true);
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
    <div>
      <h2>📚 Legal Research</h2>
      <p>
        <em>
          Generate a structured legal research report on your chosen topic using
          Gemini.
        </em>
      </p>

      <div>
        <label htmlFor="researchTopic">Enter legal topic:</label>
        <input
          id="researchTopic"
          type="text"
          value={researchTopic}
          onChange={(e) => setResearchTopic(e.target.value)}
          placeholder="Contract Breach in Indian Law"
        />
      </div>

      <div>
        <button onClick={handleGenerateReport} disabled={isLoading}>
          {isLoading
            ? "Generating Research Report..."
            : "Generate Research Report"}
        </button>
      </div>

      {isLoading && <p>Researching '{researchTopic}' using Gemini...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {reportText && (
        <>
          <p style={{ color: "green" }}>Research completed successfully!</p>
          <h3>Generated Legal Research Report:</h3>

          <details open>
            <summary>View Full Research Report</summary>
            <div
              style={{
                backgroundColor: "#f5f5f5",
                padding: "1rem",
                whiteSpace: "pre-wrap",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
            >
              {reportText}
            </div>
          </details>

          <button onClick={handleDownload}>Download Research Report</button>
        </>
      )}

      {triggerFetch && <LegalResearchLogic researchTopic={researchTopic} />}
    </div>
  );
};

export default LegalResearch;
