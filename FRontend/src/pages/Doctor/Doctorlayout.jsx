// Doctorlayout.js
import React, { useState } from "react";
import { Outlet } from "react-router";
import Doctorsidebar from "./Doctorsidebar";
import Header from "../../components/Header";

const Doctorlayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const header = "Doctor Dashboard";
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <div 
        className={`h-full bg-gray-800 text-white transition-all duration-300 ease-in-out 
          ${sidebarOpen ? 'w-64' : 'w-20'} fixed top-0 left-0 shadow-lg z-50`}
      >
        <Doctorsidebar 
         
        />
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out 
        ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Doctorlayout;