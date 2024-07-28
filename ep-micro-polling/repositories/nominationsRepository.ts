import { logger, mongoDBRead } from "ep-micro-common";
import { NominationStatus, MongoCollections } from "../enums";
import { INomination } from "../types/custom";

export const nominationsRepository = {
    getNominationsByEvent: async (eventId: string): Promise<INomination[]> => {
        try {
            logger.info(`nominationsRepository :: getNominationsByEvent :: eventId :: ${eventId}`);
            const query =  { eventId, status: NominationStatus.APPROVED }

            const result = await mongoDBRead.filteredDocs(MongoCollections.NOMINATIONS, query);
            logger.debug(`nominationsRepository :: getNominationsByEvent :: eventId :: ${eventId} :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`nominationsRepository :: getNominationsByEvent :: eventId :: ${eventId} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getNomination: async (nomineeId: string): Promise<INomination | null> => {
        try {
            logger.info(`nominationsRepository :: getNomination :: ${nomineeId}`);
            const result = await mongoDBRead.findOne(MongoCollections.NOMINATIONS, { nomineeId, status: { $ne: NominationStatus.REJECTED } });
            logger.debug(`nominationsRepository :: getNomination :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`nominationsRepository :: getNomination :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    existsByNomineeId: async (nomineeId: string): Promise<boolean> => {
        try {
            logger.info(`nominationsRepository :: existsByNomineeId :: nomineeId :: ${nomineeId}`);
            const exists = await mongoDBRead.isExist(MongoCollections.NOMINATIONS, { nomineeId, status: NominationStatus.APPROVED });
            logger.debug(`nominationsRepository :: existsByNomineeId :: nomineeId :: ${nomineeId} :: exists :: ${exists}`);
            return exists;
        } catch (error) {
            logger.error(`nominationsRepository :: existsByNomineeId :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
};
