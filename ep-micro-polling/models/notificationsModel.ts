import Joi from "joi";
import { NotificationStatus } from "../enums";
import { INotification } from "../types/custom";

const validateUpdateNotificationStatus = (notification: INotification): Joi.ValidationResult => {
    const notificationSchema = Joi.object({
        notificationId: Joi.string().required(),
        status: Joi.string().valid(...Object.values(NotificationStatus)).required(),
    });
    return notificationSchema.validate(notification);
}

export {
    validateUpdateNotificationStatus
}