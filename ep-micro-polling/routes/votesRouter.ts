import express from "express";
import { votesController } from "../controllers";

export const votesRouter = express.Router();

votesRouter.post("/mobile/publish", votesController.publishVote);

votesRouter.post("/mobile/verifyPublish", votesController.publishVote);

votesRouter.post("/email/publish", votesController.publishVote);