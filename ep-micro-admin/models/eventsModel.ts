import Joi from "joi";
import { EventStatus } from "../enums";
import { IEvent } from "../types/custom";

class Event implements IEvent {
  eventId: string;
  eventName: string;
  eventDescription: string;
  startTime: string;
  endTime: string;
  status: EventStatus;
  categoryId: number;
  dateCreated: string;
  dateUpdated: string;
  createdBy: number;
  updatedBy: number;

  constructor(event: IEvent) {
    this.eventId = event.eventId;
    this.eventName = event.eventName;
    this.eventDescription = event.eventDescription;
    this.startTime = event.startTime;
    this.endTime = event.endTime;
    this.status = event.status || EventStatus.ACTIVE;
    this.categoryId = event.categoryId;
    this.dateCreated = event.dateCreated || new Date().toISOString();
    this.dateUpdated = event.dateUpdated || new Date().toISOString();
    this.createdBy = event.createdBy;
    this.updatedBy = event.updatedBy;
  }
}

const validateCreateEvent = (event: IEvent): Joi.ValidationResult => {
  const eventSchema = Joi.object({
    eventId: Joi.string().required(),
    eventName: Joi.string().min(3).max(50).required(),
    eventDescription: Joi.string().allow("", null),
    startTime: Joi.string().isoDate().required(),
    endTime: Joi.string().isoDate().required(),
    status: Joi.string().valid(...Object.values(EventStatus)).required(),
    categoryId: Joi.number().required(),
    dateCreated: Joi.string().isoDate().allow("", null),
    dateUpdated: Joi.string().isoDate().allow("", null),
    createdBy: Joi.number().required(),
    updatedBy: Joi.number().allow("", null)
  });
  return eventSchema.validate(event);
};

const validateUpdateEvent = (event: IEvent): Joi.ValidationResult => {
  const eventSchema = Joi.object({
    eventId: Joi.string().required(),
    eventName: Joi.string().min(3).max(50).required(),
    eventDescription: Joi.string().allow("", null),
    startDate: Joi.string().isoDate().required(),
    endDate: Joi.string().isoDate().required(),
    status: Joi.string().valid(...Object.values(EventStatus)).required(),
    categoryId: Joi.number().required(),
    dateCreated: Joi.string().isoDate().allow("", null),
    dateUpdated: Joi.string().isoDate().allow("", null),
    createdBy: Joi.number().required(),
    updatedBy: Joi.number().required()
  });
  return eventSchema.validate(event);
};

const validateUpdateEventStatus = (event: IEvent): Joi.ValidationResult => {
  const eventSchema = Joi.object({
    eventId: Joi.string().required(),
    status: Joi.string().valid(...Object.values(EventStatus)).required()
  });
  return eventSchema.validate(event);
};

export {
  Event,
  validateCreateEvent,
  validateUpdateEvent,
  validateUpdateEventStatus
};
