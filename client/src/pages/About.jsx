import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          About Law RoadMap
        </h1>
        <p className="text-gray-600 mb-6 max-w-3xl">
          Law RoadMap is a dedicated platform designed to simplify legal
          education and career planning for students, professionals, and
          enthusiasts. Whether you're exploring foundational concepts or
          advanced specializations, our resources, interactive tools, and expert
          guidance are tailored to your needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            title="Our Mission"
            content="To democratize access to legal knowledge and guide individuals through personalized career paths in the legal domain."
          />
          <Card
            title="Who We Help"
            content="Law students, educators, career switchers, and lifelong learners looking to navigate the legal landscape."
          />
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, content }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
    <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
    <p className="text-gray-600">{content}</p>
  </div>
);

export default About;
