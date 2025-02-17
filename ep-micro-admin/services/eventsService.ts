import { logger, redis } from "ep-micro-common";
import { IEvent } from "../types/custom";
import { eventsRepository } from "../repositories";
import { CacheTTL, EventStatus } from "../enums";
import moment from "moment";
import { votesService } from "./votesService";

export const eventsService = {
    createEvent: async (event: IEvent) => {
        try {
            logger.info(`eventsService :: createEvent :: ${JSON.stringify(event)}`);
            await eventsRepository.createEvent(event);
            await redis.deleteRedis(`events|created_by:${event.createdBy}|page:0|limit:50`);
            await redis.deleteRedis(`events|created_by:${event.createdBy}|count`);
            await redis.deleteRedis(`events|category:${event.categoryId}`);
            await redis.deleteRedis(`events|opened|category:${event.categoryId}`);
            await redis.deleteRedis(`events|closed|category:${event.categoryId}`);
            await redis.deleteRedis(`events|closed`);
            await redis.deleteRedis(`events|feed`);
        } catch (error) {
            logger.error(`eventsService :: createEvent :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateEvent: async (event: IEvent) => {
        try {
            logger.info(`eventsService :: updateEvent :: ${JSON.stringify(event)}`);
            await eventsRepository.updateEvent(event);
            await redis.deleteRedis(`events|created_by:${event.updatedBy}|page:0|limit:50`);
            await redis.deleteRedis(`events|created_by:${event.updatedBy}|count`);
            await redis.deleteRedis(`events|category:${event.categoryId}`);
            await redis.deleteRedis(`events|opened|category:${event.categoryId}`);
            await redis.deleteRedis(`events|closed|category:${event.categoryId}`);
            await redis.deleteRedis(`events|closed`);
            await redis.deleteRedis(`events|feed`);
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
            currentPage = currentPage > 1 ? (currentPage - 1) * pageSize : 0;
            const key = `events|created_by:${createdBy}|page:${currentPage}|limit:${pageSize}`;
            const cacheResult = await redis.GetKeyRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const events = await eventsRepository.getEvents(currentPage, pageSize, createdBy);
            for (const event of events) {
                if (moment().isAfter(event.startTime)) {
                    await eventsService.updateEventStatus(event.eventId, EventStatus.OPENED, event.createdBy);
                    event.status = EventStatus.OPENED;
                }
                if (moment().isAfter(event.endTime)) {
                    await eventsService.updateEventStatus(event.eventId, EventStatus.CLOSED, event.createdBy);
                    const votes = await votesService.getNomineeVotesByEvent(1, 50, event.eventId);
                    if (votes.length > 0) {
                        event["winnerName"] = votes[0].nomineeName;
                        event.status = EventStatus.CLOSED;
                    }
                }
            }

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
            const cacheResult = await redis.GetKeyRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const count = await eventsRepository.getEventsCount(createdBy);
            if (count > 0) redis.SetRedis(key, count, CacheTTL.LONG);
            return count;
        } catch (error) {
            logger.error(`eventsService :: getEventsCount :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateEventStatus: async (eventId: string, status: EventStatus, updatedBy: number) => {
        try {
            logger.info(`eventsService :: updateEventStatus :: ${eventId} :: ${status}`);
            const event = await eventsService.getEvent(eventId);
            await eventsRepository.updateEventStatus(eventId, status, updatedBy);
            await redis.deleteRedis(`events|created_by:${updatedBy}|page:0|limit:50`);
            await redis.deleteRedis(`events|created_by:${updatedBy}|count`);
            await redis.deleteRedis(`events|category:${event.categoryId}`);
            await redis.deleteRedis(`events|opened|category:${event.categoryId}`);
            await redis.deleteRedis(`events|closed|category:${event.categoryId}`);
            await redis.deleteRedis(`events|closed`);
            await redis.deleteRedis(`events|feed`);
        } catch (error) {
            logger.error(`eventsService :: updateEventStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    listEventsByCategory: async (categoryId: number): Promise<IEvent[]> => {
        try {
            logger.info(`eventsService :: listEventsByCategory :: ${categoryId}`);
            const key = `events|category:${categoryId}`;
            const cacheResult = await redis.GetKeyRedis(key);
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