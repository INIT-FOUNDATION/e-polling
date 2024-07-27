import { logger, redis } from "ep-micro-common";
import { IEvent } from "../types/custom";
import { eventsRepository } from "../repositories";
import { CacheTTL, EventStatus } from "../enums";

export const eventsService = {

    createEvent: async (event: IEvent) => {
        try {
            logger.info(`eventsService :: createEvent :: ${JSON.stringify(event)}`);
            await eventsRepository.createEvent(event);
            redis.deleteRedis(`events|created_by:${event.createdBy}|page:0|limit:50`);
            redis.deleteRedis(`events|created_by:${event.createdBy}|count`);
            redis.deleteRedis(`event|category:${event.categoryId}`);
        } catch (error) {
            logger.error(`eventsService :: createEvent :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateEvent: async (event: IEvent) => {
        try {
            logger.info(`eventsService :: updateEvent :: ${JSON.stringify(event)}`);
            await eventsRepository.updateEvent(event);
            redis.deleteRedis(`events|created_by:${event.createdBy}|page:0|limit:50`);
            redis.deleteRedis(`events|created_by:${event.createdBy}|count`);
            redis.deleteRedis(`event|category:${event.categoryId}`);
        } catch (error) {
            logger.error(`eventsService :: updateEvent :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getEvent: async (eventId: string): Promise<IEvent> => {
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
    listEvents: async (currentPage: number, pageSize: number, createdBy: number): Promise<IEvent[]> => {
        try {
            const key = `events|created_by:${createdBy}|page:${currentPage}|limit:${pageSize}`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const events = await eventsRepository.getEvents(currentPage, pageSize, createdBy);
            if (events && events.length > 0) {
                redis.SetRedis(key, events, CacheTTL.LONG);
                return events;
            }
        } catch (error) {
            logger.error(`eventsService :: listEvents :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getEventsCount: async (createdBy: number): Promise<number> => {
        try {
            const key = `events|created_by:${createdBy}|count`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const count = await eventsRepository.getEventsCount(createdBy);
            if (count > 0) redis.SetRedis(key, count, CacheTTL.LONG);
            return count;
        } catch (error) {
            logger.error(`eventsService :: getEventsCount :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateEventStatus: async (eventId: string, status: EventStatus, createdBy: number) => {
        try {
            logger.info(`eventsService :: updateEventStatus :: ${eventId} :: ${status}`);
            const event = await eventsService.getEvent(eventId);
            await eventsRepository.updateEventStatus(eventId, status);
            redis.deleteRedis(`events|created_by:${createdBy}|page:0|limit:50`);
            redis.deleteRedis(`events|created_by:${createdBy}|count`);
            redis.deleteRedis(`event|category:${event.categoryId}`);
        } catch (error) {
            logger.error(`eventsService :: updateEventStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    listEventsByCategory: async (categoryId: number): Promise<IEvent[]> => {
        try {
            logger.info(`eventsService :: listEventsByCategory :: ${categoryId}`);
            const key = `events|category:${categoryId}`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const events = await eventsRepository.listEventsByCategory(categoryId);
            if (events && events.length > 0) redis.SetRedis(key, events, CacheTTL.LONG);
            return events;
        } catch (error) {
            logger.error(`eventsService :: listEventsByCategory :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}