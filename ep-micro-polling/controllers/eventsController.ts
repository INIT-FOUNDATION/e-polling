import { logger, STATUS } from "ep-micro-common";
import { Response, Request } from "express";
import { ERRORCODE } from "../constants";
import { eventsService } from "../services";
import { categoriesRepository } from "../repositories";

export const eventsController = {
    getEventByCategoryId: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Events']
                #swagger.summary = 'Get Event By Category Id'
                #swagger.description = 'Endpoint to Get Event By Category Id'
            */
            const { categoryId } = req.params;
            if (!categoryId) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.CATEGORIES.CATEGORIES002);

            const categoryIdExists = await categoriesRepository.existsByCategoryId(parseInt(categoryId));
            if (!categoryIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.CATEGORIES.CATEGORIES001);

            const events = await eventsService.listEventsByCategory(parseInt(categoryId));
            return res.status(STATUS.OK).send({
                data: events,
                message: "Events Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`eventsController :: getEventByCategoryId :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.EVENTS.EVENTS000);
        }
    },
    getPastClosedEvents: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Events']
                #swagger.summary = 'Get Past Closed Events'
                #swagger.description = 'Endpoint to Get Past Closed Events'
            */
            const { categoryId } = req.query;
            const pastEventsCount = 10;

            if (categoryId && Number(categoryId) > 0) {
                const categoryIdExists = await categoriesRepository.existsByCategoryId(Number(categoryId));
                if (!categoryIdExists) return res.status(STATUS.BAD_REQUEST).send(ERRORCODE.CATEGORIES.CATEGORIES001);
            }
            
            const events = await eventsService.pastClosedEvents(pastEventsCount, Number(categoryId));
            return res.status(STATUS.OK).send({
                data: events,
                message: "Events Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`eventsController :: getPastClosedEvents :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.EVENTS.EVENTS000);
        }
    },
    getEventsFeed: async (req: Request, res: Response) => {
        try {
            /*  
                #swagger.tags = ['Events']
                #swagger.summary = 'Get Events Feed'
                #swagger.description = 'Endpoint to Get Events Feed'
            */
            const limit = 10;
            const events = await eventsService.getEventsFeed(limit);
            return res.status(STATUS.OK).send({
                data: events,
                message: "Events Feed Fetched Successfully!"
            });
        } catch (error) {
            logger.error(`eventsController :: getEventsFeed :: ${error.message} :: ${error}`);
            res.status(STATUS.INTERNAL_SERVER_ERROR).send(ERRORCODE.EVENTS.EVENTS000);
        }
    }
};