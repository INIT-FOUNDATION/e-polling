import { logger, redis, objectStorageUtility } from "ep-micro-common";
import { IJudge } from "../types/custom";
import { judgesRepository } from "../repositories";
import { CacheTTL, JudgeStatus } from "../enums";
import { UploadedFile } from "express-fileupload";
import { OBJECT_STORAGE_BUCKET } from "../constants";

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

    listJudges: async (currentPage: number, pageSize: number, createdBy: number): Promise<IJudge[]> => {
        try {
            const key = `judges|created_by:${createdBy}|page:${currentPage}|limit:${pageSize}`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const judges = await judgesRepository.getJudges(currentPage, pageSize, createdBy);
            logger.debug(`judgesService :: listJudges :: judges :: ${JSON.stringify(judges)}`);

            for (const judge of judges) {
                if (judge.profilePictureUrl) {
                    const temporaryPublicURL = await objectStorageUtility.presignedGetObject(OBJECT_STORAGE_BUCKET, judge.profilePictureUrl, CacheTTL.LONG);
                    if (temporaryPublicURL) judge.profilePictureUrl = temporaryPublicURL;
                }
            }

            if (judges && judges.length > 0) {
                redis.setRedis(key, JSON.stringify(judges), CacheTTL.LONG);
                return judges;
            }
        } catch (error) {
            logger.error(`judgesService :: listJudges :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getJudgesCount: async (createdBy: number): Promise<number> => {
        try {
            const key = `judges|created_by:${createdBy}|count`;
            const cacheResult = await redis.getRedis(key);
            if (cacheResult) return JSON.parse(cacheResult);

            const count = await judgesRepository.getJudgesCount(createdBy);
            if (count > 0) redis.setRedis(key, JSON.stringify(count), CacheTTL.LONG);
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
            redis.deleteRedis(`judges|created_by:${createdBy}|page:0|limit:50`);
            redis.deleteRedis(`judges|created_by:${createdBy}|count`);
        } catch (error) {
            logger.error(`judgesService :: updateJudgeStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
};
