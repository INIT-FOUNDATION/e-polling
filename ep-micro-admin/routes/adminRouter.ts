import express from "express";
import { adminController } from "../controllers/adminController";

export const adminRouter = express.Router();

adminRouter.get("/health", adminController.health);
