import { logger, mongoDBRead } from "ep-micro-common";
import { MongoCollections, VoteStatus } from "../enums";
import { IVote } from "../types/custom";

export const votesRepository = {
    existsVoteByNomineeIdAndEmail: async (nomineeId: string, voterEmail: string): Promise<boolean> => {
        try {
            logger.info(`votesRepository :: existsVoteByNomineeIdAndEmail :: nomineeId :: ${nomineeId} :: voterEmail :: ${voterEmail}`);
            const exists = await mongoDBRead.isExist(MongoCollections.VOTES, { nomineeId, voterEmail, status: { $ne: VoteStatus.ACTIVE } });
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
            const exists = await mongoDBRead.isExist(MongoCollections.VOTES, { nomineeId, voterMobile, status: { $ne: VoteStatus.ACTIVE } });
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
            await mongoDBRead.insertOne(MongoCollections.VOTES, vote);
        } catch (error) {
            logger.error(`votesRepository :: existsVoteByNomineeIdAndEmail :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}