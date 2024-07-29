import { logger, redis, objectStorageUtility } from "ep-micro-common";
import { IJudge } from "../types/custom";
import { judgesRepository } from "../repositories";
import { CacheTTL, JudgeStatus } from "../enums";
import { UploadedFile } from "express-fileupload";
import { OBJECT_STORAGE_BUCKET } from "../constants";
import { eventsService } from "./eventsService";
import { categoriesService } from "./categoriesService";

export const judgesService = {
    createJudge: async (judge: IJudge, judgeProfilePicture: UploadedFile) => {
        try {
            logger.info(`judgesService :: createJudge :: ${JSON.stringify(judge)}`);

            if (judgeProfilePicture) {
                const objectStoragePath = `profile-pictures/judges/profile_picture_${judge.judgeId}.${judgeProfilePicture.mimetype.split("/")[1]}`;
                await objectStorageUtility.putObject(OBJECT_STORAGE_BUCKET, objectStoragePath, judgeProfilePicture.data);
                judge.profilePictureUrl = objectStoragePath;
            }

            await judgesRepository.createJudge(judge);
            redis.deleteRedis(`judges|created_by:${judge.createdBy}|page:0|limit:50`);
            redis.deleteRedis(`judges|created_by:${judge.createdBy}|count`);
            redis.deleteRedis(`judges|created_by:${judge.createdBy}|event_id:${judge.eventId}|page:0|limit:50`);
            redis.deleteRedis(`judges|created_by:${judge.createdBy}|event_id:${judge.eventId}|count`);
            redis.deleteRedis(`judges|active|event_id:${judge.eventId}`);
        } catch (error) {
            logger.error(`judgesService :: createJudge :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    updateJudge: async (judge: IJudge, judgeProfilePicture: UploadedFile) => {
        try {
            logger.info(`judgesService :: updateJudge :: ${JSON.stringify(judge)}`);

            if (judgeProfilePicture) {
                const objectStoragePath = `profile-pictures/judges/profile_picture_${judge.judgeId}.${judgeProfilePicture.mimetype.split("/")[1]}`;
                await objectStorageUtility.putObject(OBJECT_STORAGE_BUCKET, objectStoragePath, judgeProfilePicture.data);
                judge.profilePictureUrl = objectStoragePath;
            }

            await judgesRepository.updateJudge(judge);
            redis.deleteRedis(`judges|created_by:${judge.createdBy}|page:0|limit:50`);
            redis.deleteRedis(`judges|created_by:${judge.createdBy}|count`);
            redis.deleteRedis(`judges|created_by:${judge.createdBy}|event_id:${judge.eventId}|page:0|limit:50`);
            redis.deleteRedis(`judges|created_by:${judge.createdBy}|event_id:${judge.eventId}|count`);
            redis.deleteRedis(`judges|active|event_id:${judge.eventId}`);
        } catch (error) {
            logger.error(`judgesService :: updateJudge :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    getJudge: async (judgeId: string) => {
        try {
            logger.info(`judgesService :: getJudge :: ${judgeId}`);
            const key = `judge:${judgeId}`;
            const cachedResult = await redis.GetKeyRedis(key);
            if (cachedResult) return JSON.parse(cachedResult);

            const judge = await judgesRepository.getJudge(judgeId);
            if (judge && judge.profilePictureUrl) {
                const temporaryPublicURL = await objectStorageUtility.presignedGetObject(OBJECT_STORAGE_BUCKET, judge.profilePictureUrl, CacheTTL.LONG);
                if (temporaryPublicURL) judge.profilePictureUrl = temporaryPublicURL;
            }

            logger.debug(`judgesService :: getJudge :: judgeId :: ${judgeId} :: ${JSON.stringify(judge)}`);
            if (judge) redis.SetRedis(key, judge, CacheTTL.LONG);
            return judge;
        } catch (error) {
            logger.error(`judgesService :: getJudge :: judgeId :: ${judgeId} :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },

    listJudges: async (currentPage: number, pageSize: number, createdBy: number, eventId: string): Promise<IJudge[]> => {
        try {
            currentPage = currentPage > 1 ? (currentPage - 1) * pageSize : 0;
            let key = `judges|created_by:${createdBy}|page:${currentPage}|limit:${pageSize}`;
            if (eventId) key = `judges|created_by:${createdBy}|event_id:${eventId}|page:${currentPage}|limit:${pageSize}`;

            const cacheResult = await redis.GetKeyRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const judges = await judgesRepository.getJudges(currentPage, pageSize, createdBy, eventId);
            logger.debug(`judgesService :: listJudges :: judges :: ${JSON.stringify(judges)}`);

            for (const judge of judges) {
                if (judge.profilePictureUrl) {
                    const temporaryPublicURL = await objectStorageUtility.presignedGetObject(OBJECT_STORAGE_BUCKET, judge.profilePictureUrl, CacheTTL.LONG);
                    if (temporaryPublicURL) judge.profilePictureUrl = temporaryPublicURL;

                    if (judge && judge.eventId) {
                        const event = await eventsService.getEvent(judge.eventId);
                        if (event) judge["eventName"] = event.eventName;

                        if (event && event.categoryId) {
                            const category = await categoriesService.getCategoryById(event.categoryId);
                            if (category) judge["categoryName"] = category.category_name;
                        }
                    }
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
    },
    getJudgesCount: async (createdBy: number, eventId: string): Promise<number> => {
        try {
            let key = `judges|created_by:${createdBy}|count`;
            if (eventId) key = `judges|created_by:${createdBy}|event_id:${eventId}|count`;

            const cacheResult = await redis.GetKeyRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const count = await judgesRepository.getJudgesCount(createdBy, eventId);
            if (count > 0) redis.SetRedis(key, count, CacheTTL.LONG);
            return count;
        } catch (error) {
            logger.error(`judgesService :: getJudgesCount :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateJudgeStatus: async (judgeId: string, status: JudgeStatus, createdBy: number) => {
        try {
            logger.info(`judgesService :: updateJudgeStatus :: ${judgeId} :: ${status}`);
            await judgesRepository.updateJudgeStatus(judgeId, status);
            const judge = await judgesService.getJudge(judgeId);

            redis.deleteRedis(`judges|created_by:${createdBy}|page:0|limit:50`);
            redis.deleteRedis(`judges|created_by:${createdBy}|count`);
            redis.deleteRedis(`judges|created_by:${createdBy}|event_id:${judge.eventId}|page:0|limit:50`);
            redis.deleteRedis(`judges|created_by:${createdBy}|event_id:${judge.eventId}|count`);
            redis.deleteRedis(`judges|active|event_id:${judge.eventId}`);
        } catch (error) {
            logger.error(`judgesService :: updateJudgeStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
};
