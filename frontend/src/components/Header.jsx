import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-dairy-primary">
              Logo
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-dairy-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-dairy-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-dairy-primary transition-colors"
            >
              Services
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-dairy-primary transition-colors"
            >
              Contact
            </Link>
          </div>
          <Link
            to="/get-started"
            className="bg-gradient-dairy text-white px-6 py-2 rounded-full hover:bg-gradient-dairy-hover transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
