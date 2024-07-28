import express from "express";
import { nominationsController } from "../controllers";

export const nominationsRouter = express.Router();

nominationsRouter.post("/add", nominationsController.createNomination);

nominationsRouter.get("/listByEvent/:eventId", nominationsController.getNominationsByEvent);