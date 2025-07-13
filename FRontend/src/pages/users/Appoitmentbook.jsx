import React, { useState, useEffect } from 'react';
import API from '../../Utils/API'; // Ensure to import your API configuration

const AppointmentBook = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [doctorAvailability, setDoctorAvailability] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await API.get('/api/protected/user/getall');
        const availableDoctors = response.data.data.filter(doctor => doctor.availability.length > 0);
        setDoctors(availableDoctors);
      } catch (err) {
        setError('Failed to fetch doctor data. Please try again later.');
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setSelectedDoctor(doctorId);

    const selectedDoctor = doctors.find(doctor => doctor._id === doctorId);
    if (selectedDoctor) {
      setDoctorAvailability(selectedDoctor.availability);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !appointmentDate || !name) {
      setError('Please select a doctor, provide your name, and select an appointment date.');
      return;
    }

    try {
      const appointmentData = { doctorId: selectedDoctor, appointmentDate, name };
      const response = await API.post('/api/protected/user/appoitment', appointmentData);
      setSuccessMessage('Appointment successfully booked!');
      setError(null);
    } catch (err) {
      setError('Failed to book appointment. Please try again later.');
      setSuccessMessage('');
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const groupAvailabilityByDate = () => {
    const grouped = {};
    doctorAvailability.forEach((slot) => {
      const date = formatDate(slot.date);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });
    return grouped;
  };

  const availabilityByDate = groupAvailabilityByDate();

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Book an Appointment</h1>

      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-gray-700">Select Doctor</label>
          <select
            value={selectedDoctor}
            onChange={handleDoctorChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">--Select a Doctor--</option>
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))
            ) : (
              <option disabled>No available doctors</option>
            )}
          </select>
        </div>

        {selectedDoctor && (
          <div>
            <label className="block text-gray-700">Select Appointment Date</label>
            <select
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">--Select a Date--</option>
              {Object.keys(availabilityByDate).map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedDoctor && doctorAvailability.length === 0 && (
          <div className="text-red-500 mt-2">No available slots for this doctor.</div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentBook;
