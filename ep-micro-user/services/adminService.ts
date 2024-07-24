import { pg, logger, redis, objectStorageUtility, envUtils } from "ep-micro-common";
import { IUser } from "../types/custom";
import { USERS } from "../constants/QUERY";
import { CACHE_TTL } from "../constants/CONST";
import { UploadedFile } from "express-fileupload";

export const adminService = {
    getLoggedInUserInfo: async (user_id: number): Promise<IUser> => {
        try {
            const key = `LOGGED_IN_USER_INFO|USER:${user_id}`;
            const cachedResult = await redis.GetKeyRedis(key);
            if (cachedResult) {
                return JSON.parse(cachedResult);
            }

            const _query = {
                text: USERS.getLoggedInUserInfo,
                values: [user_id]
            };
            logger.debug(`adminService :: getLoggedInUserInfo :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminService :: getLoggedInUserInfo :: db result :: ${JSON.stringify(result)}`)

            if (result.length > 0) {
                if (result[0].profile_pic_url) result[0].profile_pic_url = await adminService.generatePublicURLFromObjectStoragePrivateURL(result[0].profile_pic_url, 3600);
                redis.SetRedis(key, result[0], CACHE_TTL.LONG)
                return result[0]
            }
        } catch (error) {
            logger.error(`adminService :: getLoggedInUserInfo :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    generatePublicURLFromObjectStoragePrivateURL: async (locationPath: string, expiresIn: number = 3600): Promise<string> => {
        try {
            const bucketName = envUtils.getStringEnvVariableOrDefault("EP_OBJECT_STORAGE_BUCKET", "ep-dev");
            const temporaryPublicURL = await objectStorageUtility.presignedGetObject(bucketName, locationPath, expiresIn);
            return temporaryPublicURL;
        } catch (error) {
            logger.error(`adminService :: generatePublicURLFromObjectStoragePrivateURL :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    updateProfilePic: async (profilePicture: UploadedFile, userId: number) => {
        try {
            const key = `LOGGED_IN_USER_INFO|USER:${userId}`;
            const objectStoragePath = `profile-pictures/PROFILE_PICTURE_${userId}.${profilePicture.mimetype.split("/")[1]}`;
            const bucketName = envUtils.getStringEnvVariableOrDefault("EP_OBJECT_STORAGE_BUCKET", "ep-dev");
            await objectStorageUtility.putObject(bucketName, objectStoragePath, profilePicture.data);

            const _query = {
                text: USERS.updateProfilePic,
                values: [userId, objectStoragePath]
            };
            logger.debug(`adminService :: updateProfilePic :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminService :: updateProfilePic :: db result :: ${JSON.stringify(result)}`);

            redis.deleteRedis(key);
        } catch (error) {
            logger.error(`adminService :: updateProfilePic :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    updateProfile: async (user: IUser, userId: number) => {
        try {
            const key = `LOGGED_IN_USER_INFO|USER:${userId}`;
            const _query = {
                text: USERS.updateProfile,
                values: [userId, user.first_name, user.last_name, user.email_id, user.dob, `${user.first_name} ${user.last_name}`]
            };
            logger.debug(`adminService :: updateProfile :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminService :: updateProfile :: db result :: ${JSON.stringify(result)}`);

            redis.deleteRedis(key);
        } catch (error) {
            logger.error(`adminService :: updateProfile :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
}