import { OBJECT_STORAGE_BUCKET } from "../constants";
import { CacheTTL } from "../enums";
import { usersRepository } from "../repositories/usersRepository";
import { IUser } from "../types/custom";
import { logger, redis, objectStorageUtility } from "ep-micro-common";

export const usersService = {
    getUserById: async (userId: number): Promise<IUser> => {
        try {
            const key = `USER:${userId}`
            const cachedResult = await redis.GetKeyRedis(key);
            if (cachedResult) {
                logger.debug(`usersService :: getUserById :: userId :: ${userId} :: cached result :: ${cachedResult}`)
                return JSON.parse(cachedResult)
            }

            const user = await usersRepository.getUserById(userId);

            if (user) {
                if (user.profile_pic_url) {
                    const temporaryPublicURL = await objectStorageUtility.presignedGetObject(OBJECT_STORAGE_BUCKET, user.profile_pic_url, CacheTTL.LONG);
                    user.profile_pic_url = temporaryPublicURL;
                }
                redis.SetRedis(key, user, CacheTTL.LONG)
                return user;
            }
        } catch (error) {
            logger.error(`usersService :: getUserById :: userId :: ${userId} :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
}