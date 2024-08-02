import { logger, mongoDBRead, mongoDB } from "ep-micro-common";
import { MongoCollections, SupportRequestsPeriodTypes, SupportRequestStatus } from "../enums";
import { ISupportRequest } from "../types/custom";
import moment from "moment";

export const supportRequestsRepository = {
    listSupportRequests: async (currentPage: number, pageSize: number, supportRequestPeriodType: SupportRequestsPeriodTypes): Promise<ISupportRequest[]> => {
        try {
            logger.info(`supportRequestsRepository :: listSupportRequests :: pageSize :: ${pageSize}, currentPage :: ${currentPage}`);
            const query = supportRequestsRepository.getDateRangeQuery(supportRequestPeriodType);
            
            return await mongoDBRead.findWithLimit(
                MongoCollections.SUPPORT_REQUESTS,
                query,
                { _id: 0, requesterDeviceDetails: 0, dateCreated: 0, dateUpdated: 0, resolvedBy: 0 },
                pageSize,
                { dateCreated: -1 },
                currentPage
            );
        } catch (error) {
            logger.error(`supportRequestsRepository :: listSupportRequests :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getSupportRequestsCount: async (supportRequestPeriodType: SupportRequestsPeriodTypes): Promise<number> => {
        try {
            logger.info(`supportRequestsRepository :: getSupportRequestsCount`);
            const query = supportRequestsRepository.getDateRangeQuery(supportRequestPeriodType);

            const count = await mongoDBRead.count(MongoCollections.SUPPORT_REQUESTS, query);
            return count;
        } catch (error) {
            logger.error(`supportRequestsRepository :: getSupportRequestsCount :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
   getDateRangeQuery: (periodType: SupportRequestsPeriodTypes) => {
        switch (periodType) {
            case SupportRequestsPeriodTypes.TODAY:
                return {
                    dateCreated: {
                        $gte: moment().startOf('day').toISOString(),
                        $lte: moment().endOf('day').toISOString()
                    }
                };
            case SupportRequestsPeriodTypes.YESTERDAY:
                return {
                    dateCreated: {
                        $gte: moment().subtract(1, 'day').startOf('day').toISOString(),
                        $lte: moment().subtract(1, 'day').endOf('day').toISOString()
                    }
                };
            case SupportRequestsPeriodTypes.PAST:
                return {
                    dateCreated: {
                        $lt: moment().startOf('day').toISOString()
                    }
                };
            default:
                throw new Error('Invalid period type');
        }
    },
    updateSupportRequestStatus: async (supportRequestId: string, status: SupportRequestStatus, resolvedBy: number) => {
        try {
            logger.info(`supportRequestsRepository :: updateSupportRequestStatus :: supportRequestId :: ${supportRequestId} :: status :: ${status} :: resolvedBy :: ${resolvedBy}`);
            await mongoDB.update(MongoCollections.SUPPORT_REQUESTS, { supportRequestId }, { status, dateUpdated: new Date().toISOString(), resolvedBy });
        } catch (error) {
            logger.error(`supportRequestsRepository :: updateSupportRequestStatus :: supportRequestId :: ${supportRequestId} :: status :: ${status} :: resolvedBy :: ${resolvedBy} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    existsBySupportRequestId: async (supportRequestId: string): Promise<boolean> => {
        try {
            logger.info(`supportRequestsRepository :: existsBySupportRequestId :: supportRequestId :: ${supportRequestId}`);
            const exists = await mongoDBRead.isExist(MongoCollections.SUPPORT_REQUESTS, { supportRequestId });
            return exists;
        } catch (error) {
            logger.error(`supportRequestsRepository :: existsBySupportRequestId :: supportRequestId :: ${supportRequestId} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
};
