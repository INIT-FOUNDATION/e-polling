import { logger, mongoDBRead, mongoDB } from "ep-micro-common";
import { MongoCollections, NotificationStatus } from "../enums";

export const notificationsRepository = {
    getNotifications: async (currentPage: number, pageSize: number, notifiedTo: number) => {
        try {
            logger.info(`notificationsRepository :: getNotifications :: currentPage :: ${currentPage} :: pageSize :: ${pageSize} :: notifiedTo :: ${notifiedTo}`);
            const result = await mongoDBRead.findWithLimit(MongoCollections.NOTIFICATIONS, { notifiedTo }, {
                _id: 0
            }, 
            pageSize, { dateCreated: -1 }, currentPage);
            logger.debug(`notificationsRepository :: getNotifications :: currentPage :: ${currentPage} :: pageSize :: ${pageSize} :: notifiedTo :: ${notifiedTo} :: result :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`notificationsRepository :: getNotifications :: currentPage :: ${currentPage} :: pageSize :: ${pageSize} :: notifiedTo :: ${notifiedTo} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getNotificationsCount: async (notifiedTo: number) => {
        try {
            logger.info(`notificationsRepository :: getNotificationsCount :: notifiedTo :: ${notifiedTo}`);
            const count = await mongoDBRead.count(MongoCollections.NOTIFICATIONS, { notifiedTo });
            logger.debug(`notificationsRepository :: getNotificationsCount :: notifiedTo :: ${notifiedTo} :: count :: ${count}`);
            return count;
        } catch (error) {
            logger.error(`notificationsRepository :: getNotificationsCount :: notifiedTo :: ${notifiedTo} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getUnreadNotificationsCount: async (notifiedTo: number) => {
        try {
            logger.info(`notificationsRepository :: getUnreadNotificationsCount :: notifiedTo :: ${notifiedTo}`);
            const count = await mongoDBRead.count(MongoCollections.NOTIFICATIONS, { notifiedTo, status: NotificationStatus.UNREAD });
            logger.debug(`notificationsRepository :: getUnreadNotificationsCount :: notifiedTo :: ${notifiedTo} :: count :: ${count}`);
            return count;
        } catch (error) {
            logger.error(`notificationsRepository :: getUnreadNotificationsCount :: notifiedTo :: ${notifiedTo} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateNotificationStatus: async (notifiedTo: number, status: NotificationStatus) => {
        try {
            logger.info(`notificationsRepository :: updateNotificationStatus :: notifiedTo :: ${notifiedTo} :: status :: ${status}`);
            await mongoDB.updateMany(MongoCollections.NOTIFICATIONS, { notifiedTo }, { status, dateUpdated: new Date().toISOString() });
        } catch (error) {
            logger.error(`notificationsRepository :: updateNotificationStatus :: notifiedTo :: ${notifiedTo} :: status :: ${status} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
}