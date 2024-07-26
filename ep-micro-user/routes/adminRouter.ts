import express from "express";
import { adminController } from "../controller";

export const adminRouter = express.Router();

adminRouter.post("/updateProfilePic", adminController.updateProfilePic);

adminRouter.post("/updateProfile", adminController.updateProfile);

adminRouter.get("/loggedUserInfo", adminController.getLoggedInUserInfo);
