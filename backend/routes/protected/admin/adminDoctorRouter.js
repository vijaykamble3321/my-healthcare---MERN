import { Router } from "express";
import { errorResponse, successResponse } from "../../../utils/serverResponse.js";
import doctorModel from "../../../models/doctorModel.js";
import { hashPassword } from "../../../utils/encryptPassword.js";

const adminDoctorRouter = Router();

// API for creating a doctor
adminDoctorRouter.post("/create", createdoctorController);

export default adminDoctorRouter;

async function createdoctorController(req, res) {
  try {
    if (!res.locals.email || !res.locals.role) {
      return errorResponse(res, 401, "Unauthorized: Missing email or role");
    }

    const { name, email, specialization, experience, password, availability } = req.body;

    // Validate required fields
    if (!name || !email || !specialization || !experience || !availability || !password) {
      return errorResponse(res, 400, "All fields are required.");
    }

    // Check if a doctor with the same email already exists
    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return errorResponse(res, 409, "Doctor with this email already exists.");
    }

    // Create a new doctor if no conflict
    const newDoctor = await doctorModel.create({
      name,
      email,
      specialization,
      experience,
      availability,
      password: await hashPassword(password), // Ensure hashing is awaited
      role: "doctor", // Assign role explicitly
      createdByRole: res.locals.role,
    });

    return successResponse(res, "Doctor created successfully.", newDoctor);
  } catch (error) {
    console.error("Error in createdoctorController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

