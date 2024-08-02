import { logger, mongoDBRead, mongoDB } from "ep-micro-common";
import { MongoCollections, NominationStatus, VoteStatus } from "../enums";
import { IVote, IVoteResult } from "../types/custom";

export const votesRepository = {
    existsVoteByNomineeIdAndEmail: async (nomineeId: string, voterEmail: string): Promise<boolean> => {
        try {
            logger.info(`votesRepository :: existsVoteByNomineeIdAndEmail :: nomineeId :: ${nomineeId} :: voterEmail :: ${voterEmail}`);
            const exists = await mongoDBRead.isExist(MongoCollections.VOTES, { nomineeId, voterEmail, status: VoteStatus.ACTIVE });
            logger.debug(`votesRepository :: existsVoteByNomineeIdAndEmail :: nomineeId :: ${nomineeId} :: voterEmail :: ${voterEmail} :: exists :: ${exists}`);
            return exists;
        } catch (error) {
            logger.error(`votesRepository :: existsVoteByNomineeIdAndEmail :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    existsVoteByNomineeAndMobile: async (nomineeId: string, voterMobile: number): Promise<boolean> => {
        try {
            logger.info(`votesRepository :: existsVoteByNomineeAndMobile :: nomineeId :: ${nomineeId} :: voterMobile :: ${voterMobile}`);
            const exists = await mongoDBRead.isExist(MongoCollections.VOTES, { nomineeId, voterMobile, status: VoteStatus.ACTIVE });
            logger.debug(`votesRepository :: existsVoteByNomineeAndMobile :: nomineeId :: ${nomineeId} :: voterMobile :: ${voterMobile} :: exists :: ${exists}`);
            return exists;
        } catch (error) {
            logger.error(`votesRepository :: existsVoteByNomineeIdAndEmail :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    publishVote: async (vote: IVote) => {
        try {
            logger.info(`votesRepository :: publishVote :: ${JSON.stringify(vote)}`);
            await mongoDB.insertOne(MongoCollections.VOTES, vote);
        } catch (error) {
            logger.error(`votesRepository :: existsVoteByNomineeIdAndEmail :: ${error.message} :: ${error}`);
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
}