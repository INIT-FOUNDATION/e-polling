import express from "express";
import { judgesController } from "../controllers";

export const judgesRouter = express.Router();

judgesRouter.get("/listByEvent/:eventId", judgesController.getJudgesByEvent);