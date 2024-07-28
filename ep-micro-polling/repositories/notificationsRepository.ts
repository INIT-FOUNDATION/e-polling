import { logger, mongoDB } from "ep-micro-common";
import { MongoCollections } from "../enums";
import { INotification } from "../types/custom";

export const notificationsRepository = {
    createNotification: async (notification: INotification) => {
        try {
            logger.info(`notificationsRepository :: createNotification :: ${JSON.stringify(notification)}`);
            await mongoDB.insertOne(MongoCollections.NOTIFICATIONS, notification);
        } catch (error) {
            logger.error(`notificationsRepository :: createNotification :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}