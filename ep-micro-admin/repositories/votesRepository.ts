import { logger, mongoDBRead } from "ep-micro-common";
import { MongoCollections } from "../enums";
import { IVote } from "../types/custom";

export const votesRepository = {
    listVotes: async (currentPage: number, pageSize: number, eventId: string): Promise<IVote[]> => {
        try {
            const query = {}
            if (eventId) query["eventId"] = eventId

            logger.info(`votesRepository :: listVotes :: eventId :: ${eventId}`);
            return await mongoDBRead.findWithLimit(MongoCollections.VOTES, query, {
                _id: 0
            }, 
            pageSize,
            {
                dateCreated: -1
            },
            currentPage);
        } catch (error) {
            logger.error(`votesRepository :: listVotes :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getVotesCount: async (eventId: string): Promise<number> => {
        try {
            logger.info(`votesRepository :: getVotesCount :: eventId :: ${eventId}`);
            const query = {}
            if (eventId) query["eventId"] = eventId
            const count = await mongoDBRead.count(MongoCollections.VOTES, query);
            return count;
        } catch (error) {
            logger.error(`votesRepository :: getVotesCount :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}