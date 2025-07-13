import React, { useState, useEffect } from 'react';
import API from '../../Utils/API'; // Assuming you have an API helper file for requests

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Make the API request without the access token
        const response = await API.get("/api/protected/user/userprofile");

        if (response.data && response.data.data) {
          setUserData(response.data.data);
        } else {
          setError("Unexpected response structure.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setError("Error fetching user profile.");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center text-blue-500">
        <span className="text-xl">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center text-red-500">
        <span className="text-xl">{error}</span>
      </div>
    );
  }

  if (userData) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-700">User Profile</h1>
        </div>
        <div className="space-y-4">
          <p className="text-lg text-gray-700">
            <strong className="font-medium text-gray-900">First Name:</strong> {userData.fname}
          </p>
          <p className="text-lg text-gray-700">
            <strong className="font-medium text-gray-900">Last Name:</strong> {userData.lname}
          </p>
          <p className="text-lg text-gray-700">
            <strong className="font-medium text-gray-900">Email:</strong> {userData.email}
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default UserProfile;
