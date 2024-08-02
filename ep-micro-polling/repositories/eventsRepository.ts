import { EventStatus } from "../enums";
import { MongoCollections } from "../enums";
import { IEvent } from "../types/custom";
import { mongoDBRead, mongoDB, logger } from "ep-micro-common";

export const eventsRepository = {
    existsByEventId: async (eventId: string): Promise<boolean> => {
        try {
            logger.info(`eventsRepository :: existsByEventId :: eventId :: ${eventId}`);
            const exists = await mongoDBRead.isExist(MongoCollections.EVENTS, { eventId, status: EventStatus.OPENED });
            logger.debug(`eventsRepository :: existsByEventId :: eventId :: ${eventId} :: exists :: ${exists}`);
            return exists;
        } catch (error) {
            logger.error(`eventsRepository :: existsByEventId :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    listEventsByCategory: async (categoryId: number): Promise<IEvent[]> => {
        try {
            logger.info(`eventsRepository :: listEventsByCategory :: categoryId :: ${categoryId}`);
            const result = await mongoDBRead.filteredDocs(MongoCollections.EVENTS, { categoryId, status: EventStatus.OPENED });
            logger.debug(`eventsRepository :: listEventsByStatus :: categoryId :: ${categoryId} :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`eventsRepository :: listEventsByStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getEvent: async (eventId: string): Promise<IEvent> => {
        try {
            logger.info(`eventsRepository :: getEvent :: ${eventId}`);
            const result = await mongoDBRead.findOne(MongoCollections.EVENTS, { eventId, status: { $ne: EventStatus.DELETED } });
            logger.debug(`eventsRepository :: getEvent :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`eventsRepository :: getEvent :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateEventStatus: async (eventId: string, status: EventStatus) => {
        try {
            logger.info(`eventsRepository.updateEventStatus: ${eventId} :: ${status}`);
            await mongoDB.updateOne(MongoCollections.EVENTS, { eventId }, { status, dateUpdated: new Date().toISOString() });
        } catch (error) {
            logger.error(`eventsRepository.updateEventStatus: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    pastClosedEvents: async (limit: number, categoryId: number): Promise<IEvent[]> => {
        try {
            const query = { status: EventStatus.CLOSED };
            if (categoryId && categoryId > 0) query['categoryId'] = categoryId;

            logger.info(`eventsRepository :: pastClosedEvents :: limit :: ${limit}`);
            const result = await mongoDBRead.filteredDocs(MongoCollections.EVENTS, query, {
                _id: 0,
                eventId: 1,
                eventName: 1,
                dateCreated: 1
            }, limit,
                {
                    dateCreated: -1
                },
                0
            );
            logger.debug(`eventsRepository :: pastClosedEvents :: limit :: ${limit} :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`eventsRepository :: pastClosedEvents :: limit :: ${limit} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}