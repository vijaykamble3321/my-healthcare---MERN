import { Router } from "express";
import {errorResponse,successResponse,} from "../../../utils/serverResponse.js";
import userModel from "../../../models/userModel.js";
import appointmentModel from "../../../models/appoitmentModel.js";

const adminuserRouter = Router();

//  API
adminuserRouter.get("/getallpetient", getallpetientController);

export default adminuserRouter;

async function getallpetientController(req, res) {
  try {
    const { role } = res.locals;

    if (role !== "superadmin" && role !== "admin") {
      return errorResponse(res, 403, "Access denied. Admins only.");
    }

    const patients = await userModel.find({ role: "user" });

    if (!patients || patients.length === 0) {
      return errorResponse(res, 404, "No patients found.");
    }

    const todayDate = new Date().toISOString().split("T")[0];

    const patientData = await Promise.all(
      patients.map(async (patient) => {
        const userId = patient._id;

        const todayAppointmentsCount = await appointmentModel.countDocuments({
          userId,
          appointmentDate: todayDate,
        });
        const totalAppointmentsCount = await appointmentModel.countDocuments({
          userId,
        });

        return {
          patientName: patient.fname,
          email: patient.email,
          totalAppointments: totalAppointmentsCount,
          todayAppointments: todayAppointmentsCount,
        };
      })
    );

    return successResponse(
      res,
      "All patient details retrieved successfully.",
      patientData
    );
  } catch (error) {
    console.error("Error in getallpetientController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}
