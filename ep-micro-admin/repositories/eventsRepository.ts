import { EventStatus } from "../enums";
import { MongoCollections } from "../enums";
import { IEvent } from "../types/custom";
import { mongoDB, mongoDBRead, logger } from "ep-micro-common";

export const eventsRepository = {
    createEvent: async (event: IEvent) => {
        try {
            logger.info(`eventsRepository :: createEvent :: ${JSON.stringify(event)}`);
            await mongoDB.insertOne(MongoCollections.EVENTS, event);
        } catch (error) {
            logger.error(`eventsRepository :: createEvent :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateEvent: async (event: IEvent) => {
        try {
            logger.info(`eventsRepository :: updateEvent :: ${JSON.stringify(event)}`);
            await mongoDB.updateOne(MongoCollections.EVENTS, { eventId: event.eventId }, {
                eventName: event.eventName,
                eventDescription: event.eventDescription,
                startTime: event.startTime,
                endTime: event.endTime,
                categoryId: event.categoryId,
                dateUpdated: new Date().toISOString(),
                updatedBy: event.updatedBy
            });
        } catch (error) {
            logger.error(`eventsRepository :: updateEvent :: ${error.message} :: ${error}`);
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
    getEvents: async (currentPage: number, pageSize: number, createdBy: number): Promise<IEvent[]> => {
        try {
            logger.info(`eventsRepository :: getEvents :: currentPage :: ${currentPage} :: pageSize :: ${pageSize}`);
            const result = await mongoDBRead.findWithLimit(MongoCollections.EVENTS, { createdBy, status: { $ne: EventStatus.DELETED } }, {
                _id: 0
            },
            pageSize,
            {
                dateCreated: -1,
            },
            currentPage);
            logger.debug(`eventsRepository :: getEvents :: currentPage :: ${currentPage} :: pageSize :: ${pageSize} :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`eventsRepository.getEvents: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getEventsCount: async (createdBy: number): Promise<number> => {
        try {
            logger.info(`eventsRepository :: getEventsCount`);
            const count = await mongoDBRead.count(MongoCollections.EVENTS, { createdBy, status: { $ne: EventStatus.DELETED } });
            return count;
        } catch (error) {
            logger.error(`eventsRepository :: getEventsCount :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateEventStatus: async (eventId: string, status: EventStatus, updatedBy: number) => {
        try {
            logger.info(`eventsRepository :: updateEventStatus :: eventId :: ${eventId} :: status :: ${status} :: updatedBy :: ${updatedBy}`);
            await mongoDB.updateOne(MongoCollections.EVENTS, { eventId }, { status, dateUpdated: new Date().toISOString(), updatedBy });
        } catch (error) {
            logger.error(`eventsRepository :: updateEventStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    existsByEventId: async (eventId: string): Promise<boolean> => {
        try {
            logger.info(`eventsRepository :: existsByEventId :: eventId :: ${eventId}`);
            const exists = await mongoDBRead.isExist(MongoCollections.EVENTS, { eventId, status: { $ne: EventStatus.DELETED } });
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
            const result = await mongoDBRead.filteredDocs(MongoCollections.EVENTS, { categoryId, status: { $ne: EventStatus.DELETED } });
            logger.debug(`eventsRepository :: listEventsByStatus :: categoryId :: ${categoryId} :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`eventsRepository :: listEventsByStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}