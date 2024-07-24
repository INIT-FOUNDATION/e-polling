import express from 'express';
import { adminController } from "../controllers";

export const adminRouter = express.Router();

adminRouter.get("/validateToken", adminController.validateToken);

adminRouter.post("/login", adminController.login);

adminRouter.post("/logout", adminController.logout);

adminRouter.post("/getForgetPasswordOtp", adminController.getForgetPasswordOtp);

adminRouter.post("/verifyForgetPasswordOtp", adminController.verifyForgetPasswordOtp);

adminRouter.post("/resetForgetPassword", adminController.resetForgetPassword);
