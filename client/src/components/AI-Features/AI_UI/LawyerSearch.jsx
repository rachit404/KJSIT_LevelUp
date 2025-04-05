import React, { useState } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { GEMINI_API_KEY, SERPER_API_KEY } from "../../../secrets/env.js";

const LawyerSearch = () => {
  const specialties = [
    "Corporate Law",
    "Criminal Law",
    "Property Law",
    "Family Law",
    "IP Law",
    "Labor Law",
    "Tax Law",
    "Cyber Law",
    "Civil Litigation",
    "Arbitration",
    "Banking Law",
    "Consumer Law",
    "Environmental Law",
    "Immigration Law",
    "Media Law",
    "Public Interest Litigation",
    "General Practice",
  ].sort();

  const locations = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Gurgaon",
    "Noida",
    "Jaipur",
    "Lucknow",
    "Kochi",
    "Chandigarh",
    "Bhopal",
  ].sort();

  const experience = ["Any", "5+ Years", "10+ Years", "15+ Years", "20+ Years"];

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
    if (!SERPER_API_KEY) return setError("Serper API key not configured");
    if (!GEMINI_API_KEY) return setError("Gemini API key not configured");

    const queryParts = ["Names of lawyers in"];
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
      const serperResponse = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": SERPER_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: finalQuery, num: 10 }),
      });

      if (!serperResponse.ok)
        throw new Error(`API Error: ${serperResponse.status}`);
      const searchResults = await serperResponse.json();
      setRawResults(searchResults);

      const prompt = `Extract and summarize names and contact information of lawyers or firms from this search data: {results}`;

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt.replace(
                      "{results}",
                      JSON.stringify(searchResults.organic)
                    ),
                  },
                ],
              },
            ],
          }),
        }
      );

      const geminiData = await geminiResponse.json();
      const formattedResults =
        geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

      setProcessedResults(formattedResults || "No results found.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4 text-center">
        🔍 Find Verified Lawyers in India
      </h2>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
        <p className="text-gray-700">
          Use the filters below to search for lawyers or law firms across India.
        </p>
        <p className="text-sm text-red-600 mt-2">
          ⚠️ Disclaimer: Results are based on web search and may not be fully
          verified.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-6 border grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-medium mb-1">Select Specialty:</label>
          <select
            className="w-full p-2 border rounded-md bg-white"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            {["Any", ...specialties].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Select Location:</label>
          <select
            className="w-full p-2 border rounded-md bg-white"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            {["Any", ...locations].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Experience:</label>
          <select
            className="w-full p-2 border rounded-md bg-white"
            value={selectedExp}
            onChange={(e) => setSelectedExp(e.target.value)}
          >
            {experience.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Add Optional Keywords:</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="e.g., firm name, landmark, language"
          value={additionalKeywords}
          onChange={(e) => setAdditionalKeywords(e.target.value)}
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <FaSearch />
            Search Lawyers
          </>
        )}
      </button>

      {error && (
        <div className="text-red-600 mt-4 border border-red-300 bg-red-50 p-4 rounded">
          {error}
        </div>
      )}

      {searchQuery && (
        <div className="mt-4 bg-blue-50 border border-blue-200 p-4 rounded">
          <span className="font-semibold">Search Query:</span> {searchQuery}
        </div>
      )}

      {processedResults && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">🔎 Results</h3>

          <div className="grid gap-4">
            {processedResults
              .split("\n")
              .filter((line) => line.trim() !== "")
              .map((line, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded p-4 shadow-sm"
                >
                  <p className="text-gray-800 leading-relaxed">{line}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {rawResults && (
        <details className="mt-6">
          <summary className="cursor-pointer text-blue-600 font-medium">
            View Raw Search Data
          </summary>
          <pre className="bg-gray-100 p-4 mt-2 rounded overflow-auto">
            {JSON.stringify(rawResults, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default LawyerSearch;
