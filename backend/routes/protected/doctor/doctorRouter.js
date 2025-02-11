import { Router } from "express";
import appointmentModel from "../../../models/appoitmentModel.js";
import { errorResponse, successResponse } from "../../../utils/serverResponse.js";
import { authmiddleware } from "../../../utils/jwtToken.js";
import doctorModel from "../../../models/doctorModel.js";
import Prescription from "../../../models/Prescription.js";

const doctorRouter = Router();

// Define the route to fetch all patient appointments for doctors only
doctorRouter.get("/patient/appointments", authmiddleware, petientAppoitmentController);

// Define the route to fetch all prescriptions for doctors only
doctorRouter.get("/prescriptions", authmiddleware, getPrescriptionsController);

// Define the route to create a new prescription for a patient
doctorRouter.post("/prescriptions", authmiddleware, createPrescriptionController);

export default doctorRouter;

// Controller to fetch all appointments for a logged-in doctor
async function petientAppoitmentController(req, res) {
  try {
    const { email, role } = res.locals;

    // Check if the user is a doctor
    if (role !== "doctor") {
      return errorResponse(res, 403, "Access denied. You must be a doctor to view appointments.");
    }

    if (!email) {
      return errorResponse(res, 403, "Unauthorized access.");
    }

    // Find the doctor by email to get the doctorId
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return errorResponse(res, 404, "Doctor not found.");
    }

    // Fetch appointments for the logged-in doctor
    const appointments = await appointmentModel.find({ doctorId: doctor._id });

    if (appointments.length === 0) {
      return errorResponse(res, 404, "No appointments found.");
    }

    return successResponse(res, "Appointments retrieved successfully.", appointments);
  } catch (error) {
    console.error("Error in petientAppoitmentController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

// Controller to fetch all prescriptions for a logged-in doctor
async function getPrescriptionsController(req, res) {
  try {
    const { email, role } = res.locals;

    // Ensure the user is a doctor
    if (role !== "doctor") {
      return errorResponse(res, 403, "Access denied. You must be a doctor to view prescriptions.");
    }

    if (!email) {
      return errorResponse(res, 403, "Unauthorized access.");
    }

    // Find the doctor by email to get the doctorId
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return errorResponse(res, 404, "Doctor not found.");
    }

    // Fetch prescriptions for this doctor
    const prescriptions = await Prescription.find({ doctorId: doctor._id }).populate('patientId');

    if (prescriptions.length === 0) {
      return errorResponse(res, 404, "No prescriptions found.");
    }

    return successResponse(res, "Prescriptions retrieved successfully.", prescriptions);
  } catch (error) {
    console.error("Error in getPrescriptionsController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

// Controller to create a new prescription for a patient
async function createPrescriptionController(req, res) {
  try {
    const { email, role } = res.locals;

    // Ensure the user is a doctor
    if (role !== "doctor") {
      return errorResponse(res, 403, "Access denied. You must be a doctor to create prescriptions.");
    }

    if (!email) {
      return errorResponse(res, 403, "Unauthorized access.");
    }

    // Find the doctor by email to get the doctorId
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return errorResponse(res, 404, "Doctor not found.");
    }

    const { patientId, medications, diagnosis, notes } = req.body;

    if (!patientId || !medications || !diagnosis) {
      return errorResponse(res, 400, "Patient ID, medications, and diagnosis are required.");
    }

    // Create a new prescription
    const newPrescription = new Prescription({
      patientId,
      doctorId: doctor._id,
      medications,
      diagnosis,
      notes,
    });

    await newPrescription.save();

    return successResponse(res, "Prescription created successfully.", {
      prescriptionId: newPrescription._id,
      patientId,
      doctorId: doctor._id,
      medications: newPrescription.medications,
      diagnosis: newPrescription.diagnosis,
      notes: newPrescription.notes,
    });
  } catch (error) {
    console.error("Error in createPrescriptionController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}
