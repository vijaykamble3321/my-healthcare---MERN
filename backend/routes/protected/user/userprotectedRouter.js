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
userprotectedRouter.get("/getdetail", getdetailController);
userprotectedRouter.get("/userprofile",getuserprofileController)


export default userprotectedRouter;

async function getuserprofileController(req, res) {
  try {
    const { email, role } = res.locals;

    if (role !== "user") {
      return errorResponse(res, 403, "Access denied. You must be a patient.");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "Patient not found.");
    }

    return successResponse(res, "User profile retrieved successfully.", {
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });
  } catch (error) {
    console.error("Error in getuserprofileController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}


// async function reviewController(req, res) {
//   try {
//     const { doctorId, rating, reviewMessage } = req.body;
//     const patientId = res.locals.userId;

//     console.log("Doctor ID:", doctorId);
//     console.log("Patient ID:", patientId);

//     if (!patientId) {
//       return errorResponse(res, 401, "Unauthorized. Please log in again.");
//     }

//     if (!doctorId || !rating || !reviewMessage) {
//       return errorResponse(
//         res,
//         400,
//         "Doctor ID, rating, and review message are required."
//       );
//     }

//     if (rating < 1 || rating > 5) {
//       return errorResponse(res, 400, "Rating must be between 1 and 5.");
//     }

//     const doctor = await doctorModel.findById(doctorId);
//     if (!doctor) {
//       return errorResponse(res, 404, "Doctor not found.");
//     }

//     const patient = await userModel.findById(patientId);
//     if (!patient) {
//       return errorResponse(res, 404, "Patient not found.");
//     }

//     const newReview = await reviewModel.create({
//       doctorId,
//       patientId,
//       rating,
//       reviewMessage,
//     });

//     return successResponse(res, "Review submitted successfully.", newReview);
//   } catch (error) {
//     console.error("Error in reviewController:", error);
//     return errorResponse(res, 500, "Internal server error.");
//   }
// }

async function getdetailController(req, res) {
  try {
    const { email, role } = res.locals;

    if (role !== "user") {
      return errorResponse(res, 403, "Access denied. You must be a patient.");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "Patient not found.");
    }

    const userId = user._id;
    const todayDate = new Date().toLocaleDateString("en-CA");

    // Count of todayappointments
    const todayAppointmentsCount = await appointmentModel.countDocuments({
      userId,
      appointmentDate: new Date(),
    });

    // Count of all booked appointments
    const totalAppointmentsCount = await appointmentModel.countDocuments({
      userId,
    });

    return successResponse(res, "Patient details retrieved successfully.", {
      patientName: user.fname,
      email: user.email,
      totalAppointments: totalAppointmentsCount,
      todayAppointments: todayAppointmentsCount,
    });
  } catch (error) {
    console.error("Error in getdetailController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

// Get patient prescriptions
async function getPatientPrescriptions(req, res) {
  try {
    const { email, role } = res.locals;

    // Ensure only patients can access this endpoint
    if (role !== "user") {
      return errorResponse(
        res,
        403,
        "Access denied. You must be a patient to view prescriptions."
      );
    }

 
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "Patient not found.");
    }

    
    const prescriptions = await Prescription.find({ patientId: user._id });

    if (prescriptions.length === 0) {
      return errorResponse(res, 404, "No prescriptions found.");
    }

    return successResponse(
      res,
      "Prescriptions retrieved successfully.",
      prescriptions
    );
  } catch (error) {
    console.error("Error in getPatientPrescriptions:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

// Get all doctors
async function doctorsallController(req, res) {
  try {
    const { email } = res.locals;
    console.log(email);

    if (!email) {
      return errorResponse(res, 403, "Unauthorized access.");
    }

    // Fetch all doctors with specific fields
    const doctors = await doctorModel.find().select({
      name: 1,
      specialization: 1,
      experience: 1,
      availability: 1,
    });

    if (doctors.length === 0) {
      return errorResponse(res, 404, "No doctors found.");
    }

    return successResponse(res, "All doctors retrieved successfully.", doctors);
  } catch (error) {
    console.error("Error in doctorsallController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

//

async function bookAppointmentController(req, res) {
  try {
    const { email } = res.locals; // (patient)
    const {name, doctorId, appointmentDate } = req.body;

    if (!doctorId || !appointmentDate || !name) {
      return errorResponse(
        res,
        400,
        "Doctor ID and appointment date are required."
      );
    }

    const user = await userModel.findOne({ email });
    if (!user) return errorResponse(res, 404, "User not found.");

    const userId = user._id;

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) return errorResponse(res, 404, "Doctor not found.");

    //  availability
    if (!doctor.availability || !Array.isArray(doctor.availability)) {
      return errorResponse(
        res,
        500,
        "Doctor availability data is missing or incorrect."
      );
    }

    const requestedDate = new Date(appointmentDate).toLocaleDateString("en-CA");

    const isAvailable = doctor.availability.some((slot) => {
      const availableDate = new Date(slot.date).toLocaleDateString("en-CA");
      return requestedDate === availableDate;
    });

    if (!isAvailable) {
      return errorResponse(
        res,
        400,
        "Selected appointment date is not available."
      );
    }

    const existingAppointment = await appointmentModel.findOne({
      name,
      userId,
      doctorId,
      appointmentDate,
    });

    if (existingAppointment) {
      return errorResponse(
        res,
        400,
        "You have already booked an appointment with this doctor on this date."
      );
    }

    const newAppointment = new appointmentModel({
      name,
      userId,
      doctorId,
      doctorEmail: doctor.email,                              
      appointmentDate,
      status: "Scheduled",
    });

    await newAppointment.save();

    return successResponse(res, "Appointment booked successfully.", {
      name,
      appointmentId: newAppointment._id,
      doctorName: doctor.name,
      appointmentDate,
    });
  } catch (error) {
    console.error("Error in booking appointment:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}
