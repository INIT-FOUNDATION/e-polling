import Joi from "joi";
import { SupportRequestStatus } from "../enums";
import { IDeviceDetails } from "../types/custom";
import { v4 as uuidv4 } from 'uuid';

export interface ISupportRequest {
  supportRequestId: string;
  requesterName: string;
  requesterEmail: string;
  requesterMessage: string;
  resolvedBy: number;
  dateCreated: string;
  dateUpdated: string;
  requesterDeviceDetails: IDeviceDetails;
  status: SupportRequestStatus;
}

class SupportRequest implements ISupportRequest {
  supportRequestId: string;
  requesterName: string;
  requesterEmail: string;
  requesterMessage: string;
  resolvedBy: number;
  dateCreated: string;
  dateUpdated: string;
  requesterDeviceDetails: IDeviceDetails;
  status: SupportRequestStatus;

  constructor(supportRequest: ISupportRequest) {
    this.supportRequestId = supportRequest.supportRequestId || uuidv4();
    this.requesterName = supportRequest.requesterName;
    this.requesterEmail = supportRequest.requesterEmail;
    this.requesterMessage = supportRequest.requesterMessage;
    this.resolvedBy = supportRequest.resolvedBy;
    this.dateCreated = supportRequest.dateCreated || new Date().toISOString();
    this.dateUpdated = supportRequest.dateUpdated || new Date().toISOString();
    this.requesterDeviceDetails = supportRequest.requesterDeviceDetails;
    this.status = supportRequest.status || SupportRequestStatus.OPEN;
  }
}

const validateCreateSupportRequest = (supportRequest: ISupportRequest): Joi.ValidationResult => {
  const supportRequestSchema = Joi.object({
    supportRequestId: Joi.string().required(),
    requesterName: Joi.string().min(3).max(50).required(),
    requesterEmail: Joi.string().email().required(),
    requesterMessage: Joi.string().min(10).required(),
    resolvedBy: Joi.number().allow("", null),
    dateCreated: Joi.string().isoDate().allow("", null),
    dateUpdated: Joi.string().isoDate().allow("", null),
    requesterDeviceDetails: Joi.object().required(),
    status: Joi.string().valid(...Object.values(SupportRequestStatus)).required()
  });
  return supportRequestSchema.validate(supportRequest);
};

export { SupportRequest, validateCreateSupportRequest }