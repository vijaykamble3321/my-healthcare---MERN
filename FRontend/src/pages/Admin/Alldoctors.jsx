import React, { useState, useEffect } from "react";
import { FaEnvelope, FaBriefcase, FaCalendarAlt, FaSearch } from "react-icons/fa"; // Import icons
import API from "../../Utils/API";

const Alldoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        console.error("Authorization token is missing!");
        return;
      }

      const res = await API.get("/api/protected/doctor/admin/allDoctor", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDoctors(res.data.data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    }
  };

  // Filter doctors based on the search query
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle the search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-center mb-6">All Doctors</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search doctors by name or specialization..."
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Doctors Display Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-700">{doctor.name}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <FaEnvelope className="mr-2" /> {doctor.email}
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <FaBriefcase className="mr-2" /> {doctor.specialization}
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <FaBriefcase className="mr-2" /> {doctor.experience} years of experience
              </div>

              {/* Availability Dates */}
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                  <FaCalendarAlt className="mr-2" /> Availability:
                </h4>
                {doctor.availability.length > 0 ? (
                  <ul className="list-disc pl-5 mt-2">
                    {doctor.availability.map((av, index) => (
                      <li key={index} className="text-sm text-gray-500">
                        {new Date(av.date).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No availability data available.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No doctors found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default Alldoctors;
