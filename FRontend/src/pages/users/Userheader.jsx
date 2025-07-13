// Userheader.js
import React from 'react';
import { FaSearch, FaBell, FaUser, FaBars } from 'react-icons/fa';
import { Link } from 'react-router';

const Userheader = () => {
  return (
    <div className="w-full px-6 py-4 flex justify-between items-center bg-gradient-to-r from-indigo-400 to-purple-400 text-white">
      {/* Left Section - Removed sidebar toggle button since sidebar is always visible */}
      <div className="flex items-center text-xl">
        <FaUser className="text-3xl text-black mr-2" />
        <span className="font-semibold text-2xl text-black ">User Dashboard</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-x-6">
        {/* Notifications Icon */}
        <div className="relative">
          <FaBell className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
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
            className="bg-white w-40 md:w-64 px-4 py-2 pl-12 rounded-full shadow-md focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
            placeholder="Search"
          />
        </div>

        {/* User Profile Button */}
        <Link to="/UserProfile">
          <button className="text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition-all duration-300">
            Profile
          </button>
        </Link>

        {/* LogOut Button */}
        <Link to="/signin">
          <button className="text-white py-2 px-4 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-300">
            LogOut
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Userheader;