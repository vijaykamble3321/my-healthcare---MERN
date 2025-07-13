import React, { useState, useEffect } from "react";
import API from "../../Utils/API"; // Assuming you have a utility to handle the API requests

const Patients = () => {
  const [patients, setPatients] = useState([]); // Default as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetching patients data from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await API.get("/api/protected/allpetient/getallpetient");

        console.log("API Response:", response);

        if (Array.isArray(response.data.data)) {
          setPatients(response.data.data); // Set patients data to state
        } else {
          console.log("Unexpected response format:", response.data);
          throw new Error("Invalid response format");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Failed to fetch patient data. Please try again later.");
        setLoading(false);
      }
    };

    fetchPatients();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Show loading indicator while data is being fetched
  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  // Display error message if API request fails
  if (error) {
    return <div className="text-center text-red-500 text-lg">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Patients List</h1>

      {/* Table to display patient details */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Patient Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Total Appointments</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Today's Appointments</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(patients) && patients.length > 0 ? (
              patients.map((patient, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm">{patient.patientName}</td>
                  <td className="px-6 py-3 text-sm">{patient.email}</td>
                  <td className="px-6 py-3 text-sm">{patient.totalAppointments}</td>
                  <td className="px-6 py-3 text-sm">{patient.todayAppointments}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-6 py-4 text-gray-500">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Button to add a new patient */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => alert("Add a new patient")}
          className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
        >
          Add New Patient
        </button>
      </div>
    </div>
  );
};

export default Patients;
