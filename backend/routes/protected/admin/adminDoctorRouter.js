import { Router } from "express";
import {errorResponse,successResponse} from "../../../utils/serverResponse.js";
import doctorModel from "../../../models/doctorModel.js";

const adminDoctorRouter = Router();

//api
adminDoctorRouter.post("/create", createdoctorController);

export default adminDoctorRouter;

async function createdoctorController(req, res) {
  try {
    if (!res.locals.email || !res.locals.role) {
      return errorResponse(res, 401, "unauthorized: missing email or role");
    }
    const { email, role } = res.locals;
    const { name, specialization, experience, availability } = req.body;

    if (!name || !specialization || !experience || !availability) {
      return errorResponse(res, 400, "All fields are required.");
    }

    const newBlog = await doctorModel.create({
      name,
      specialization,
      experience,
      availability,
      email,
      role,
    });

    return successResponse(res, "DOCTOR-created successfully.", newBlog);
  } catch (error) {
    console.error("Error in createdoctorController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}
