import { NotificationStatus, NotificationTypes } from "../enums";
import { notificationsRepository } from "../repositories/notificationsRepository";
import { redis, logger } from "ep-micro-common";
import { v4 as uuidv4 } from 'uuid';

export const notificationsService = {
    createNotification: async (notificationType: NotificationTypes, notificationDescription: string, notifiedTo: number) => {
        try {
            logger.info(`notificationsService :: createNotification :: notificationType :: ${notificationType} :: notificationDescription :: ${notificationDescription} :: notifiedTo :: ${notifiedTo}`);
            
            const notification = {
                notificationId: uuidv4(),
                notificationType,
                notificationDescription,
                notifiedTo,
                dateCreated: new Date().toISOString(),
                dateUpdated: new Date().toISOString(),
                status: NotificationStatus.UNREAD
            }

            await notificationsRepository.createNotification(notification);
            redis.deleteRedis(`notifications|notified_to:${notification.notifiedTo}|unread_count`);
            redis.deleteRedis(`notifications|notified_to:${notification.notifiedTo}|page:0|limit:10`);
            redis.deleteRedis(`notifications|notified_to:${notification.notifiedTo}|count`);
        } catch (error) {
            logger.error(`notificationsService :: createNotification :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}

