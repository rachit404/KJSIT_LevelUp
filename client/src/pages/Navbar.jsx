import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 w-full">
      <div className="max-w-7xl mx-5 px-4 ">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 ml-0.7">
            <Link to="/" className="text-xl font-bold text-indigo-600">
              LawFlow
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-4">
            <Link
              to="/law-roadmap"
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              RoadMap
            </Link>

            <Link
              to="/about"
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              Contact
            </Link>
          </div>

          {/* Optional Button */}
          <div className="hidden md:block">
            {/* <Link
              to="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Login
            </Link> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
