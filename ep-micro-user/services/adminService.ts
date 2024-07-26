import { logger, redis, objectStorageUtility, envUtils } from "ep-micro-common";
import { IUser } from "../types/custom";
import { UploadedFile } from "express-fileupload";
import { CacheTTL } from "../enums/cacheTTL";
import { adminRepository } from "../repositories";

export const adminService = {
    getLoggedInUserInfo: async (user_id: number): Promise<IUser> => {
        try {
            const key = `loggedin_user_info:${user_id}`;
            const cachedResult = await redis.GetKeyRedis(key);
            if (cachedResult) {
                return JSON.parse(cachedResult);
            }

            const user = await adminRepository.getLoggedInUserInfo(user_id);
            logger.debug(`adminService :: getLoggedInUserInfo :: user :: ${JSON.stringify(user)}`);

            if (user) {
                if (user.profile_pic_url) user.profile_pic_url = await adminService.generatePublicURLFromObjectStoragePrivateURL(user.profile_pic_url, 3600);
                redis.SetRedis(key, user, CacheTTL.LONG)
                return user
            };
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
            const key = `loggedin_user_info:${userId}`;
            const objectStoragePath = `profile-pictures/PROFILE_PICTURE_${userId}.${profilePicture.mimetype.split("/")[1]}`;
            const bucketName = envUtils.getStringEnvVariableOrDefault("EP_OBJECT_STORAGE_BUCKET", "ep-dev");
            await objectStorageUtility.putObject(bucketName, objectStoragePath, profilePicture.data);

            await adminRepository.updateProfilePic(objectStoragePath, userId);
            redis.deleteRedis(key);
        } catch (error) {
            logger.error(`adminService :: updateProfilePic :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    updateProfile: async (user: IUser, userId: number) => {
        try {
            const key = `loggedin_user_info:${userId}`;
            await adminRepository.updateUser(user, userId);
            redis.deleteRedis(key);
        } catch (error) {
            logger.error(`adminService :: updateProfile :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
}