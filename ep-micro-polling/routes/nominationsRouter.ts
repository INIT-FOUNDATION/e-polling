import express from "express";
import { nominationsController } from "../controllers";

export const nominationsRouter = express.Router();

nominationsRouter.get("/listByEvent/:eventId", nominationsController.getNominationsByEvent);