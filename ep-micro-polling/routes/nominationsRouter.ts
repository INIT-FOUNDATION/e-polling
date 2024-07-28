import express from "express";
import { nominationsController } from "../controllers";

export const nominationsRouter = express.Router();

nominationsRouter.post("/add", nominationsController.createNomination);

nominationsRouter.post("/update", nominationsController.updateNomination);

nominationsRouter.post("/updateStatus", nominationsController.updateNominationStatus);

nominationsRouter.get("/list", nominationsController.getNominations);

nominationsRouter.get("/:nominationId", nominationsController.getNomination);