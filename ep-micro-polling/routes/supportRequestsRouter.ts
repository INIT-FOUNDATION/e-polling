import express from "express";
import { supportRequestsController } from "../controllers";

export const supportRequestsRouter = express.Router();

supportRequestsRouter.post("/create", supportRequestsController.createSupportRequest);