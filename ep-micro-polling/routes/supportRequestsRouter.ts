import express from "express";
import { supportRequestsController } from "../controllers";

export const supportRequestsRouter = express.Router();

supportRequestsRouter.post("/updateStatus", supportRequestsController.updateSupportRequestStatus);

supportRequestsRouter.get("/list", supportRequestsController.getSupportRequests);