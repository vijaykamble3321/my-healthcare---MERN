import { Router } from "express";
import appointmentModel from "../../../models/appoitmentModel.js";
import { errorResponse, successResponse } from "../../../utils/serverResponse.js";
import doctorModel from "../../../models/doctorModel.js";
import Prescription from "../../../models/Prescription.js";

const doctorRouter = Router();


doctorRouter.get("/patient/appointments",  petientAppoitmentController);
doctorRouter.get("/prescriptions", getPrescriptionsController);
doctorRouter.post("/prescriptions", createPrescriptionController);
doctorRouter.get("/getallpatient", getallpatientController);


export default doctorRouter;

async function getallpatientController(req,res) {
  try {
    const { email, role } = res.locals;

    // Ensure only doctors can access
    if (role !== "doctor") {
      return res.status(403).json({
        error: true,
        status: 403,
        message: "Access denied. You must be a doctor to view patients.",
      });
    }

    // Find the doctor by email
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.status(404).json({
        error: true,
        status: 404,
        message: "Doctor not found.",
      });
    }

    // Get appointments for this doctor
    const appointments = await appointmentModel.find({ doctorId: doctor._id })
      .populate("userId", "name email")
      .sort({ appointmentDate: -1 });

    return res.status(200).json({
      error: false,
      status: 200,
      message: "Patients retrieved successfully",
      data: {
        data: appointments,
        totalPatients: appointments.length,
      },
    });
  } catch (error) {
    console.error("Error in getallpatientController:", error);
    return res.status(500).json({
      error: true,
      status: 500,
      message: "Server error",
    });
  }
};


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

    // Find the doctor by email
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return errorResponse(res, 404, "Doctor not found.");
    }

    // Retrieve appointments specifically for this doctor
    const appointments = await appointmentModel.find
    ({ doctorId: doctor._id }).select({ name: 1, userId: 1, appointmentDate: 1, status: 1 });

    // If no appointments found
    if (appointments.length === 0) {
      return errorResponse(res, 404, "No appointments found.");
    }

    // Return success with the list of appointments
    return successResponse(res, "Appointments retrieved successfully.", appointments);
  } catch (error) {
    console.error("Error in petientAppoitmentController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

// all prescriptions for a logged-in doctor
async function getPrescriptionsController(req, res) {
  try {
    const { email, role } = res.locals;

    
    if (role !== "doctor") {
      return errorResponse(res, 403, "Access denied. You must be a doctor to view prescriptions.");
    }

    if (!email) {
      return errorResponse(res, 403, "Unauthorized access.");
    }
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return errorResponse(res, 404, "Doctor not found.");
    }

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

//  create a new prescription for a patient
async function createPrescriptionController(req, res) {
  try {
    const { email, role } = res.locals;

    
    if (role !== "doctor") {
      return errorResponse(res, 403, "Access denied. You must be a doctor to create prescriptions.");
    }

    if (!email) {
      return errorResponse(res, 403, "Unauthorized access.");
    }

    
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return errorResponse(res, 404, "Doctor not found.");
    }

    const { patientId, medications, diagnosis, notes } = req.body;

    if (!patientId || !medications || !diagnosis) {
      return errorResponse(res, 400, "Patient ID, medications, and diagnosis are required.");
    }

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
