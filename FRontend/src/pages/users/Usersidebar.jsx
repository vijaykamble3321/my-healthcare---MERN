import React from 'react';
import { Link } from 'react-router'; 

const Usersidebar = () => {
  return (
    <div className="w-74 bg-sky-100  h-screen text-white">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6 text-black">User Dashboard</h2>
        
        {/* Sidebar Menu */}
        <ul className="space-y-4">
          <li>
            <Link to="Useralldoctors">
              <button className="w-full text-left px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white">
                All Doctors
              </button>
            </Link>
          </li>
          <li>
            <Link to="Appoitmentbook">
              <button className="w-full text-left px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white">
                Appointment Book
              </button>
            </Link>
            
          </li>
          <li>
            <Link to="ViewPerception">
              <button className="w-full text-left px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white">
                View Dr. Prescription
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Usersidebar;
