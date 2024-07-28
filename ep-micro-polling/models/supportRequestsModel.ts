import Joi from "joi";
import { NominationStatus } from "../enums";
import { ISupportRequest } from "../types/custom";

const validateUpdateSupportRequestStatus = (supportRequest: ISupportRequest): Joi.ValidationResult => {
    const supportRequestSchema = Joi.object({
        supportRequestId: Joi.string().required(),
        status: Joi.string().valid(...Object.values(NominationStatus)).required(),
    });
    return supportRequestSchema.validate(supportRequest);
}

export {
    validateUpdateSupportRequestStatus
}