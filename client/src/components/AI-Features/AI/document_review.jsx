import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { GoogleGenerativeAI } from "@google/generative-ai";

pdfjsLib.GlobalWorkerOptions.workerSrc = false;

const GEMINI_API_KEY = "AIzaSyABP0FhpPcNotV7TqlUw38Qm0YpAovfoIY";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const PDFAnalyzer = () => {
  const [pdfText, setPdfText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");

  const extractTextFromPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join(" ");
      fullText += `Page ${pageNum}:\n${pageText}\n\n`;
    }

    return fullText;
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const text = await extractTextFromPDF(file);
    setPdfText(text);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(
      `Summarize this legal document:\n\n${text}`
    );
    const response = await result.response;
    setSummary(response.text());
    setLoading(false);
  };

  const handleChat = async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      { role: "user", parts: [{ text: `Document:\n${pdfText}\n\nQuestion: ${chatInput}` }] },
    ]);
    const response = await result.response;
    setChatResponse(response.text());
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>📄 Legal PDF Analyzer with Gemini</h2>

      <input type="file" accept=".pdf" onChange={handleUpload} />
      {loading && <p>Extracting & summarizing PDF...</p>}

      {summary && (
        <>
          <h3>📝 Summary</h3>
          <pre style={{ background: "#f5f5f5", padding: "1rem" }}>{summary}</pre>
        </>
      )}

      {pdfText && (
        <>
          <h3>💬 Chat With PDF</h3>
          <input
            type="text"
            placeholder="Ask a question about the PDF..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            style={{ width: "80%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <button onClick={handleChat}>Ask</button>
          {chatResponse && (
            <pre style={{ background: "#eef", padding: "1rem", marginTop: "1rem" }}>
              {chatResponse}
            </pre>
          )}
        </>
      )}
    </div>
  );
};

export default PDFAnalyzer;
