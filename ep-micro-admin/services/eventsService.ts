import { logger, redis } from "ep-micro-common";
import { IEvent } from "../types/custom";
import { eventsRepository } from "../repositories";
import { CacheTTL, EventStatus } from "../enums";

export const eventsService = {

    createEvent: async (event: IEvent) => {
        try {
            logger.info(`eventsService :: createEvent :: ${JSON.stringify(event)}`);
            await eventsRepository.createEvent(event);
            redis.deleteRedis('events');
        } catch (error) {
            logger.error(`eventsService :: createEvent :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateEvent: async (event: IEvent) => {
        try {
            logger.info(`eventsService :: updateEvent :: ${JSON.stringify(event)}`);
            await eventsRepository.updateEvent(event);
            redis.deleteRedis('events');
            redis.deleteRedis(`event:${event.eventId}`);
        } catch (error) {
            logger.error(`eventsService :: updateEvent :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getEvent: async (eventId: string) => {
        try {
            logger.info(`eventsService :: getEvent :: ${eventId}`);
            const key = `event:${eventId}`;
            const cachedResult = await redis.GetKeyRedis(key);
            if (cachedResult) return JSON.parse(cachedResult);

            const event = await eventsRepository.getEvent(eventId);
            logger.debug(`eventsService :: getEvent :: eventId :: ${eventId} :: ${JSON.stringify(event)}`);
            if (event) redis.SetRedis(key, event, CacheTTL.LONG);
            return event;
        } catch (error) {
            logger.error(`eventsService :: getEvent :: eventId :: ${eventId} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    listEvents: async (currentPage: number, pageSize: number): Promise<IEvent[]> => {
        try {
            const key = `events`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const events = await eventsRepository.getEvents(currentPage, pageSize);
            if (events && events.length > 0) {
                redis.setRedis(key, JSON.stringify(events));
                return events;
            }
        } catch (error) {
            logger.error(`eventsService :: listEvents :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateEventStatus: async (eventId: string, status: EventStatus) => {
        try {
            logger.info(`eventsService :: updateEventStatus :: ${eventId} :: ${status}`);
            await eventsRepository.updateEventStatus(eventId, status);
            redis.deleteRedis('events');
            redis.deleteRedis(`event:${eventId}`);
        } catch (error) {
            logger.error(`eventsService :: updateEventStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}