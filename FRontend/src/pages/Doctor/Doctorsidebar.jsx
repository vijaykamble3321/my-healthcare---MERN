import React from 'react';
import { Link } from 'react-router'; // Using React Router for navigation
import { FaList, FaNotesMedical, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa'; // Using Font Awesome icons

const Doctorsidebar = () => {
  return (
    <div className="w-64 h-screen bg-gradient-to-r from-indigo-800 to-purple-700 text-white flex flex-col">
      {/* Sidebar Header */}
      <div className="flex items-center justify-center p-6">
        <h2 className="text-2xl font-semibold">Doctor Dashboard</h2>
      </div>

      {/* Sidebar Links */}
      <div className="flex flex-col gap-4 p-4">
        {/* View Appointments */}
        <Link to="ViewAppointment" className="flex items-center gap-3 p-3 hover:bg-indigo-600 rounded-lg transition-all duration-300">
          <FaCalendarAlt className="text-2xl" />
          <span className="text-lg">
            View Appointments</span>
        </Link>

        {/* View Patient Prescription */}
        <Link to="WritePrescription" className="flex items-center gap-3 p-3 hover:bg-indigo-600 rounded-lg transition-all duration-300">
          <FaNotesMedical className="text-2xl" />
          <span className="text-lg">WritePrescription</span>
        </Link>
        

        {/* View All Patients */}
       

        {/* Log out */}
        <Link to="/" className="flex items-center gap-3 p-3 mt-auto hover:bg-indigo-600 rounded-lg transition-all duration-300">
          <FaSignOutAlt className="text-2xl" />
          <span className="text-lg">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Doctorsidebar;
