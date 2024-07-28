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
};
