import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPen } from "react-icons/fa";
import API from "../../Utils/API";
import WritePrescription from "../Doctor/Writeperciption";

const ViewAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/protected/doctor/patient/appointments");
      const appointmentsData = response.data?.data || response.data;

      if (Array.isArray(appointmentsData)) {
        setAppointments(appointmentsData);
      } else {
        throw new Error("Unexpected response format");
      }
      setSuccessMessage("Appointments fetched successfully!");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch appointment data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        const response = await API.delete(`/api/protected/doctor/patient/deleteAppointment/${appointmentId}`);
        if (response.status === 200) {
          setAppointments(appointments.filter((appointment) => appointment._id !== appointmentId));
          setSuccessMessage("Appointment deleted successfully!");
        }
      } catch (error) {
        alert("Failed to delete the appointment.");
      }
    }
  };

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
  };

  const handleSaveEdit = async () => {
    if (!editingAppointment) return;

    try {
      const response = await API.put(
        `/api/protected/doctor/patient/updateAppointment/${editingAppointment._id}`,
        editingAppointment
      );
      if (response.status === 200) {
        fetchAppointments();
        setEditingAppointment(null);
        setSuccessMessage("Appointment updated successfully!");
      }
    } catch (error) {
      alert("Failed to update the appointment.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingAppointment((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openPrescriptionForm = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPrescriptionForm(true);
  };

  const closePrescriptionForm = () => {
    setShowPrescriptionForm(false);
    setSelectedAppointment(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Appointments</h1>
        
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            {error}
          </div>
        )}

        {editingAppointment && (
          <div className="bg-white p-6 shadow-md rounded-lg mb-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Edit Appointment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Patient Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingAppointment.name || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Appointment Date</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={editingAppointment.appointmentDate?.split('T')[0] || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setEditingAppointment(null)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600 font-semibold uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-gray-600 font-semibold uppercase tracking-wider">
                  Appointment Date
                </th>
                <th className="px-6 py-3 text-left text-gray-600 font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-gray-600 font-semibold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.name || "Unknown Patient"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.userId?.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(appointment.appointmentDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {appointment.status || 'scheduled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(appointment)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          title="Edit"
                        >
                          <FaEdit className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(appointment._id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                          title="Delete"
                        >
                          <FaTrash className="mr-1" /> Delete
                        </button>
                        <button
                          onClick={() => openPrescriptionForm(appointment)}
                          className="text-green-600 hover:text-green-900 flex items-center"
                          title="Write Prescription"
                        >
                          <FaPen className="mr-1" /> Prescription
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescription Form Modal */}
      {showPrescriptionForm && selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Write Prescription for {selectedAppointment.name}
                  </h3>
                  <button
                    onClick={closePrescriptionForm}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4">
                  <WritePrescription 
                    appointment={selectedAppointment} 
                    onClose={closePrescriptionForm}
                    onSuccess={() => {
                      setSuccessMessage("Prescription created successfully!");
                      fetchAppointments();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAppointment;