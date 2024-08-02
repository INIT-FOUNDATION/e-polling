import { logger, redis } from "ep-micro-common";
import { IEvent } from "../types/custom";
import { eventsRepository } from "../repositories";
import { CacheTTL, EventStatus, GridDefaultOptions } from "../enums";
import { votesService } from "./votesService";
import moment from "moment";

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
    },
    getEventsFeed: async (limit: number): Promise<IEvent[]> => {
        try {
            const key = `events|feed`;
            const cacheResult = await redis.GetKeyRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const eventDetails = [];
            const events = await eventsRepository.getEventsFeed(limit);
            for (const event of events) {
                switch (event.status) {
                    case EventStatus.ACTIVE:
                        eventDetails.push({
                            eventDuration: `${moment(event.dateCreated).format('MMM DD')} - ${moment(event.startTime).format('MMM DD')}`,
                            eventName: "Nominations Open",
                            eventDescription: `Nominations for ${event.eventName} are now open and will close on ${moment(event.startTime).format('MMMM DD, YYYY hh:mm A')}.`,
                        });
                        eventDetails.push({
                            eventDuration: `${moment(event.dateCreated).format('MMM DD')} - ${moment(event.startTime).format('MMM DD')}`,
                            eventName: "Industry Judging",
                            eventDescription: `Our panel of Judges will be selecting the final nominees`,
                        });
                        break;
                    case EventStatus.OPENED:
                        eventDetails.push({
                            eventDuration: `${moment(event.startTime).format('MMM DD')} - ${moment(event.endTime).format('MMM DD')}`,
                            eventName: "Public votes",
                            eventDescription: `The public votes will begins, Voting will be closed on ${moment(event.endTime).format('MMMM DD, YYYY hh:mm A')}.`,
                        });
                        break;
                    case EventStatus.CLOSED:
                        eventDetails.push({
                            eventDuration: `${moment(event.endTime).format('MMM DD')}`,
                            eventName: "Winners Announced",
                            eventDescription: `The winners of ${event.eventName} will be announced on ${moment(event.endTime).format('MMMM DD, YYYY hh:mm A')}.`,
                        });
                        break;
                }
            }
            if (eventDetails && eventDetails.length > 0) redis.SetRedis(key, eventDetails, CacheTTL.LONG);
            return eventDetails;  
        
        } catch (error) {
            logger.error(`eventsService :: getEventsFeed :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}