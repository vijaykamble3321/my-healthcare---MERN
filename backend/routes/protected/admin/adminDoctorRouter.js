import { Router } from "express";
import { errorResponse,successResponse,} from "../../../utils/serverResponse.js";
import doctorModel from "../../../models/doctorModel.js";
import { hashPassword } from "../../../utils/encryptPassword.js";
import { authmiddleware, isSuperAdminMiddleware } from "../../../utils/jwtToken.js";
import userModel from "../../../models/userModel.js";

const adminDoctorRouter = Router();

// API for creating a doctor
adminDoctorRouter.post("/create", authmiddleware, isSuperAdminMiddleware, createdoctorController);
adminDoctorRouter.get("/allDoctor", authmiddleware, isSuperAdminMiddleware, getalldoctorController);
adminDoctorRouter.delete("/delete",AdminDeleteController)



export default adminDoctorRouter;

async function AdminDeleteController(req,res) {
  try {
    const{email}=req.body;
    if(!email ){
      return errorResponse(res,400,"email an id required");
    }
  const deletedoctor= await doctorModel.deleteOne({email});
if(deletedoctor.deletedCount ===0){
  return errorResponse(res,404,"doctor not found ")
}
successResponse(res,"Doctor-deletd succssful")
  } catch (error) {
    console.log("error in doctor delete".error.message);
    return errorResponse(res,500,"internal servr ")
    
  }
}




// Controller to get all doctors
async function getalldoctorController(req, res) {
  try {
    const { email } = res.locals;
    console.log(email);

    if (!email) {
      return errorResponse(res, 403, "Unauthorized access.");
    }

    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userid",
          foreignField: "_id",
          as: 'doctors'
        }
      },
      {
        $unwind: "$doctors"
      },
      {
        $project: {
          "doctors.password": 0,
          "doctors.role": 0
        }
      }
    ];

    const doctors = await doctorModel.aggregate(pipeline);

    if (doctors.length === 0) {
      return errorResponse(res, 404, "No doctor found.");
    }

    return successResponse(res, "ALL-DOCTORS retrieved successfully.", doctors);
  } catch (error) {
    console.error("Error in getAllController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

// Controller to create a doctor
async function createdoctorController(req, res) {
  try {
    // Check for valid authentication and role
    if (!res.locals.email || !res.locals.role) {
      return errorResponse(res, 401, "Unauthorized: Missing email or role");
    }

    const { name, email, specialization, experience, password, availability } = req.body;

    // Validate required fields
    if (!email) {
      return errorResponse(res, 400, "Email is required.");
    }

    if (!name || !specialization || !experience || !availability || !password) {
      return errorResponse(res, 400, "All fields are required.");
    }

    // Check if a doctor with the same email already exists
    const existingDoctor = await doctorModel.findOne({ email });
    if (existingDoctor) {
      return errorResponse(res, 409, "Doctor with this email already exists.");
    }

    // Proceed with creating the doctor user
    const doctorUser = await userModel.create({
      name,
      email,
      password: await hashPassword(password),
      role: "doctor",
    });

    // Generate doctorId from user creation (or create a custom ID logic)
    const doctorId = doctorUser._id; // Use _id or modify it if needed

    // Create the doctor record
    const newDoctor = await doctorModel.create({
      name,
      email,
      doctorId, // You can change this if needed
      userid: doctorUser._id,
      specialization,
      experience,
      availability,
      createdByRole: res.locals.role,
    });

    return successResponse(res, "Doctor created successfully.", newDoctor);
  } catch (error) {
    console.error("Error in createdoctorController:", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}
