import { logger, redis, objectStorageUtility } from "ep-micro-common";
import { IJudge } from "../types/custom";
import { judgesRepository } from "../repositories";
import { CacheTTL } from "../enums";
import { OBJECT_STORAGE_BUCKET } from "../constants";

export const judgesService = {
    listJudges: async (eventId: string): Promise<IJudge[]> => {
        try {
            const key = `judges|active|event_id:${eventId}`;

            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const judges = await judgesRepository.getJudges(eventId);
            logger.debug(`judgesService :: listJudges :: judges :: ${JSON.stringify(judges)}`);

            for (const judge of judges) {
                if (judge.profilePictureUrl) {
                    const temporaryPublicURL = await objectStorageUtility.presignedGetObject(OBJECT_STORAGE_BUCKET, judge.profilePictureUrl, CacheTTL.LONG);
                    if (temporaryPublicURL) judge.profilePictureUrl = temporaryPublicURL;
                }
            }

            if (judges && judges.length > 0) {
                redis.SetRedis(key, judges, CacheTTL.LONG);
                return judges;
            }
        } catch (error) {
            logger.error(`judgesService :: listJudges :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
};
