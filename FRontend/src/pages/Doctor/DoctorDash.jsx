import React from 'react';
import wall3 from "../../assets/image/wall3.jpg"; // Correct import

const DoctorDash = () => {
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
        Hello, Doctor Dashboard
      </h1>

      {/* Health Care Image */}
      <div className="w-full max-w-4xl mb-6">
        <img
          src={wall3} // Use the imported image variable here
          alt="Doctor's Dashboard"
          className="w-full rounded-lg shadow-lg"
        />
      </div>

      {/* Welcome Text */}
      <div className="text-center mt-6">
        <p className="text-lg text-gray-600">Welcome to the Doctor Dashboard</p>
      </div>
    </div>
  );
};

export default DoctorDash;
