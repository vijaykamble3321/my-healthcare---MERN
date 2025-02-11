import { Router } from "express";
import { isSuperAdminMiddleware } from "../../../utils/jwtToken.js";
import adminDoctorRouter from "./adminDoctorRouter.js";
import userprotectedRouter from "../user/userprotectedRouter.js";
import doctorRouter from "../doctor/doctorRouter.js";

const protectedRouter = Router();

protectedRouter.use("/doctor/admin", isSuperAdminMiddleware, adminDoctorRouter);

protectedRouter.use("/user", userprotectedRouter);

protectedRouter.use("/doctor", doctorRouter);

export default protectedRouter;
