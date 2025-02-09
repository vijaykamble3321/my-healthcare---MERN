import { Router } from "express";
import { errorResponse, successResponse } from "../../utils/serverResponse.js";
import userModel from "../../models/userModel.js";

const userRouter = Router();

userRouter.post("/signup", signupController);
userRouter.get("/signin", signinController);

//api-controller

export default userRouter;

async function signinController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      errorResponse(res, 404, "email and password required");
    }
    await userModel.create({
      email,
      password,
    });
    successResponse(res, "signin-Successfulyy!!!");
  } catch (error) {
    errorResponse(res, 500, "intrnal server error");
  }
}

async function signupController(req, res) {
  try {
    const { fname, lname, email, password } = req.body;
    if (!fname || !lname || !email || !password) {
      return errorResponse(res, 404, "all field required");
    }
    await userModel.create({
      fname,
      lname,
      email,
      password,
    });

    successResponse(res, "signup-Successful");
  } catch (error) {
    errorResponse(res, 500, "internal server error");
  }
}
