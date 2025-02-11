import { Router } from "express";

import doctorModel from "../../../models/doctorModel.js";
import {errorResponse,successResponse,} from "../../../utils/serverResponse.js";
import appointmentModel from "../../../models/appoitmentModel.js";
import userModel from "../../../models/userModel.js";
import Prescription from "../../../models/Prescription.js";

const userprotectedRouter = Router();

userprotectedRouter.get("/getall", doctorsallController);
userprotectedRouter.post("/appoitment", bookAppointmentController);
userprotectedRouter.get("/getperciption", getPatientPrescriptions);


export default userprotectedRouter;
// Controller to get all prescriptions for a patient
async function getPatientPrescriptions(req, res) {
  try {
    const { email, role } = res.locals;

    // Check if the logged-in user is a patient
    if (role !== "user") {
      return errorResponse(res, 403, "Access denied. You must be a patient to view prescriptions.");
    }

    // Find the patient by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "Patient not found.");
    }

    // Fetch prescriptions related to the patient
    const prescriptions = await Prescription.find({ patientId: user._id });

    if (prescriptions.length === 0) {
      return errorResponse(res, 404, "No prescriptions found.");
    }

    return successResponse(res, "Prescriptions retrieved successfully.", prescriptions);
  } catch (error) {
    console.error("Error in getPatientPrescriptions:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}


async function doctorsallController(req, res) {
  try {
    const { email } = res.locals;
    console.log(email);

    if (!email) {
      return errorResponse(res, 403, "Unauthorized access.");
    }
    const books = await doctorModel.find();

    if (books.length === 0) {
      return errorResponse(res, 404, "No bookss found.");
    }

    return successResponse(res, "ALL-DOCTORS retrieved successfully.", books);
  } catch (error) {
    console.error("Error in getAllController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

//





// async function bookAppointmentController(req, res) {
//   try {
//     const { email } = res.locals;
//     const { doctorId, appointmentDate } = req.body;

//     if (!doctorId || !appointmentDate) {
//       return errorResponse(res, 400, "Doctor ID and appointment date are required.");
//     }

//     const user = await userModel.findOne({ email });
//     if (!user) return errorResponse(res, 404, "User not found.");

//     const userId = user._id;

//     const doctor = await doctorModel.findById(doctorId);
//     if (!doctor) return errorResponse(res, 404, "Doctor not found.");

//     // Ensure availability data exists
//     if (!doctor.availability || !Array.isArray(doctor.availability)) {
//       return errorResponse(res, 500, "Doctor availability data is missing or incorrect.");
//     }

//     // Normalize the appointment date
//     const requestedDate = new Date(appointmentDate).toLocaleDateString('en-CA'); // "YYYY-MM-DD"

//     // Check if requested appointment date is available
//     const isAvailable = doctor.availability.some((slot) => {
//       const availableDate = new Date(slot.date).toLocaleDateString('en-CA'); // "YYYY-MM-DD"
//       return requestedDate === availableDate;
//     });

//     if (!isAvailable) {
//       return errorResponse(res, 400, "Selected appointment date is not available.");
//     }

//     // Check for existing appointment
//     const existingAppointment = await appointmentModel.findOne({ userId, doctorId, appointmentDate });

//     if (existingAppointment) {
//       return errorResponse(res, 400, "You have already booked an appointment with this doctor on this date.");
//     }

//     // Create and save a new appointment
//     const newAppointment = new appointmentModel({
//       userId,
//       doctorId,
//       appointmentDate,
//       status: "Scheduled",
//     });

//     await newAppointment.save();

//     return successResponse(res, "Appointment booked successfully.", {
//       appointmentId: newAppointment._id,
//       doctorName: doctor.name,
//       appointmentDate,
//     });
//   } catch (error) {
//     console.error("Error in booking appointment:", error);
//     return errorResponse(res, 500, "Internal server error.");
//   }
// }
async function bookAppointmentController(req, res) {
  try {
    const { email } = res.locals; // User's email (patient)
    const { doctorId, appointmentDate } = req.body;

    if (!doctorId || !appointmentDate) {
      return errorResponse(res, 400, "Doctor ID and appointment date are required.");
    }

    // Find the patient by email
    const user = await userModel.findOne({ email });
    if (!user) return errorResponse(res, 404, "User not found.");

    const userId = user._id;

    // Find the doctor by ID and fetch their email
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) return errorResponse(res, 404, "Doctor not found.");

    // Ensure availability data exists
    if (!doctor.availability || !Array.isArray(doctor.availability)) {
      return errorResponse(res, 500, "Doctor availability data is missing or incorrect.");
    }

    // Normalize the appointment date
    const requestedDate = new Date(appointmentDate).toLocaleDateString('en-CA'); // "YYYY-MM-DD"

    // Check if requested appointment date is available
    const isAvailable = doctor.availability.some((slot) => {
      const availableDate = new Date(slot.date).toLocaleDateString('en-CA'); // "YYYY-MM-DD"
      return requestedDate === availableDate;
    });

    if (!isAvailable) {
      return errorResponse(res, 400, "Selected appointment date is not available.");
    }

    // Check for existing appointment
    const existingAppointment = await appointmentModel.findOne({ userId, doctorId, appointmentDate });

    if (existingAppointment) {
      return errorResponse(res, 400, "You have already booked an appointment with this doctor on this date.");
    }

    // Create and save a new appointment with the doctor's email included
    const newAppointment = new appointmentModel({
      userId,
      doctorId,
      doctorEmail: doctor.email, // Include doctorEmail here
      appointmentDate,
      status: "Scheduled",
    });

    await newAppointment.save();

    return successResponse(res, "Appointment booked successfully.", {
      appointmentId: newAppointment._id,
      doctorName: doctor.name,
      appointmentDate,
    });
  } catch (error) {
    console.error("Error in booking appointment:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}
