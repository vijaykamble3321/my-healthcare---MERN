import { Router } from "express";
import userRouter from "./userRouter.js";

const publicRouter = Router();

publicRouter.use("/user", userRouter);

export default publicRouter;
   

