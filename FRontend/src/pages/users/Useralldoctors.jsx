import React, { useState, useEffect } from 'react';
import API from '../../Utils/API';

const Useralldoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Fetching doctors data from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await API.get('/api/protected/user/getall', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        console.log('API Response:', response);

        if (response.data && response.data.data) {
          setDoctors(response.data.data); // Set the doctors list from response.data.data
        } else {
          setError('No data received from the API');
        }
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to fetch doctor data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

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

  if (loading) {
    return <div className="loading-indicator">Loading doctors...</div>;
  }

  if (error) {
    return <div className="error-message text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">All Doctors</h1>

      {/* Search Bar */}
      <div className="mb-6 text-center">
        <div className="relative inline-block">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full md:w-96 py-2 pl-10 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search doctors by name or specialization..."
          />
        </div>
      </div>

      {/* Doctors Display Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-700">{doctor.name}</h3>
              <p className="text-gray-500 mt-1">{doctor.specialization}</p>
              <p className="text-gray-500 mt-1">Experience: {doctor.experience} years</p>

              {/* Availability Dates */}
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-700">Availability:</h4>
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

              {/* Doctor ID */}
              <div className="mt-4 text-sm text-gray-500">Doctor ID: {doctor._id}</div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">
            No doctors found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default Useralldoctors;
