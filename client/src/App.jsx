import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LawRoadMap from "./components/LawRoadMap/LawRoadMap.jsx";
// import {
//   LegalReserach,
//   LegalAdvice,
//   ContractDrafting,
//   DocumentReview,
//   CasePrediction,
//   LegalClinicMap,
//   SimilarCases,
//   LawyerSearch,
// } from "./components/AI-Features/index.js";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/law-roadmap" element={<LawRoadMap />} />
          {/* <Route path="/legal-research" element={<LegalReserach />} />
          <Route path="/legal-advice" element={<LegalAdvice />} />
          <Route path="/contract-drafting" element={<ContractDrafting />} />
          <Route path="/document-review" element={<DocumentReview />} />
          <Route path="/case-prediction" element={<CasePrediction />} />
          <Route path="/legal-clinic-map" element={<LegalClinicMap />} />
          <Route path="/similar-cases" element={<SimilarCases />} />
          <Route path="/lawyer-search" element={<LawyerSearch />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
