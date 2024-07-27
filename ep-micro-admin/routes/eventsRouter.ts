import express from "express";
import { eventsController } from "../controllers";

export const eventsRouter = express.Router();

eventsRouter.post("/add", eventsController.createEvent);

eventsRouter.post("/update", eventsController.updateEvent);

eventsRouter.post("/updateStatus", eventsController.updateEventStatus);

eventsRouter.get("/list", eventsController.getEvents);

eventsRouter.get("/listByCategory/:categoryId", eventsController.getEventByCategoryId);

eventsRouter.get("/:eventId", eventsController.getEvent);