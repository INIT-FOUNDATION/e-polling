import express from "express";
import { pollingController } from "../controllers";

export const pollingRouter = express.Router();

pollingRouter.get("/health", pollingController.health);
