import { Request } from "../types/express";
import { Response } from "express";
import { logger, STATUS } from "ep-micro-common";
import { notificationsService } from "../services";
import { ERRORCODE } from "../constants";
import { GridDefaultOptions, NotificationStatus } from "../enums";

export const notificationsController = {
    getNotifications: async (req: Request, res: Response) => {
        try {
            /*
                #swagger.tags = ['Notifications']
                #swagger.summary = 'Get Notifications'
                #swagger.description = 'Endpoint to get Notifications'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
            */
            const { currentPage = GridDefaultOptions.CURRENT_PAGE, pageSize = 10 } = req.body;
            
            const notifiedTo = req.plainToken.user_id;
            await notificationsService.updateNotificationStatus(NotificationStatus.READ, notifiedTo);
            const notifications = await notificationsService.getNotifications(currentPage, pageSize, notifiedTo);
            const notificationsCount = await notificationsService.getNotificationsCount(notifiedTo);

            return res.status(STATUS.OK).send({
                data: { notifications, notificationsCount },
                message: "Notifications fetched successfully!"
            });
        } catch (error) {
            logger.error(`notificationsController :: getNotifications :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.NOTIFICATIONS.NOTIFICATIONS000);
        }
    },
    getUnreadNotificationsCount: async (req: Request, res: Response) => {
        try {
            /*
                #swagger.tags = ['Notifications']
                #swagger.summary = 'Get Unread Notifications Count'
                #swagger.description = 'Endpoint to get Unread Notifications Count'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
            */
            const notifiedTo = req.plainToken.user_id;
            const count = await notificationsService.getUnreadNotificationsCount(notifiedTo);
            return res.status(STATUS.OK).send({
                data: { count },
                message: "Unread Notifications Count fetched successfully!"
            });
        } catch (error) {
            logger.error(`notificationsController :: getUnreadNotificationsCount :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.NOTIFICATIONS.NOTIFICATIONS000);
        }
    }
}