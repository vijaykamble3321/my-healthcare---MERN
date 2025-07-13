import React from "react";
import Sidebar from "../../components/Sidebar";
import { Outlet } from "react-router";
import Header from "../../components/Header";
import API from "../../Utils/API";

const AdminLayout = () => {
  // Optional redirect logic
  React.useEffect(() => {
    API.get("/api/protected/redirect");
  }, []);

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Fixed Sidebar */}
      <div className="h-full w-72 bg-gray-800 text-white fixed top-0 left-0 shadow-lg z-50">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-72">
        {/* Header */}
        <div className="h-16 bg-gradient-to-r from-indigo-800 to-purple-700 text-white shadow-lg flex items-center px-6">
          <Header /> {/* toggleSidebar prop removed */}
        </div>

        <div className="bg-gray-100 flex-1 overflow-y-auto m-4 rounded-lg shadow-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
