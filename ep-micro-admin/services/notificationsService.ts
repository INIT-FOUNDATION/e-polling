import { logger, redis } from "ep-micro-common";
import { notificationsRepository } from "../repositories";
import { INomination } from "../types/custom";
import { CacheTTL, NotificationStatus } from "../enums";

export const notificationsService = {
    getNotifications: async (currentPage: number, pageSize: number, notifiedTo: number): Promise<INomination[]> => {
        try {
            currentPage = currentPage > 1 ? (currentPage - 1) * pageSize : 0;
            const key = `notifications|notified_to:${notifiedTo}|page:${currentPage}|limit:${pageSize}`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const notifications = await notificationsRepository.getNotifications(currentPage, pageSize, notifiedTo);
            if (notifications && notifications.length > 0) redis.SetRedis(key, notifications, CacheTTL.LONG);

            return notifications;
        } catch (error) {
            logger.error(`notificationsService :: getNotifications :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getNotificationsCount: async (notifiedTo: number): Promise<number> => {
        try {
            const key = `notifications|notified_to:${notifiedTo}|count`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const count = await notificationsRepository.getNotificationsCount(notifiedTo);
            if (count > 0) redis.SetRedis(key, count, CacheTTL.LONG);
            return count;
        } catch (error) {
            logger.error(`notificationsService :: getNotificationsCount :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getUnreadNotificationsCount: async (notifiedTo: number): Promise<number> => {
        try {
            const key = `notifications|notified_to:${notifiedTo}|unread_count`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const count = await notificationsRepository.getUnreadNotificationsCount(notifiedTo);
            if (count > 0) redis.SetRedis(key, count, CacheTTL.LONG);
            return count;
        } catch (error) {
            logger.error(`notificationsService :: getUnreadNotificationsCount :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateNotificationStatus: async (notificationId: string, status: NotificationStatus, notifiedTo: number) => {
        try {
            await notificationsRepository.updateNotificationStatus(notificationId, status);
            redis.deleteRedis(`notifications|notified_to:${notifiedTo}|unread_count`);
            redis.deleteRedis(`notifications|notified_to:${notifiedTo}|page:1|limit:10`);
            redis.deleteRedis(`notifications|notified_to:${notifiedTo}|count`);
        } catch (error) {
            logger.error(`notificationsService :: updateNotificationStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}