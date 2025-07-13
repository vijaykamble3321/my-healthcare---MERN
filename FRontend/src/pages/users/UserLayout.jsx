// UserLayout.js
import React from "react";
import { Outlet } from "react-router";
import Usersidebar from "./Usersidebar";
import Userheader from "./Userheader";

const UserLayout = () => {
  const header = "User Dashboard";

  const buttons = [
    {
      name: "Doctors",
      path: "/users/doctors",
    },
  ];

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Fixed Sidebar - Always visible */}
      <div className="h-full w-72 bg-gray-800 text-white fixed top-0 left-0 shadow-lg z-50">
        <Usersidebar header={header} buttons={buttons} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-72">
        {/* Header */}
        <header className="h-16 shadow-lg">
          <Userheader />
        </header>

        {/* Main Content */}
        <main className="bg-gray-100 flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;