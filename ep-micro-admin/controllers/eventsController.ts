import { logger, STATUS } from "ep-micro-common";
import { Response } from "express";
import { Request } from "../types/express";
import { eventsModel } from "../models";
import { ERRORCODE } from "../constants";
import { eventsService } from "../services";
import { categoriesRepository, eventsRepository } from "../repositories";
import { GridDefaultOptions } from "../enums";
import moment from "moment";

export const eventsController = {
    createEvent: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Events']
                #swagger.summary = 'Create Event'
                #swagger.description = 'Endpoint to Create Event'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        eventName: 'Tech Conference',
                        eventDescription: 'Tech Conference on Cloud Native',
                        startTime: '2024-09-01T09:00:00Z',
                        endTime: '2024-09-01T17:00:00Z',
                        categoryId: 1
                    }
                }    
            */
            const event = new eventsModel.Event(req.body);
            const userId = req.plainToken.user_id;

            const { error } = eventsModel.validateCreateEvent(event);
            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.EVENTS.EVENTS000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.EVENTS.EVENTS000.errorCode, errorMessage: error.message });
            }

            const categoryIdExists = await categoriesRepository.existsByCategoryId(event.categoryId);
            if (!categoryIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.CATEGORIES.CATEGORIES001);

            if (moment(event.startTime).isAfter(event.endTime)) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.EVENTS.EVENTS006);

            event.createdBy = userId;
            event.updatedBy = userId;

            await eventsService.createEvent(event);
            return res.status(STATUS.OK).send({
                data: null,
                message: "Event Created Successfully!"
            });
        } catch (error) {
            logger.error(`eventsController :: createEvent :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.EVENTS.EVENTS000);
        }
    },
    updateEvent: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Events']
                #swagger.summary = 'Update Event'
                #swagger.description = 'Endpoint to Update Event'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        eventId: 'E1',
                        eventName: 'Updated Tech Conference',
                        eventDescription: 'Updated Tech Conference on Cloud Native',
                        startTime: '2024-09-01T10:00:00Z',
                        endTime: '2024-09-01T18:00:00Z',
                        categoryId: 1
                    }
                }    
            */
            const event = new eventsModel.Event(req.body);
            const userId = req.plainToken.user_id;

            const { error } = eventsModel.validateUpdateEvent(event);
            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.EVENTS.EVENTS000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.EVENTS.EVENTS000.errorCode, errorMessage: error.message });
            }

            const eventIdExists = await eventsRepository.existsByEventId(event.eventId);
            if (!eventIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.EVENTS.EVENTS001);

            const categoryIdExists = await categoriesRepository.existsByCategoryId(event.categoryId);
            if (!categoryIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.CATEGORIES.CATEGORIES001);

            if (moment(event.startTime).isAfter(event.endTime)) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.EVENTS.EVENTS006);

            event.updatedBy = userId;

            await eventsService.updateEvent(event);
            return res.status(STATUS.OK).send({
                data: null,
                message: "Event Updated Successfully!"
            });
        } catch (error) {
            logger.error(`eventsController :: updateEvent :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.EVENTS.EVENTS000);
        }
    },
    getEvents: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Events']
                #swagger.summary = 'List Events'
                #swagger.description = 'Endpoint to List Events with pagination'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }   
            */
            const userId = req.plainToken.user_id;
            const { pageSize = GridDefaultOptions.PAGE_SIZE, currentPage = GridDefaultOptions.CURRENT_PAGE } = req.query;
            const events = await eventsService.listEvents(Number(currentPage), Number(pageSize), userId);
            const eventsCount = await eventsService.getEventsCount(userId);

            return res.status(STATUS.OK).send({
                data: { events: events || [], eventsCount },
                message: "Events Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`eventsController :: getEvents :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.EVENTS.EVENTS000);
        }
    },
    getEvent: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Events']
                #swagger.summary = 'Get Event'
                #swagger.description = 'Endpoint to Get Event'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
            */
            const { eventId } = req.params;
            if (!eventId) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.EVENTS.EVENTS002);

            const eventIdExists = await eventsRepository.existsByEventId(eventId);
            if (!eventIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.EVENTS.EVENTS001);

            const event = await eventsService.getEvent(eventId);
            return res.status(STATUS.OK).send({
                data: event,
                message: "Event Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`eventsController :: getEvent :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.EVENTS.EVENTS000);
        }
    },
    updateEventStatus: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Events']
                #swagger.summary = 'Update Event Status'
                #swagger.description = 'Endpoint to Update Event Status'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
                #swagger.parameters['body'] = {
                    in: 'body',
                    required: true,
                    schema: {
                        eventId: 'E1',
                        status: 1
                    }
                }    
            */
            const { eventId, status } = req.body;
            const userId = req.plainToken.user_id;

            const { error } = eventsModel.validateUpdateEventStatus(req.body);
            if (error) {
                if (error.details != null)
                    return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.EVENTS.EVENTS000.errorCode, errorMessage: error.details[0].message });
                else return res.status(STATUS.BAD_REQUEST).send({ errorCode: ERRORCODE.EVENTS.EVENTS000.errorCode, errorMessage: error.message });
            }

            const eventIdExists = await eventsRepository.existsByEventId(eventId);
            if (!eventIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.EVENTS.EVENTS001);

            await eventsService.updateEventStatus(eventId, status, userId);
            return res.status(STATUS.OK).send({
                data: null,
                message: "Event Status Updated Successfully!"
            });
        } catch (error) {
            logger.error(`eventsController :: updateEventStatus :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.EVENTS.EVENTS000);
        }
    },
    getEventByCategoryId: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Events']
                #swagger.summary = 'Get Event By Category Id'
                #swagger.description = 'Endpoint to Get Event By Category Id'
                #swagger.parameters['Authorization'] = {
                    in: 'header',
                    required: true,
                    type: 'string',
                    description: 'Bearer token for authentication'
                }
            */
            const { categoryId } = req.params;
            if (!categoryId) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.CATEGORIES.CATEGORIES002);

            const categoryIdExists = await categoriesRepository.existsByCategoryId(parseInt(categoryId));
            if (!categoryIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.CATEGORIES.CATEGORIES001);

            const events = await eventsService.listEventsByCategory(parseInt(categoryId));
            return res.status(STATUS.OK).send({
                data: events || [],
                message: "Events Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`eventsController :: getEventByCategoryId :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.EVENTS.EVENTS000);
        }
    }
};
