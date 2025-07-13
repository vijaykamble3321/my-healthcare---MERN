import { Router } from "express";
import doctorRouter from "../protected/doctor/doctorRouter.js";
import adminuserRouter from "../protected/admin/adminuserRouter.js";
import userprotectedRouter from "./user/userprotectedRouter.js";
import adminDoctorRouter from "../protected/admin/adminDoctorRouter.js";
import {authmiddleware,isDoctorMiddleware, isSuperAdminMiddleware} from "../../utils/jwtToken.js";
import { errorResponse, successResponse } from "../../utils/serverResponse.js";

const protectedRouter = Router();

protectedRouter.use("/doctor/admin", isSuperAdminMiddleware, adminDoctorRouter);
protectedRouter.use("/user", userprotectedRouter);
protectedRouter.use("/doctor", isDoctorMiddleware,authmiddleware, doctorRouter);
protectedRouter.use("/allpetient", isSuperAdminMiddleware, adminuserRouter);
protectedRouter.use("/redirect", redirectController);

export default protectedRouter;

async function redirectController(req, res) {
  try {
    const role = res.locals.role;
    const path = `/${role}`;

    res.redirect(path);
  } catch (error) {
    errorResponse(res, "not response");
  }
}
