import express from "express";
import { votesController } from "../controllers";

export const votesRouter = express.Router();

votesRouter.post("/mobile/publish", votesController.publishVoteWithMobile);

votesRouter.post("/mobile/verifyPublish", votesController.verifyVoteWithMobile);

votesRouter.post("/email/publish", votesController.publishVoteWithEmail);