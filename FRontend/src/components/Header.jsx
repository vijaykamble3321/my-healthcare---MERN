import React from 'react';
import { FaSearch, FaBars, FaHeartbeat, FaBell } from "react-icons/fa";
import { Link } from 'react-router'; // Correct import for Link
import wall1 from "../../src/assets/image/wall1.png"

const Header = ({ toggleSidebar }) => {
  return (
    <div
      className="w-full px-10 py-4 flex justify-between items-center shadow-md"
      style={{
        backgroundImage: 'url(https://example.com/wall1.png)', // Replace with your image URL
        backgroundSize: 'cover', // Ensure the image covers the header
        backgroundPosition: 'center', // Center the image
        backgroundAttachment: 'fixed', // Optional: makes the image stay fixed while scrolling
      }}
    >
      {/* Left Section */}
      <div className="flex items-center text-xl text-black">
        <button
          className="text-black me-4 cursor-pointer transition-transform transform hover:scale-110"
          onClick={toggleSidebar}
        >
          <FaBars />
        </button>
        <FaHeartbeat className="text-3xl text-blue-900 mr-2" />
        <span className="font-semibold text-2xl">My-Healthcare</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-x-6 ml-auto">
        {/* Notifications Icon */}
        <div className="relative text-black">
          <FaBell className="w-6 h-6 cursor-pointer transition-transform transform hover:scale-110" />
          <span className="absolute top-0 right-0 text-xs font-bold text-red-500 bg-white rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
            <FaSearch />
          </span>
          <input
            type="text"
            className="bg-white w-80 md:w-96 px-4 py-2 pl-12 rounded-full shadow-md focus:ring-2 focus:ring-indigo-400 transition-all duration-300 ease-in-out"
            placeholder="Search"
          />
        </div>

        {/* Sign In Button */}
        <Link to="/signin">
          <button className="text-white py-2 px-6 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300">
            LogOut
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
