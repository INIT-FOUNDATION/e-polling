import { logger, mongoDB } from "ep-micro-common";
import { MongoCollections } from "../enums";
import { ISupportRequest } from "../types/custom";

export const supportRequestsRepository = {
    createSupportRequest: async (supportRequest: ISupportRequest) => {
        try {
            logger.info(`supportRequestsRepository :: createSupportRequest :: ${JSON.stringify(supportRequest)}`);
            await mongoDB.insertOne(MongoCollections.SUPPORT_REQUESTS, supportRequest);
        } catch (error) {
            logger.error(`supportRequestsRepository :: createSupportRequest :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
};
