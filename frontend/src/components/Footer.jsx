import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white ">
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> */}
      <div className=" border-gray-700  pt-3 text-center pb-3 text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
      {/* </div> */}
    </footer>
  );
}

export default Footer;
