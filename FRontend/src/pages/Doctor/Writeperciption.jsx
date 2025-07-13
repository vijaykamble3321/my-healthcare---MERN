import React, { useState, useEffect } from 'react';
import API from '../../Utils/API';

const WritePrescription = () => {
  // State management
  const [appointments, setAppointments] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [medications, setMedications] = useState([{ name: '', dosage: '', duration: '' }]);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState({
    patients: true,
    submitting: false
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  // Fetch appointments data
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(prev => ({ ...prev, patients: true }));
        setError(null);
        
        const response = await API.get('/api/protected/doctor/getallpatient');
        console.log('API Response:', response.data); // Debug log
        
        // Handle the nested data structure correctly
        if (response.data && response.data.data && response.data.data.data) {
          const appointmentsData = Array.isArray(response.data.data.data) 
            ? response.data.data.data 
            : [];
          
          setAppointments(appointmentsData);
          
          if (appointmentsData.length === 0) {
            setError('No patients found. Please create appointments first.');
          } else {
            setError(null); // Clear error if data exists
          }
        } else {
          throw new Error('Invalid data structure from API');
        }
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError(err.message || 'Failed to load patient data');
        setAppointments([]);
      } finally {
        setLoading(prev => ({ ...prev, patients: false }));
      }
    };

    fetchAppointments();
  }, []);

  // Medication handlers
  const handleMedicationChange = (index, e) => {
    const newMedications = [...medications];
    newMedications[index][e.target.name] = e.target.value;
    setMedications(newMedications);
  };

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', duration: '' }]);
  };

  const removeMedication = (index) => {
    if (medications.length <= 1) return;
    const newMedications = [...medications];
    newMedications.splice(index, 1);
    setMedications(newMedications);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!patientId) {
      setError('Please select a patient');
      return;
    }

    setLoading(prev => ({ ...prev, submitting: true }));
    setError(null);
    setSuccess(false);

    try {
      const response = await API.post('/api/protected/doctor/prescriptions', {
        patientId,
        medications: medications.filter(med => med.name && med.dosage && med.duration),
        diagnosis,
        notes
      });

      if (response.data?.success) {
        setSuccess(true);
        setResponseMessage(`Prescription created successfully! ID: ${response.data.prescriptionId || ''}`);
        // Reset form
        setPatientId('');
        setMedications([{ name: '', dosage: '', duration: '' }]);
        setDiagnosis('');
        setNotes('');
      } else {
        throw new Error(response.data?.message || 'Prescription creation failed');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create prescription');
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-gray-700 mb-6">Write Prescription</h1>

      {/* Status messages */}
      {error && !loading.submitting && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {responseMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Dropdown */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Select Patient {loading.patients && '(Loading...)'}
          </label>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            required
            disabled={loading.patients || loading.submitting}
          >
            <option value="">-- Select Patient --</option>
            {appointments.map((appointment) => (
              <option key={appointment._id} value={appointment.userId?._id}>
                {appointment.name || 'Unknown Patient'} ({appointment.userId?.email})
                {appointment.appointmentDate && ` - ${new Date(appointment.appointmentDate).toLocaleDateString()}`}
              </option>
            ))}
          </select>
        </div>

        {/* Medications */}
        <div className="border-t pt-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Medications
          </label>
          
          {medications.map((med, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 mb-3 items-center">
              <div className="col-span-5">
                <input
                  type="text"
                  name="name"
                  value={med.name}
                  onChange={(e) => handleMedicationChange(index, e)}
                  placeholder="Medication name"
                  className="w-full px-3 py-2 border rounded-md disabled:opacity-50"
                  required
                  disabled={loading.submitting}
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  name="dosage"
                  value={med.dosage}
                  onChange={(e) => handleMedicationChange(index, e)}
                  placeholder="Dosage"
                  className="w-full px-3 py-2 border rounded-md disabled:opacity-50"
                  required
                  disabled={loading.submitting}
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  name="duration"
                  value={med.duration}
                  onChange={(e) => handleMedicationChange(index, e)}
                  placeholder="Duration (e.g., 7 days)"
                  className="w-full px-3 py-2 border rounded-md disabled:opacity-50"
                  required
                  disabled={loading.submitting}
                />
              </div>
              <div className="col-span-1 flex justify-center">
                {medications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="text-red-500 hover:text-red-700 disabled:text-red-300"
                    disabled={loading.submitting}
                    aria-label="Remove medication"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addMedication}
            className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
            disabled={loading.submitting}
          >
            + Add Medication
          </button>
        </div>

        {/* Diagnosis */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Diagnosis
          </label>
          <textarea
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full px-3 py-2 border rounded-md disabled:opacity-50"
            rows="3"
            required
            disabled={loading.submitting}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border rounded-md disabled:opacity-50"
            rows="2"
            disabled={loading.submitting}
          />
        </div>

        {/* Submit button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading.patients || loading.submitting}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            {loading.submitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Submit Prescription'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritePrescription;