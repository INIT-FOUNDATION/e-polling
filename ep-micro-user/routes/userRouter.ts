import express from "express";
import { userController } from "../controller/usersController";

export const userRouter = express.Router();

userRouter.get("/health", userController.health);
