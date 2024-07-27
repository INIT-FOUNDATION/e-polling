import { Request } from "../types/express";
import { Response } from "express";
import { logger, STATUS } from "ep-micro-common";
import { notificationsService } from "../services";
import { ERRORCODE } from "../constants";
import { notificationsModel } from "../models";
import { notificationsRepository } from "../repositories";

export const notificationsController = {
    getNotifications: async (req: Request, res: Response) => {
        try {
            /*
                #swagger.tags = ['Notifications']
                #swagger.summary = 'Get Notifications'
                #swagger.description = 'Endpoint to get Notifications'
            */
            const { currentPage, pageSize, notifiedTo } = req.body;
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
            */
            const { notifiedTo } = req.body;
            const count = await notificationsService.getUnreadNotificationsCount(notifiedTo);
            return res.status(STATUS.OK).send({
                data: { count },
                message: "Unread Notifications Count fetched successfully!"
            });
        } catch (error) {
            logger.error(`notificationsController :: getUnreadNotificationsCount :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.NOTIFICATIONS.NOTIFICATIONS000);
        }
    },
    updateNotificationStatus: async (req: Request, res: Response) => {
        try {
            /*
                #swagger.tags = ['Notifications']
                #swagger.summary = 'Update Notification Status'
                #swagger.description = 'Endpoint to Update Notification Status'
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        notificationId: 'N1',
                        status: 1
                    }
                }    
            */
            const { status, notificationId } = req.body;
            const userId = req.plainToken.user_id;
            const { error } = notificationsModel.validateUpdateNotificationStatus(req.body);
            if (error) {
                if (error.details != null) {
                    return res.status(STATUS.BAD_REQUEST).send({
                        errorCode: ERRORCODE.NOTIFICATIONS.NOTIFICATIONS000.errorCode,
                        errorMessage: error.details[0].message
                    });
                } else {
                    return res.status(STATUS.BAD_REQUEST).send({
                        errorCode: ERRORCODE.NOTIFICATIONS.NOTIFICATIONS000.errorCode,
                        errorMessage: error.message
                    });
                }
            }

            const notificationExists = await notificationsRepository.existsByNotificationId(req.body.notificationId);
            if (!notificationExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.NOTIFICATIONS.NOTIFICATIONS001);
            await notificationsService.updateNotificationStatus(notificationId, Number(status), userId);

            return res.status(STATUS.OK).send({
                data: null,
                message: "Notification status updated successfully!"
            });
        } catch (error) {
            logger.error(`notificationsController :: updateNotificationStatus :: ${error.message} :: ${error}`);
            return res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.NOTIFICATIONS.NOTIFICATIONS000);
        }
    }
}