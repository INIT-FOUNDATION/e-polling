import express from "express";
import { notificationsController } from "../controllers";

export const notificationsRouter = express.Router();

notificationsRouter.post("/updateStatus", notificationsController.updateNotificationStatus);

notificationsRouter.get("/list", notificationsController.getNotifications);

notificationsRouter.get("/unreadCount", notificationsController.getUnreadNotificationsCount);