import { logger, redis, objectStorageUtility } from "ep-micro-common";
import { INomination } from "../types/custom";
import { nominationsRepository } from "../repositories";
import { CacheTTL } from "../enums";
import { OBJECT_STORAGE_BUCKET } from "../constants";

export const nominationsService = {
    listNominationsByEvent: async (eventId: string): Promise<INomination[]> => {
        try {
            const key = `nominations|approved|event:${eventId}`;

            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const nominations = await nominationsRepository.getNominationsByEvent(eventId);
            logger.debug(`nominationsService :: listNominations :: nominations :: ${JSON.stringify(nominations)}`);

            for (const nomination of nominations) {
                if (nomination.profilePictureUrl) {
                    const temporaryPublicURL = await objectStorageUtility.presignedGetObject(OBJECT_STORAGE_BUCKET, nomination.profilePictureUrl, CacheTTL.LONG);
                    if (temporaryPublicURL) nomination.profilePictureUrl = temporaryPublicURL;
                }
            }

            if (nominations && nominations.length > 0) {
                redis.SetRedis(key, nominations, CacheTTL.LONG);
                return nominations;
            }
        } catch (error) {
            logger.error(`nominationsService :: listNominations :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
};
