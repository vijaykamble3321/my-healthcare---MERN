import { Router } from "express";
import { isSuperAdminMiddleware } from "../../../utils/jwtToken.js";
import adminDoctorRouter from "./adminDoctorRouter.js";
import userprotectedRouter from "../user/userprotectedRouter.js";

const protectedRouter = Router();

protectedRouter.use("/doctor", isSuperAdminMiddleware, adminDoctorRouter);
protectedRouter.use("/user",userprotectedRouter)
export default protectedRouter;
