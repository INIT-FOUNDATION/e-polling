import express from "express";
import { judgesController } from "../controllers";

export const judgesRouter = express.Router();

judgesRouter.post("/add", judgesController.createJudge);

judgesRouter.post("/update", judgesController.updateJudge);

judgesRouter.post("/updateStatus", judgesController.updateJudgeStatus);

judgesRouter.get("/list", judgesController.getJudges);

judgesRouter.get("/:menuId", judgesController.getJudge);