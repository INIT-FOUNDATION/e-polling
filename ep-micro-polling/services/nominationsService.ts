import { logger, redis, objectStorageUtility } from "ep-micro-common";
import { INomination } from "../types/custom";
import { nominationsRepository } from "../repositories";
import { CacheTTL, NominationStatus, NotificationTypes } from "../enums";
import { OBJECT_STORAGE_BUCKET, WEBSITE_URL } from "../constants";
import { UploadedFile } from "express-fileupload";
import { notificationsService } from ".";
import { eventsService } from "./eventsService";
import { emailService } from "./emailService";
import moment from "moment";

export const nominationsService = {
    listNominationsByEvent: async (eventId: string): Promise<INomination[]> => {
        try {
            const key = `nominations|approved|event:${eventId}`;

            const cacheResult = await redis.GetKeyRedis(key);
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
    },
    getNomination: async (nomineeId: string): Promise<INomination> => {
        try {
            logger.info(`nominationsService :: getNomination :: ${nomineeId}`);
            const key = `nominee:${nomineeId}`;
            const cachedResult = await redis.GetKeyRedis(key);
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
    createNomination: async (nomination: INomination, nomineeProfilePicture: UploadedFile) => {
        try {
            logger.info(`nominationsService :: createNomination :: ${JSON.stringify(nomination)}`);

            if (nomineeProfilePicture) {
                const objectStoragePath = `profile-pictures/nominees/profile_picture_${nomination.nomineeId}.${nomineeProfilePicture.mimetype.split("/")[1]}`;
                await objectStorageUtility.putObject(OBJECT_STORAGE_BUCKET, objectStoragePath, nomineeProfilePicture.data);
                nomination.profilePictureUrl = objectStoragePath;
            }

            const event = await eventsService.getEvent(nomination.eventId);

            await nominationsRepository.createNomination(nomination);
            await notificationsService.createNotification(NotificationTypes.NOMINATION, `${nomination.nomineeName} has requested for the nomination of ${event.eventName}`, event.createdBy);

            if (nomination.requesterEmail) {
                await emailService.sendEmail('E-POLLING | THANK YOU FOR NOMINATION', 'views/nominationRequestAcknowledgmentTemplate.ejs', nomination.requesterEmail, {
                    name: nomination.selfNominee ? nomination.requesterName : nomination.nomineeName,
                    websiteUrl: WEBSITE_URL,
                    year: moment().year(),
                    eventName: event.eventName
                });
            }

            for (const status of Object.values(NominationStatus)) {
                await redis.deleteRedis(`nominations|created_by:${nomination.createdBy}|status:${status}|page:0|limit:50`);
                await redis.deleteRedis(`nominations|created_by:${nomination.createdBy}|status:${status}|count`);
                await redis.deleteRedis(`nominations|created_by:${nomination.createdBy}|status:${status}|event_id:${nomination.eventId}|page:0|limit:50`);
                await redis.deleteRedis(`nominations|created_by:${nomination.createdBy}|status:${status}|event_id:${nomination.eventId}|count`);
                await redis.deleteRedis(`nominations|event_id:${nomination.eventId}`);
                await redis.deleteRedis(`nominations|approved|event_id:${nomination.eventId}`)
            }
        } catch (error) {
            logger.error(`nominationsService :: createNomination :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
};
