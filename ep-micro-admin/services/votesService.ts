import { CacheTTL } from "../enums";
import { votesRepository } from "../repositories";
import { IVote, IVoteResult } from "../types/custom";
import { logger, redis } from "ep-micro-common";
import { nominationsService } from "./nominationsService";
import { eventsService } from "./eventsService";
import { categoriesService } from "./categoriesService";

export const votesService = {
    listVotes: async (currentPage: number, pageSize: number, eventId: string): Promise<IVote[]> => {
        try {
            currentPage = currentPage > 1 ? (currentPage - 1) * pageSize : 0;
            let key = `votes|page:${currentPage}|limit:${pageSize}`;
            if (eventId) key = `votes|event:${eventId}|page:${currentPage}|limit:${pageSize}`;

            const cacheResult = await redis.GetKeyRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const votes = await votesRepository.listVotes(currentPage, pageSize, eventId);
            if (votes && votes.length > 0) {
                for (const vote of votes) {
                    if (vote) {
                        if (vote.nomineeId) {
                            const nomination = await nominationsService.getNomination(vote.nomineeId);
                            if (nomination && nomination.nomineeName) vote["nomineeName"] = nomination.nomineeName;   

                            if (nomination.eventId) {
                                const event = await eventsService.getEvent(nomination.eventId);
                                if (event && event.eventName) vote["eventName"] = event.eventName;

                                const category = await categoriesService.getCategoryById(event.categoryId);
                                if (category && category.category_name) vote["categoryName"] = category.category_name;
                            }
                        }
                    }
                }
                redis.SetRedis(key, votes, CacheTTL.LONG);
            }
            return votes;
        } catch (error) {
            logger.error(`votesService :: listVotes :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getVotesCount: async (eventId: string): Promise<number> => {
        try {
            let key = `votes|count`;
            if (eventId) key = `votes|event:${eventId}|count`;

            const cacheResult = await redis.GetKeyRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const count = await votesRepository.getVotesCount(eventId);
            if (count > 0) redis.SetRedis(key, count, CacheTTL.LONG);
            return count;
        } catch (error) {
            logger.error(`votesService :: getVotesCount :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getNomineeVotesByEvent: async (currentPage: number, pageSize: number, eventId: string): Promise<IVoteResult[]> => {
        try {
            currentPage = currentPage > 1 ? (currentPage - 1) * pageSize : 0;
            const key = `votes_result|event:${eventId}|page:${currentPage}|limit:${pageSize}`;
            const cacheResult = await redis.GetKeyRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const votes = await votesRepository.getNominationVotesByEventId(currentPage, pageSize, eventId);
            if (votes && votes.length > 0) redis.SetRedis(key, votes, CacheTTL.LONG);
            return votes;
        } catch (error) {
            logger.error(`votesService :: getNomineeVotesByEvent :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getNomineeVotesCountByEvent: async (eventId: string): Promise<number> => {
        try {
            const key = `votes_result|event:${eventId}|count`;
            const cacheResult = await redis.GetKeyRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const count = await votesRepository.getNominationVotesCountByEventId(eventId);
            if (count > 0) redis.SetRedis(key, count, CacheTTL.LONG);
            return count;
        } catch (error) {
            logger.error(`votesService :: getNomineeVotesCountByEvent :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}