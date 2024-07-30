import { logger, redis } from "ep-micro-common";
import { ISupportRequest } from "../types/custom";
import { NotificationTypes, SupportRequestStatus } from "../enums";
import { supportRequestsRepository } from "../repositories";
import { notificationsService } from "./";
import { usersService } from "./usersService";
import { emailService } from "./emailService";
import { WEBSITE_URL } from "../constants";
import moment from "moment";

export const supportRequestsService = {
    createSupportRequest: async (supportRequest: ISupportRequest) => {
        try {
            logger.info(`supportRequestsService :: createSupportRequest :: ${JSON.stringify(supportRequest)}`);
            await supportRequestsRepository.createSupportRequest(supportRequest);

            for (const status of Object.values(SupportRequestStatus)) {
                await redis.deleteRedis(`support_requests|period_type:${status}|page:0|limit:50`);
                await redis.deleteRedis(`support_requests|period_type:${status}|count`);
            }

            await notificationsService.createNotification(NotificationTypes.SUPPORT_REQUEST, `Support request raised from ${supportRequest.requesterName}`, 1);
            const user = await usersService.getUserById(1);

            await emailService.sendEmail('E-POLLING | SUPPORT REQUEST', 'views/supportRequestEmailTemplate.ejs', user.email_id, {
                name: user.display_name,
                requesterEmail: supportRequest.requesterEmail,
                websiteUrl: WEBSITE_URL,
                message: supportRequest.requesterMessage,
                year: moment().year()
            });

            await emailService.sendEmail('E-POLLING | THANK YOU FOR CONTACTING', 'views/contactAcknowledgementTemplate.ejs', user.email_id, {
                name: user.display_name,
                websiteUrl: WEBSITE_URL,
                year: moment().year()
            });
        } catch (error) {
            logger.error(`supportRequestsService :: createSupportRequest :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}