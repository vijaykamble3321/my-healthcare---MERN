import React from 'react';
// import wall4 from "../../assets/image/wall4"; // Correct import
import wall4 from "../../assets/image/wall4.jpg"
const UserDash = () => {
  // Define the animation using inline style
  const animationStyle = {
    animation: 'fadeInUp 1s ease-out forwards',
  };

  // Inline CSS for the keyframes animation
  const styles = {
    '@keyframes fadeInUp': {
      '0%': {
        opacity: 0,
        transform: 'translateY(20px)', // Start below the original position
      },
      '100%': {
        opacity: 1,
        transform: 'translateY(0)', // End at the original position
      },
    },
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      {/* Title with Animation */}
      <h1 className="text-4xl font-bold text-blue-500 mb-8" style={animationStyle}>
        Hello, User Dashboard
      </h1>

      {/* User Image */}
      <div className="w-full max-w-4xl mb-6">
        <img
          src={wall4} // Use the imported image variable here
          alt="User's Dashboard"
          className="w-full rounded-lg shadow-lg"
        />
      </div>

      {/* Welcome Text */}
      <div className="text-center mt-6">
        <p className="text-lg text-gray-600">Welcome to the User Dashboard</p>
      </div>
    </div>
  );
};

export default UserDash;
