import { logger, redis } from "ep-micro-common";
import { ISupportRequest } from "../types/custom";
import { CacheTTL, SupportRequestsPeriodTypes, SupportRequestStatus } from "../enums";
import { supportRequestsRepository } from "../repositories";

export const supportRequestsService = {
    listSupportRequests: async (currentPage: number, pageSize: number, supportRequestPeriodType: SupportRequestsPeriodTypes): Promise<ISupportRequest[]> => {
        try {
            const key = `support_requests|period_type:${supportRequestPeriodType}|page:${currentPage}|limit:${pageSize}`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const supportRequests = await supportRequestsRepository.listSupportRequests(currentPage, pageSize, supportRequestPeriodType);
            if (supportRequests && supportRequests.length > 0) redis.SetRedis(key, supportRequests, CacheTTL.LONG);
            return supportRequests;
        } catch (error) {
            logger.error(`supportRequestsService :: getSupportRequests :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    getSupportRequestsCount: async (supportRequestPeriodType: SupportRequestsPeriodTypes): Promise<number> => {
        try {
            const key = `support_requests|period_type:${supportRequestPeriodType}|count`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const count = await supportRequestsRepository.getSupportRequestsCount(supportRequestPeriodType);
            if (count > 0) redis.SetRedis(key, count, CacheTTL.LONG);
            return count;
        } catch (error) {
            logger.error(`supportRequestsService :: getSupportRequestsCount :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    updateSupportRequestStatus: async (supportRequestId: string, status: SupportRequestStatus, resolvedBy: number) => {
        try {
            await supportRequestsRepository.updateSupportRequestStatus(supportRequestId, status, resolvedBy);
            for (const status of Object.values(SupportRequestStatus)) {
                redis.deleteRedis(`support_requests|period_type:${status}|page:0|limit:50`);
                redis.deleteRedis(`support_requests|period_type:${status}|count`);
            }
        } catch (error) {
            logger.error(`supportRequestsService :: updateSupportRequestStatus :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    }
}