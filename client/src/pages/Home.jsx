import React from "react";
import { Book, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Welcome to Law RoadMap</h1>
          <p className="text-blue-100 max-w-xl mx-auto">
            Your guide to legal education, resources, and career opportunities
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex-1">
        <section className="mb-12 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Get Started on Your Legal Journey
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Explore legal pathways, interactive roadmaps, and expert resources
            tailored to guide you in your legal career.
          </p>
          <Link
            to="/roadmap"
            className="inline-flex items-center bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Explore Roadmap <ArrowRight className="ml-2" size={18} />
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Feature
            icon={<Book />}
            title="Study Materials"
            desc="Access curated legal textbooks and reference guides."
          />
          <Feature
            icon={<ChevronRight />}
            title="Case Examples"
            desc="Learn from real-world case studies and decisions."
          />
          <Feature
            icon={<ChevronRight />}
            title="Career Advice"
            desc="Understand legal specializations and how to pursue them."
          />
        </section>
      </main>
    </div>
  );
};

const Feature = ({ icon, title, desc }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
    <div className="text-blue-600 mb-3">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default Home;
