import { logger, redis, objectStorageUtility } from "ep-micro-common";
import { INomination } from "../types/custom";
import { nominationsRepository } from "../repositories";
import { CacheTTL, NominationStatus } from "../enums";
import { UploadedFile } from "express-fileupload";
import { OBJECT_STORAGE_BUCKET } from "../constants";

export const nominationsService = {
    createNomination: async (nomination: INomination, nomineeProfilePicture: UploadedFile) => {
        try {
            logger.info(`nominationsService :: createNomination :: ${JSON.stringify(nomination)}`);

            if (nomineeProfilePicture) {
                const objectStoragePath = `profile-pictures/nominees/profile_picture_${nomination.nomineeId}.${nomineeProfilePicture.mimetype.split("/")[1]}`;
                await objectStorageUtility.putObject(OBJECT_STORAGE_BUCKET, objectStoragePath, nomineeProfilePicture.data);
                nomination.profilePictureUrl = objectStoragePath;
            }

            await nominationsRepository.createNomination(nomination);
            redis.deleteRedis(`nominations|created_by:${nomination.createdBy}|page:0|limit:50`);
            redis.deleteRedis(`nominations|created_by:${nomination.createdBy}|count`);
        } catch (error) {
            logger.error(`nominationsService :: createNomination :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    updateNomination: async (nomination: INomination, nomineeProfilePicture: UploadedFile) => {
        try {
            logger.info(`nominationsService :: updateNomination :: ${JSON.stringify(nomination)}`);

            if (nomineeProfilePicture) {
                const objectStoragePath = `profile-pictures/nominees/profile_picture_${nomination.nomineeId}.${nomineeProfilePicture.mimetype.split("/")[1]}`;
                await objectStorageUtility.putObject(OBJECT_STORAGE_BUCKET, objectStoragePath, nomineeProfilePicture.data);
                nomination.profilePictureUrl = objectStoragePath;
            }

            await nominationsRepository.updateNomination(nomination);
            redis.deleteRedis(`nominations|created_by:${nomination.createdBy}|page:0|limit:50`);
            redis.deleteRedis(`nominations|created_by:${nomination.createdBy}|count`);
        } catch (error) {
            logger.error(`nominationsService :: updateNomination :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    getNomination: async (nomineeId: string) => {
        try {
            logger.info(`nominationsService :: getNomination :: ${nomineeId}`);
            const key = `nominee:${nomineeId}`;
            const cachedResult = await redis.getRedis(key);
            if (cachedResult) return JSON.parse(cachedResult);

            const nomination = await nominationsRepository.getNomination(nomineeId);
            if (nomination && nomination.profilePictureUrl) {
                const temporaryPublicURL = await objectStorageUtility.presignedGetObject(OBJECT_STORAGE_BUCKET, nomination.profilePictureUrl, CacheTTL.LONG);
                if (temporaryPublicURL) nomination.profilePictureUrl = temporaryPublicURL;
            }

            logger.debug(`nominationsService :: getNomination :: nomineeId :: ${nomineeId} :: ${JSON.stringify(nomination)}`);
            if (nomination) redis.setRedis(key, JSON.stringify(nomination), CacheTTL.LONG);
            return nomination;
        } catch (error) {
            logger.error(`nominationsService :: getNomination :: nomineeId :: ${nomineeId} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    listNominations: async (currentPage: number, pageSize: number, createdBy: number): Promise<INomination[]> => {
        try {
            const key = `nominations|created_by:${createdBy}|page:${currentPage}|limit:${pageSize}`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const nominations = await nominationsRepository.getNominations(currentPage, pageSize, createdBy);
            logger.debug(`nominationsService :: listNominations :: nominations :: ${JSON.stringify(nominations)}`);

            for (const nomination of nominations) {
                if (nomination.profilePictureUrl) {
                    const temporaryPublicURL = await objectStorageUtility.presignedGetObject(OBJECT_STORAGE_BUCKET, nomination.profilePictureUrl, CacheTTL.LONG);
                    if (temporaryPublicURL) nomination.profilePictureUrl = temporaryPublicURL;
                }
            }

            if (nominations && nominations.length > 0) {
                redis.setRedis(key, JSON.stringify(nominations), CacheTTL.LONG);
                return nominations;
            }
        } catch (error) {
            logger.error(`nominationsService :: listNominations :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    getNominationsCount: async (createdBy: number): Promise<number> => {
        try {
            const key = `nominations|created_by:${createdBy}|count`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return parseInt(cacheResult, 10);

            const count = await nominationsRepository.getNominationsCount(createdBy);
            if (count !== undefined) {
                redis.setRedis(key, count.toString(), CacheTTL.LONG);
            }
            return count;
        } catch (error) {
            logger.error(`nominationsService :: getNominationsCount :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    updateNominationStatus: async (nomineeId: string, status: NominationStatus, createdBy: number) => {
        try {
            logger.info(`nominationsService :: updateNominationStatus :: ${nomineeId} :: ${status}`);
            await nominationsRepository.updateNominationStatus(nomineeId, status);
            redis.deleteRedis(`nominations|created_by:${createdBy}|page:0|limit:50`);
            redis.deleteRedis(`nominations|created_by:${createdBy}|count`);
        } catch (error) {
            logger.error(`nominationsService :: updateNominationStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    existsByNomineeId: async (nomineeId: string): Promise<boolean> => {
        try {
            logger.info(`nominationsService :: existsByNomineeId :: nomineeId :: ${nomineeId}`);
            return await nominationsRepository.existsByNomineeId(nomineeId);
        } catch (error) {
            logger.error(`nominationsService :: existsByNomineeId :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
};
