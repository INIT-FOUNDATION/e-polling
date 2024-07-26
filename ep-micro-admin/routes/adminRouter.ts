import express from "express";
import { adminController } from "../controllers";

export const adminRouter = express.Router();

adminRouter.get("/health", adminController.health);
