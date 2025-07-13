import React, { useState } from "react";
import axios from "axios";

const CreateDr = () => {
  const [doctorData, setDoctorData] = useState({
    name: "",
    specialization: "",
    email: "",
    experience: "",
    password: "",
    availability: [],
  });

  // Handle input change for text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle change for availability (date and time)
  const handleAvailabilityChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAvailability = [...doctorData.availability];
    updatedAvailability[index] = { ...updatedAvailability[index], [name]: value };
    setDoctorData((prevData) => ({ ...prevData, availability: updatedAvailability }));
  };

  // Add new availability slot
  const handleAddAvailability = () => {
    setDoctorData((prevData) => ({
      ...prevData,
      availability: [
        ...prevData.availability,
        { date: "", time: "" },
      ],
    }));
  };

  // Remove availability slot
  const handleRemoveAvailability = (index) => {
    const updatedAvailability = doctorData.availability.filter((_, i) => i !== index);
    setDoctorData((prevData) => ({ ...prevData, availability: updatedAvailability }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Retrieve the token from localStorage
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("You are not logged in! Please log in and try again.");
      return;
    }

    try {
      // Send doctor data to the backend API
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/protected/doctor/admin/create`,
        doctorData,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      console.log("Doctor data submitted successfully: ", response.data);

      
      alert("Doctor created successfully!");
      // Redirect after successful submission, if needed
      // window.location.href = "/somePage";
    } catch (error) {
      console.error("Error submitting doctor data: ", error);
      if (error.response && error.response.status === 401) {
        alert("Unauthorized: Please log in again.");
      } else {
        alert("Failed to create doctor. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r  via-purple-600  min-h-screen">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-3xl space-y-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center">Create Doctor</h1>

        {/* Create Doctor Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="w-full">
              <label htmlFor="name" className="block text-gray-700 text-lg">Doctor's Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={doctorData.name}
                onChange={handleChange}
                required
                className="mt-2 p-4 w-full border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md transition duration-300 ease-in-out hover:shadow-lg"
              />
            </div>
            <div className="w-full">
              <label htmlFor="specialization" className="block text-gray-700 text-lg">Specialization</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={doctorData.specialization}
                onChange={handleChange}
                required
                className="mt-2 p-4 w-full border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md transition duration-300 ease-in-out hover:shadow-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="w-full">
              <label htmlFor="email" className="block text-gray-700 text-lg">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={doctorData.email}
                onChange={handleChange}
                required
                className="mt-2 p-4 w-full border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md transition duration-300 ease-in-out hover:shadow-lg"
              />
            </div>
            <div className="w-full">
              <label htmlFor="experience" className="block text-gray-700 text-lg">Experience</label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={doctorData.experience}
                onChange={handleChange}
                required
                className="mt-2 p-4 w-full border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md transition duration-300 ease-in-out hover:shadow-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="w-full">
              <label htmlFor="password" className="block text-gray-700 text-lg">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={doctorData.password}
                onChange={handleChange}
                required
                className="mt-2 p-4 w-full border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md transition duration-300 ease-in-out hover:shadow-lg"
              />
            </div>
          </div>

          {/* Doctor's Availability Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">Doctor's Availability</h2>
            {doctorData.availability.map((availability, index) => (
              <div key={index} className="flex gap-8 mt-6 items-center">
                <div className="w-full">
                  <label htmlFor={`availability-${index}-date`} className="block text-gray-700">Date</label>
                  <input
                    type="date"
                    id={`availability-${index}-date`}
                    name="date"
                    value={availability.date}
                    onChange={(e) => handleAvailabilityChange(index, e)}
                    required
                    className="mt-2 p-4 w-full border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md transition duration-300 ease-in-out hover:shadow-lg"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor={`availability-${index}-time`} className="block text-gray-700">Time</label>
                  <input
                    type="time"
                    id={`availability-${index}-time`}
                    name="time"
                    value={availability.time}
                    onChange={(e) => handleAvailabilityChange(index, e)}
                    required
                    className="mt-2 p-4 w-full border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md transition duration-300 ease-in-out hover:shadow-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAvailability(index)}
                  className="text-red-500 text-lg mt-6 hover:underline transition duration-300 ease-in-out"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddAvailability}
              className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out"
            >
              Add Availability
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out"
            >
              Create Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDr;
