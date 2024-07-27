import { logger, redis, objectStorageUtility } from "ep-micro-common";
import { INomination } from "../types/custom";
import { nominationsRepository } from "../repositories";
import { CacheTTL, NominationStatus } from "../enums";
import { UploadedFile } from "express-fileupload";
import { OBJECT_STORAGE_BUCKET } from "../constants";
import { eventsService } from "./eventsService";
import { categoriesService } from "./categoriesService";

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

            for (const status of Object.values(NominationStatus)) {
                redis.deleteRedis(`nominations|created_by:${nomination.createdBy}|status:${status}|page:0|limit:50`);
                redis.deleteRedis(`nominations|created_by:${nomination.createdBy}|status:${status}|count`);
                redis.deleteRedis(`nominations|created_by:${nomination.createdBy}|status:${status}|event_id:${nomination.eventId}|page:0|limit:50`);
                redis.deleteRedis(`nominations|created_by:${nomination.createdBy}|status:${status}|event_id:${nomination.eventId}|count`);
                redis.deleteRedis(`nominations|event_id:${nomination.eventId}`);
            }
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
            for (const status of Object.values(NominationStatus)) {
                redis.deleteRedis(`nominations|created_by:${nomination.createdBy}|status:${status}|page:0|limit:50`);
                redis.deleteRedis(`nominations|created_by:${nomination.createdBy}|status:${status}|count`);
                redis.deleteRedis(`nominations|created_by:${nomination.createdBy}|status:${status}|event_id:${nomination.eventId}|page:0|limit:50`);
                redis.deleteRedis(`nominations|created_by:${nomination.createdBy}|status:${status}|event_id:${nomination.eventId}|count`);
                redis.deleteRedis(`nominee:${nomination.nomineeId}`);
                redis.deleteRedis(`nominations|event_id:${nomination.eventId}`);
            }
        } catch (error) {
            logger.error(`nominationsService :: updateNomination :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getNomination: async (nomineeId: string): Promise<INomination> => {
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
            if (nomination) redis.SetRedis(key, nomination, CacheTTL.LONG);
            return nomination;
        } catch (error) {
            logger.error(`nominationsService :: getNomination :: nomineeId :: ${nomineeId} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    listNominations: async (currentPage: number, pageSize: number, createdBy: number, status: NominationStatus, eventId: string): Promise<INomination[]> => {
        try {
            currentPage = currentPage > 1 ? (currentPage - 1) * pageSize : 0;
            let key = `nominations|created_by:${createdBy}|status:${status}|page:${currentPage}|limit:${pageSize}`;
            if (eventId) key = `nominations|created_by:${createdBy}|status:${status}|event_id:${eventId}|page:${currentPage}|limit:${pageSize}`;

            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const nominations = await nominationsRepository.getNominations(currentPage, pageSize, createdBy, status, eventId);
            logger.debug(`nominationsService :: listNominations :: nominations :: ${JSON.stringify(nominations)}`);

            for (const nomination of nominations) {
                if (nomination.profilePictureUrl) {
                    const temporaryPublicURL = await objectStorageUtility.presignedGetObject(OBJECT_STORAGE_BUCKET, nomination.profilePictureUrl, CacheTTL.LONG);
                    if (temporaryPublicURL) nomination.profilePictureUrl = temporaryPublicURL;

                    if (nomination && nomination.eventId) {
                        const event = await eventsService.getEvent(nomination.eventId);
                        if (event && event.eventName) nomination["eventName"] = event.eventName;

                        const category = await categoriesService.getCategoryById(event.categoryId);
                        if (category && category.category_name) nomination["categoryName"] = category.category_name;
                    }
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
    },
    getNominationsCount: async (createdBy: number, status: NominationStatus, eventId: string): Promise<number> => {
        try {
            let key = `nominations|created_by:${createdBy}|status:${status}|count`;
            if (eventId) key = `nominations|created_by:${createdBy}|status:${status}|event_id:${eventId}|count`;

            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return parseInt(cacheResult, 10);

            const count = await nominationsRepository.getNominationsCount(createdBy, status, eventId);
            if (count > 0) {
                redis.SetRedis(key, count, CacheTTL.LONG);
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
            const nomination = await nominationsService.getNomination(nomineeId);

            for (const status of Object.values(NominationStatus)) {
                redis.deleteRedis(`nominations|created_by:${createdBy}|status:${status}|page:0|limit:50`);
                redis.deleteRedis(`nominations|created_by:${createdBy}|status:${status}|count`);
                redis.deleteRedis(`nominations|created_by:${createdBy}|status:${status}|event_id:${nomination.eventId}|page:0|limit:50`);
                redis.deleteRedis(`nominations|created_by:${createdBy}|status:${status}|event_id:${nomination.eventId}|count`);
                redis.deleteRedis(`nominee:${nomineeId}`);
                redis.deleteRedis(`nominations|event_id:${nomination.eventId}`);
            }
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
    getNominationsByEventId: async (eventId: string): Promise<INomination[]> => {
        try {
            const key = `nominations|event_id:${eventId}`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            logger.info(`nominationsService :: getNominationsByEventId :: eventId :: ${eventId}`);

            const nominations = await nominationsRepository.getNominationsByEventId(eventId);
            if (nominations && nominations.length > 0) redis.SetRedis(key, nominations, CacheTTL.LONG);
            return nominations;
        } catch (error) {
            logger.error(`nominationsService :: getNominationsByEventId :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
};
