// legal_research_logic.jsx
import { useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { setResponse } from "../responseStore.js";
import { GEMINI_API_KEY } from "../../../secrets/env.js";

const LegalResearchLogic = ({ researchTopic }) => {
  useEffect(() => {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const generateReport = async () => {
      if (!researchTopic.trim()) return;

      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          Conduct thorough legal research on the topic '${researchTopic}', focusing specifically on Indian law. 
          Generate a detailed and comprehensive research document covering the following aspects:
          1. Applicable Indian statutes and the relevant legal framework.
          2. Leading case laws and significant legal precedents from Indian courts.
          3. Key legal principles and common interpretations related to the topic.
          4. Any recent developments, amendments, or important judicial trends in India.
          5. Different perspectives or nuances on any contentious issues within the topic.

          Structure the output logically with clear headings and sections. Provide proper citations for statutes and case laws where possible. 
          Ensure the information is accurate and reflects the current state of Indian law.
          Format the output using Markdown.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        setResponse(text);
        console.log("Generated Report:", text);
      } catch (err) {
        console.error("Error generating report:", err.message);
        setResponse(`❌ Error: ${err.message}`);
      }
    };

    generateReport();
  }, [researchTopic]);

  return null; // No UI
};

export default LegalResearchLogic;
