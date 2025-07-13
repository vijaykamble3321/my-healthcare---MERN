import { Router } from "express";
import { errorResponse, successResponse } from "../../utils/serverResponse.js";
import userModel from "../../models/userModel.js";
import { generatToken, verifyToken } from "../../utils/jwtToken.js";
import { comparePassword, hashPassword } from "../../utils/encryptPassword.js";

import dotenv from "dotenv";
import { sendEmail } from "../../utils/email.js";

dotenv.config();

const userRouter = Router();

// Routes
userRouter.post("/signup", signupController);
userRouter.post("/signin", signinController);
userRouter.post("/refresh", refreshTokenController);
userRouter.post("/forgot", forgotpassController);
userRouter.post("/reset", resetpassController);

// Controllers
async function signupController(req, res) {
  try {
    const { fname, lname, email, password, role } = req.body;
    
    if (!fname || !lname || !email || !password || !role) {
      return errorResponse(res, 400, "All fields are required");
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, "Email already registered");
    }

    const newUser = await userModel.create({
      fname,
      lname,
      email,
      password: hashPassword(password),
      role,
    });

    return successResponse(res, "Signup successful", { userId: newUser._id });
  } catch (error) {
    console.error("Signup error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

async function signinController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, "Email and password are required");
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    const passwordValid = comparePassword(password, user.password);
    if (!passwordValid) {
      return errorResponse(res, 401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = generatToken({
      userid: user._id,
      email: user.email,
      role: user.role,
    });

    const redirectPath = `/${user.role}`;
    return successResponse(res, "Login successful", { 
      accessToken, 
      refreshToken, 
      redirectPath,
      user: {
        id: user._id,
        name: `${user.fname} ${user.lname}`,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

async function refreshTokenController(req, res) {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return errorResponse(res, 400, "Refresh token required");
    }

    let payload;
    try {
      payload = verifyToken(refreshToken);
    } catch (error) {
      return errorResponse(res, 401, "Invalid refresh token");
    }

    const user = await userModel.findById(payload.userid);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    const tokens = generatToken({
      userid: user._id,
      email: user.email,
      role: user.role,
    });

    return successResponse(res, "Token refreshed", tokens);
  } catch (error) {
    console.error("Refresh token error:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

async function forgotpassController(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return errorResponse(res, 400, "Email is required");
    }
 
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 400, "User not found");
    }
 
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
 
    // Save OTP to the database
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      { forgototp: otp }, // Store OTP
      { new: true } // Ensure it returns the updated user
    );
 
    if (!updatedUser || !updatedUser.forgototp) {
      return errorResponse(res, 500, "Failed to store OTP in database");
    }
 
    console.log("Saved OTP in DB:", updatedUser.forgototp); // Debugging log
 
    // Send OTP via email
    const emailResponse = await sendEmail(email, "Your OTP Code", otp);
    if (!emailResponse.success) {
      return errorResponse(res, 500, "Failed to send OTP");
    }
 
    return successResponse(res, "OTP sent successfully!", { otp });
  } catch (error) {
    console.error("Error during forgot password:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}
 
// 🔹 Reset Password
async function resetpassController(req, res) {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      return errorResponse(
        res,
        400,
        "Email, OTP, and new password are required"
      );
    }
 
    const user = await userModel.findOne({ email });
    if (!user) {
      return errorResponse(res, 400, "User not found");
    }
 
    console.log("Stored OTP:", user.forgototp, "Received OTP:", otp);
    console.log(
      "Stored OTP Type:",
      typeof user.forgototp,
      "Received OTP Type:",
      typeof otp
    );
 
    // Convert both OTP values to strings before comparing
    if (String(user.forgototp) !== String(otp)) {
      return errorResponse(res, 400, "Invalid OTP");
    }
 
    // Optional: Check OTP expiration
    if (user.otpExpiry && Date.now() > user.otpExpiry) {
      return errorResponse(res, 400, "OTP has expired");
    }
 
    // Hash the new password
    const hashedPassword = await hashPassword(password);
 
    // Update user password and remove OTP
    await userModel.findOneAndUpdate(
      { email },
      { password: hashedPassword, forgototp: null, otpExpiry: null }
    );
 
    return successResponse(res, "Password reset successful");
  } catch (error) {
    console.error("Error during password reset:", error);
    return errorResponse(res, 500, "Internal server error");
  }
}

export default userRouter;