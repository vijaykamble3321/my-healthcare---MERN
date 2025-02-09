import { Router } from "express";

import doctorModel from "../../../models/doctorModel.js";
import { errorResponse, successResponse } from "../../../utils/serverResponse.js";
import appointmentModel from "../../../models/appoitmentModel.js";
import userModel from "../../../models/userModel.js";

const userprotectedRouter = Router();

userprotectedRouter.get("/getall",doctorsallController)
userprotectedRouter.post("/appoitment",bookAppointmentController)


export default userprotectedRouter;

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
async function bookAppointmentController(req, res) {
  try {
    const { email } = res.locals; // Email from the logged-in user
    const { doctorId, appointmentDate } = req.body; // Doctor ID and chosen appointment date from the request body

    if (!doctorId || !appointmentDate) {
      return errorResponse(res, 400, "Doctor ID and appointment date are required.");
    }

    // Find the user based on email
    const user = await userModel.findOne({ email });
    if (!user) return errorResponse(res, 404, "User not found.");

    const userId = user._id;

    // Find the doctor based on the doctorId
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) return errorResponse(res, 404, "Doctor not found.");

    // Check if the appointment date is available in the doctor's schedule
    if (!doctor.availability.includes(appointmentDate)) {
      return errorResponse(res, 400, "Selected appointment date is not available.");
    }

    // Check if the user has already booked an appointment with the same doctor for the same date
    const existingAppointment = await appointmentModel.findOne({
      userId,
      doctorId,
      appointmentDate,
    });

    if (existingAppointment)
      return errorResponse(res, 400, "You have already booked an appointment with this doctor on this date.");

    // Create a new appointment
    const newAppointment = new appointmentModel({
      userId,
      doctorId,
      appointmentDate,
      status: "Scheduled",
    });

    await newAppointment.save();

    // Return success response with appointment details
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
