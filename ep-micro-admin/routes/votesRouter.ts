import express from "express";
import { votesController } from "../controllers";

export const votesRouter = express.Router();

votesRouter.get("/list", votesController.listVotes);