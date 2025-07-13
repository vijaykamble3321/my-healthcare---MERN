import React from "react";
import adimndash from "../../assets/image/adimndash.jpg"; // Correct import

const AdminDash = () => {
  // Define the animation using inline style
  const animationStyle = {
    animation: "fadeInUp 1s ease-out forwards", // Apply the animation here
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      {/* Title with Animation */}
      <h1 className="text-4xl font-bold text-blue-500 mb-8" style={animationStyle}>
        Hello, Admin Dashboard
      </h1>

      {/* Health Care Image */}
      <div className="w-full max-w-4xl mb-6">
        <img
          src={adimndash} // Use the imported image variable here
          alt="Health Care"
          className="w-full rounded-lg shadow-lg"
        />
      </div>

      {/* Welcome Text */}
      <div className="text-center mt-6">
        <p className="text-lg text-gray-600">Welcome to the Admin Dashboard</p>
      </div>

      {/* Add the CSS for the fadeInUp animation */}
      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default AdminDash;
