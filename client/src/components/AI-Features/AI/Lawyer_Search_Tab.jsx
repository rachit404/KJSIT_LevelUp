import React, { useState } from 'react';

const LawyerSearchTab = () => {
  // Predefined filter options
  const commonSpecialties = [
    "Corporate Law", "Criminal Law", "Property Law", "Family Law", "IP Law",
    "Labor Law", "Tax Law", "Cyber Law", "Civil Litigation", "Arbitration",
    "Banking Law", "Consumer Law", "Environmental Law", "Immigration Law",
    "Media Law", "Public Interest Litigation", "General Practice"
  ].sort();
  
  const commonLocations = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
    "Pune", "Ahmedabad", "Gurgaon", "Noida", "Jaipur", "Lucknow",
    "Kochi", "Chandigarh", "Bhopal"
  ].sort();
  
  const expLevels = ["Any", "5+ Years", "10+ Years", "15+ Years", "20+ Years"];

  // State management
  const [selectedSpecialty, setSelectedSpecialty] = useState("Any");
  const [selectedLocation, setSelectedLocation] = useState("Any");
  const [selectedExp, setSelectedExp] = useState("Any");
  const [additionalKeywords, setAdditionalKeywords] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawResults, setRawResults] = useState(null);
  const [processedResults, setProcessedResults] = useState("");

  const handleSearch = async () => {
    // API Keys (Note: In real applications, these should be handled server-side)
    const SERPER_API_KEY = "00bed6629055f888ce9b8a4d47d1f17dab6214d7";
    const GEMINI_API_KEY = "AIzaSyABP0FhpPcNotV7TqlUw38Qm0YpAovfoIY";
    
    if (!SERPER_API_KEY) return setError("Serper API key not configured");
    if (!GEMINI_API_KEY) return setError("Gemini API key not configured");

    // Construct query
    const queryParts = ["Names of lawyers in "];
    if (selectedSpecialty !== "Any") queryParts.push(selectedSpecialty);
    if (selectedLocation !== "Any") queryParts.push(`in ${selectedLocation}`);
    else queryParts.push("India");
    if (selectedExp !== "Any") queryParts.push(selectedExp);
    if (additionalKeywords) queryParts.push(additionalKeywords);
    
    const finalQuery = queryParts.join(" ");
    setSearchQuery(finalQuery);
    setLoading(true);
    setError("");

    try {
      // Serper API call
      const serperResponse = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": SERPER_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          q: finalQuery,
          num: 10
        })
      });

      if (!serperResponse.ok) throw new Error(`API Error: ${serperResponse.status}`);
      const searchResults = await serperResponse.json();
      setRawResults(searchResults);

      // Process with Gemini
      const prompt = `...`; // Keep the same prompt structure as Python version
      
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt.replace("{results}", JSON.stringify(searchResults.organic))
            }]
          }]
        })
      });

      const geminiData = await geminiResponse.json();
      const formattedResults = geminiData.candidates[0].content.parts[0].text;
      setProcessedResults(formattedResults);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🌐 Lawyer Search (via Web)</h2>
      <div className="mb-6">
        <p>Use the filters below to search the web for lawyers or law firms in India.</p>
        <p className="text-sm text-red-600 mt-2">
          Disclaimer: Results are based on web search and are not endorsements.
          Please conduct your own due diligence and verification.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label>Select Specialty:</label>
          <select 
            className="w-full p-2 border rounded"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            {["Any", ...commonSpecialties].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Select Location:</label>
          <select 
            className="w-full p-2 border rounded"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {["Any", ...commonLocations].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Minimum Experience:</label>
          <select 
            className="w-full p-2 border rounded"
            value={selectedExp}
            onChange={(e) => setSelectedExp(e.target.value)}
          >
            {expLevels.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Additional Keywords */}
      <div className="mb-4">
        <label>Add Optional Keywords:</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={additionalKeywords}
          onChange={(e) => setAdditionalKeywords(e.target.value)}
          placeholder="e.g., firm name, specific skill"
        />
      </div>

      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? "Searching..." : "Search Web for Lawyers"}
      </button>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {searchQuery && (
        <div className="bg-blue-100 p-4 rounded mb-4">
          Constructed search query: {searchQuery}
        </div>
      )}

      {processedResults && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Lawyer Information</h3>
          <div className="prose" dangerouslySetInnerHTML={{ __html: processedResults }} />
        </div>
      )}

      {rawResults && (
        <details className="mt-4">
          <summary className="cursor-pointer text-blue-600">View Raw Search Data</summary>
          <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
            {JSON.stringify(rawResults, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default LawyerSearchTab;