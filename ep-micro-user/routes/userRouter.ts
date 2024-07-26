import express from "express";
import { userController } from "../controller";

export const userRouter = express.Router();

userRouter.get("/health", userController.health);
