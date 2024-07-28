import { EventStatus } from "../enums";
import { MongoCollections } from "../enums";
import { IEvent } from "../types/custom";
import { mongoDBRead, logger } from "ep-micro-common";

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
}