import { logger, redis } from "ep-micro-common";
import { IEvent } from "../types/custom";
import { eventsRepository } from "../repositories";
import { CacheTTL, EventStatus, GridDefaultOptions } from "../enums";
import { votesService } from "./votesService";

export const eventsService = {
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
            const key = `events|opened|category:${categoryId}`;
            const cacheResult = await redis.GetKeyRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const events = await eventsRepository.listEventsByCategory(categoryId);
            if (events && events.length > 0) redis.SetRedis(key, events, CacheTTL.LONG);
            return events;
        } catch (error) {
            logger.error(`eventsService :: listEventsByCategory :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    pastClosedEvents: async (limit: number, categoryId: number): Promise<IEvent[]> => {
        try {
            let key = `events|closed`;
            if (categoryId && categoryId > 0) key = `events|closed|category:${categoryId}`;

            const cacheResult = await redis.GetKeyRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);
            
            const events = await eventsRepository.pastClosedEvents(limit, categoryId);
            for (const event of events) {
                const votes = await votesService.getNomineeVotesByEvent(GridDefaultOptions.CURRENT_PAGE, GridDefaultOptions.PAGE_SIZE, event.eventId);
                event["votes"] = votes.slice(0, 3);
            }
            if (events && events.length > 0) redis.SetRedis(key, events, CacheTTL.LONG);
            return events;
        } catch (error) {
            logger.error(`eventsService :: pastClosedEvents :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}