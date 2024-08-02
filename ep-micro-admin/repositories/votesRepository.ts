import { logger, mongoDBRead } from "ep-micro-common";
import { MongoCollections, NominationStatus, VoteStatus } from "../enums";
import { IVote, IVoteResult } from "../types/custom";

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
    },
    getNominationVotesByEventId: async (currentPage: number, pageSize: number, eventId: string): Promise<IVoteResult[]> => {
        try {
            logger.info(`votesRepository :: getNominationVotesByEventId :: eventId :: ${eventId}`);
            const aggegration = [
                {
                    $match: {
                        status: VoteStatus.ACTIVE
                    }
                },
                {
                    $lookup: {
                        from: MongoCollections.NOMINATIONS,
                        pipeline: [
                            { 
                                $match: {
                                    status: NominationStatus.APPROVED
                                }
                            }
                        ],
                        localField: "nomineeId",
                        foreignField: "nomineeId",
                        as: "nomination"
                    }
                },
                {
                    $unwind: "$nomination"
                },
                {
                    $group: {
                        _id: {
                            nomineeName: "$nomination.nomineeName"
                        },
                        votes: { $sum: 1 }
                    }
                },
                {
                    $sort: { votes: -1 }
                },
                {
                    $project: {
                        _id: 0,
                        nomineeName: "$_id.nomineeName",
                        votes: 1
                    }
                },
                {
                    $skip: currentPage
                },
                {
                    $limit: pageSize
                }
            ]
            return await mongoDBRead.findWithAggregation(MongoCollections.VOTES, aggegration);
        } catch (error) {
            logger.error(`votesRepository :: getNominationVotesByNomineeId :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getNominationVotesCountByEventId: async (eventId: string): Promise<number> => {
        try {
            logger.info(`votesRepository :: getNominationVotesCountByEventId :: eventId :: ${eventId}`);
            const aggregation = [
                {
                    $match: {
                        status: VoteStatus.ACTIVE
                    }
                },
                {
                    $lookup: {
                        from: MongoCollections.NOMINATIONS,
                        pipeline: [
                            { 
                                $match: {
                                    status: NominationStatus.APPROVED
                                }
                            }
                        ],
                        localField: "nomineeId",
                        foreignField: "nomineeId",
                        as: "nomination"
                    }
                },
                {
                    $unwind: "$nomination"
                },
                {
                    $group: {
                        _id: {
                            nomineeName: "$nomination.nomineeName"
                        },
                        votes: { $sum: 1 }
                    }
                },
                {
                    $sort: { votes: -1 }
                },
                {
                    $project: {
                        _id: 0,
                        nomineeName: "$_id.nomineeName",
                        votes: 1
                    }
                },
                {
                    $count: "totalVotes"
                }
            ];            
            const result = await mongoDBRead.findWithAggregation(MongoCollections.VOTES, aggregation);
            return result.length > 0 && result[0].totalVotes ? result[0].totalVotes : 0;
        } catch (error) {
            logger.error(`votesRepository :: getNominationVotesCountByEventId :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}