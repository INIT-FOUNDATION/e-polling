import { logger, mongoDB, mongoDBRead } from "ep-micro-common";
import { NominationStatus, MongoCollections } from "../enums";
import { INomination } from "../types/custom";

export const nominationsRepository = {
    createNomination: async (nomination: INomination) => {
        try {
            logger.info(`nominationsRepository :: createNomination :: ${JSON.stringify(nomination)}`);
            await mongoDB.insertOne(MongoCollections.NOMINATIONS, nomination);
        } catch (error) {
            logger.error(`nominationsRepository :: createNomination :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateNomination: async (nomination: INomination) => {
        try {
            logger.info(`nominationsRepository :: updateNomination :: ${JSON.stringify(nomination)}`);
            await mongoDB.updateOne(MongoCollections.NOMINATIONS, { nomineeId: nomination.nomineeId }, nomination);
        } catch (error) {
            logger.error(`nominationsRepository :: updateNomination :: ${error.message} :: ${error}`);
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
    getNominations: async (currentPage: number, pageSize: number, createdBy: number, status: NominationStatus, eventId: string): Promise<INomination[]> => {
        try {
            logger.info(`nominationsRepository :: getNominations :: currentPage :: ${currentPage} :: pageSize :: ${pageSize} :: createdBy :: ${createdBy} :: status :: ${status} :: eventId :: ${eventId}`);
            const query =  { createdBy, status }
            if (eventId) query["eventId"] = eventId

            const result = await mongoDBRead.findWithLimit(MongoCollections.NOMINATIONS, query, {
                _id: 0
            }, pageSize, { dateCreated: -1 }, currentPage);
            logger.debug(`nominationsRepository :: getNominations :: currentPage :: ${currentPage} :: pageSize :: ${pageSize} :: createdBy :: ${createdBy} :: status :: ${status} :: eventId :: ${eventId} :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`nominationsRepository :: getNominations :: currentPage :: ${currentPage} :: pageSize :: ${pageSize} :: createdBy :: ${createdBy} :: status :: ${status} :: eventId :: ${eventId} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getNominationsCount: async (createdBy: number, status: NominationStatus, eventId: string): Promise<number> => {
        try {
            logger.info(`nominationsRepository :: getNominationsCount :: status :: ${status} :: createdBy :: ${createdBy} :: eventId :: ${eventId}`);
            const query =  { createdBy, status }
            if (eventId) query["eventId"] = eventId
            const count = await mongoDBRead.count(MongoCollections.NOMINATIONS, query);
            return count;
        } catch (error) {
            logger.error(`nominationsRepository :: getNominationsCount :: status :: ${status} :: createdBy :: ${createdBy} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    updateNominationStatus: async (nomineeId: string, status: NominationStatus) => {
        try {
            logger.info(`nominationsRepository :: updateNominationStatus :: ${nomineeId} :: ${status}`);
            await mongoDB.updateOne(MongoCollections.NOMINATIONS, { nomineeId }, { status, dateUpdated: new Date().toISOString() });
        } catch (error) {
            logger.error(`nominationsRepository :: updateNominationStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    existsByNomineeId: async (nomineeId: string): Promise<boolean> => {
        try {
            logger.info(`nominationsRepository :: existsByNomineeId :: nomineeId :: ${nomineeId}`);
            const exists = await mongoDBRead.isExist(MongoCollections.NOMINATIONS, { nomineeId, status: { $ne: NominationStatus.REJECTED } });
            logger.debug(`nominationsRepository :: existsByNomineeId :: nomineeId :: ${nomineeId} :: exists :: ${exists}`);
            return exists;
        } catch (error) {
            logger.error(`nominationsRepository :: existsByNomineeId :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getNominationsByEventId: async (eventId: string): Promise<INomination[]> => {
        try {
            logger.info(`nominationsRepository :: getNominationsByEventId :: eventId :: ${eventId}`);
            const result = await mongoDBRead.findWithProjectionSort(MongoCollections.NOMINATIONS, { eventId, status: { $ne: NominationStatus.APPROVED } }, { _id: 0 }, { dateCreated: -1 });
            logger.debug(`nominationsRepository :: getNominationsByEventId :: eventId :: ${eventId} :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`nominationsRepository :: getNominationsByEventId :: eventId :: ${eventId} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
};
