import React, { useState, useEffect } from 'react';
import API from '../../Utils/API'; // Ensure this is your API config file

const ViewPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [error, setError] = useState(null);
  const [showCurrent, setShowCurrent] = useState(true); // State for toggling current prescriptions
  const [comment, setComment] = useState(''); // State for storing user comments

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await API.get('/api/protected/user/getperciption'); // Fetch prescriptions
        setPrescriptions(response.data.data); // Save the prescriptions data
        const doctorIds = response.data.data.map((prescription) => prescription.doctorId);
        fetchDoctors(doctorIds); // Fetch doctors by their IDs
      } catch (err) {
        setError('Failed to fetch prescriptions. Please try again later.');
      }
    };

    const fetchDoctors = async (doctorIds) => {
      try {
        // Fetch doctors based on the doctorIds from prescriptions
        const response = await API.get('/api/protected/user/getall'); // This endpoint should return all doctors
        const doctorsData = response.data.data;

        // Map doctor IDs to doctor names
        const doctorsMap = doctorsData.reduce((acc, doctor) => {
          if (doctorIds.includes(doctor._id)) {
            acc[doctor._id] = doctor.name;
          }
          return acc;
        }, {});
        
        setDoctors(doctorsMap); // Store the doctor names in the state
      } catch (err) {
        setError('no perciptions.');
      }
    };

    fetchPrescriptions();
  }, []); // Run once when the component mounts

  // Filter prescriptions based on whether they are current or previous
  const filterPrescriptions = () => {
    const today = new Date().setHours(0, 0, 0, 0); // Get today's date at midnight
    const currentPrescriptions = prescriptions.filter((prescription) => {
      const createdAt = new Date(prescription.createdAt).setHours(0, 0, 0, 0); // Set prescription date to midnight
      return createdAt === today;
    });

    const previousPrescriptions = prescriptions.filter((prescription) => {
      const createdAt = new Date(prescription.createdAt).setHours(0, 0, 0, 0); // Set prescription date to midnight
      return createdAt < today;
    });

    if (showCurrent) {
      setFilteredPrescriptions(currentPrescriptions);
    } else {
      setFilteredPrescriptions(previousPrescriptions);
    }
  };

  // Handle comment box input
  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  // Handle current and previous prescription toggle
  const handleTogglePrescriptions = (isCurrent) => {
    setShowCurrent(isCurrent);
    filterPrescriptions();
  };

  useEffect(() => {
    filterPrescriptions(); // Re-filter prescriptions when the toggle state changes
  }, [showCurrent, prescriptions]);

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Your Prescriptions</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Button Section */}
      <div className="mb-4">
        <button
          onClick={() => handleTogglePrescriptions(true)}
          className={`px-6 py-2 mr-4 ${showCurrent ? 'bg-blue-500' : 'bg-gray-200'} text-white rounded-lg`}
        >
          Current Prescriptions
        </button>
        <button
          onClick={() => handleTogglePrescriptions(false)}
          className={`px-6 py-2 ${!showCurrent ? 'bg-blue-500' : 'bg-gray-200'} text-white rounded-lg`}
        >
          Previous Prescriptions
        </button>
      </div>

      {filteredPrescriptions.length === 0 ? (
        <div className="text-gray-500">No prescriptions found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Iterate through prescriptions and display each in a card */}
          {filteredPrescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              <h2 className="text-lg font-semibold text-gray-700">{prescription.diagnosis}</h2>
              <p className="text-sm text-gray-500">
                <strong>Date:</strong> {new Date(prescription.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Doctor:</strong> {doctors[prescription.doctorId] || 'Unknown Doctor'}
              </p>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">Medications:</h3>
                <ul className="list-disc pl-5 text-sm">
                  {prescription.medications.map((medication) => (
                    <li key={medication._id}>
                      {medication.name} - {medication.dosage} - {medication.duration}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">Notes:</h3>
                <p className="text-sm text-gray-600">{prescription.notes}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment Box Section */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700">Add a Comment</h3>
        <textarea
          value={comment}
          onChange={handleCommentChange}
          rows="4"
          className="w-full p-4 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add your comments here..."
        ></textarea>
      </div>
    </div>
  );
};

export default ViewPrescriptions;
