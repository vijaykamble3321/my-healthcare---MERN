import React, { useEffect } from "react";
import { Link } from "react-router"; // Corrected import
import { FaUserMd, FaUsers, FaUserPlus } from "react-icons/fa";

const Sidebar = ({ header }) => {
  useEffect(() => {
    console.log("Sidebar Header:", header);
  }, [header]);

  return (
    <div
      className="flex flex-col h-full w-72 text-white p-6 shadow-lg"
      style={{
        background: "linear-gradient(135deg, #4285F4, #34A853, #FBBC05, #DB4437)",
        backgroundSize: "400% 400%",
        animation: "gradientAnimation 8s ease infinite",
      }}
    >
      {/* Header */}
      <h2 className="text-2xl font-extrabold text-center text-white py-5 px-4 bg-blue-900 rounded-xl mb-10 shadow-md tracking-wide">
        {header || "Healthcare"} Admin
      </h2>

      {/* Navigation Links */}
      <nav className="space-y-6">
        {/* Create Doctors */}
        <Link
          to="CreateDr"
          className="flex items-center gap-4 py-3 px-5 bg-blue-700 hover:bg-blue-600 rounded-xl transition-all duration-300 shadow-md"
        >
          <FaUserPlus className="text-xl" />
          <span className="text-lg font-medium">Create Doctors</span>
        </Link>

        {/* All Doctors */}
        <Link
          to="Alldoctors"
          className="flex items-center gap-4 py-3 px-5 bg-blue-700 hover:bg-blue-600 rounded-xl transition-all duration-300 shadow-md"
        >
          <FaUserMd className="text-xl" />
          <span className="text-lg font-medium">All Doctors</span>
        </Link>

        {/* Patients */}
        <Link
          to="Patients"
          className="flex items-center gap-4 py-3 px-5 bg-blue-700 hover:bg-blue-600 rounded-xl transition-all duration-300 shadow-md"
        >
          <FaUsers className="text-xl" />
          <span className="text-lg font-medium">Patients</span>
        </Link>
      </nav>

      {/* Gradient Animation Keyframes */}
      <style>
        {`
          @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default Sidebar;
