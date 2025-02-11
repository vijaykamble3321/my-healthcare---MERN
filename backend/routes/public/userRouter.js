import { Router } from "express";
import { errorResponse, successResponse } from "../../utils/serverResponse.js";
import userModel from "../../models/userModel.js";
import {  generatToken } from "../../utils/jwtToken.js";
import { comparePassword, hashPassword } from "../../utils/encryptPassword.js";
import doctorModel from "../../models/doctorModel.js";
// import doctorModel from "../../models/doctorModel.js";

const userRouter = Router();

userRouter.post("/signup", signupController);
userRouter.post("/signin", signinController);
userRouter.post("/signin-doctor", doctorsigninController);


// userRouter.get("/signin", forgotPasswordController);
// userRouter.get("/signin", resetPasswordController);

//api-controller

export default userRouter;
async function doctorsigninController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, "Email and password are required.");
    }
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return errorResponse(res, 404, "User not found.");
    }

    const passwordvalid = comparePassword(password, doctor.password);
    if (!passwordvalid) {
      return errorResponse(res, 401, "invalid password");
    }
    const token = generatToken({
      doctorid: doctor._id,
      email: doctor.email,
      // userid: user._id,
      role: doctor.role,
    });
    console.log("Generated Token:", token);

    return successResponse(res, "Signin successful", token);
  } catch (error) {
    console.error("Error during signin", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}

async function signupController(req, res) {
  try {
    const { fname, lname, email, password, role } = req.body;
    if (!fname || !lname || !email || !password || !role) {
      return errorResponse(res, 404, "all field required");
      
    }
    await userModel.create({
      fname,
      lname,
      email,
      password:hashPassword(password),
      role,
    });

    successResponse(res, "signup-Successful");
  } catch (error) {
    errorResponse(res, 500, "internal server error");
  }
}

async function signinController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, "Email and password are required.");
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "User not found.");
    }

    const passwordValid =comparePassword(password, user.password);
    if (!passwordValid) {
      return errorResponse(res, 401, "invalid password");
    }
    const token = generatToken({
      userid: user._id,
      email: user.email,

      role: user.role,
    });
    console.log("Generated Token:", token);

    return successResponse(res, "Signin successful", token);
  } catch (error) {
    console.error("Error during signin", error);
    return errorResponse(res, 500, "Internal server error.");
  }
}









//forgot
// async function forgotPasswordController(req, res) {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return errorResponse(res, 400, "email and password are required.");
//     }
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return errorResponse(res, 400, "user not found");
//     }
//     const randomNum = Math.round(Math.random() * 100000);
//     const forgototp = randomNum < 1000000 ? randomNum + 100000 : randomNum;

//     await userModel.findOneAndUpdate({ email }, { forgototp });
//     //fuction to email otp to user email -

//     //
//     return successResponse(res, "otp generate successful.", { otp: forgototp });
//   } catch (error) {
//     console.log("error during signin", error);
//     errorResponse(res, 500, "internal server error");
//   }
// }
// //reset

// async function resetPasswordController(req, res) {
//   try {
//     const { email, otp, password } = req.body;

//     if (!email) {
//       return errorResponse(res, 400, "email and password are required.");
//     }
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return errorResponse(res, 400, "user not found");
//     }

//     if (user.forgototp !== Number.otp) {
//       return errorResponse(res, 400, "invalid otp");
//     }

//     await userModel.findOneAndUpdate(
//       { email },
//       { password: hashPassword(password) }
//     );

//     return successResponse(res, "password reset successful");
//   } catch (error) {
//     console.log("error during signin", error);
//     errorResponse(res, 500, "internal server error");
//   }
// }
