import express from "express";
import { eventsController } from "../controllers";

export const eventsRouter = express.Router();

eventsRouter.get("/listByCategory/:categoryId", eventsController.getEventByCategoryId);

eventsRouter.get("/listPastClosedEvents", eventsController.getPastClosedEvents);