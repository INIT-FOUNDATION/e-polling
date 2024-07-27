import { logger, mongoDB, mongoDBRead } from "ep-micro-common";
import { JudgeStatus, MongoCollections } from "../enums";
import { IJudge } from "../types/custom";

export const judgesRepository = {
    createJudge: async (judge: IJudge) => {
        try {
            logger.info(`judgesRepository :: createJudge :: ${JSON.stringify(judge)}`);
            await mongoDB.insertOne(MongoCollections.EVENTS, judge);
        } catch (error) {
            logger.error(`judgesRepository :: createJudge :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateJudge: async (judge: IJudge) => {
        try {
            logger.info(`judgesRepository :: updateJudge :: ${JSON.stringify(judge)}`);
            await mongoDB.updateOne(MongoCollections.EVENTS, { judgeId: judge.judgeId }, judge);
        } catch (error) {
            logger.error(`judgesRepository :: updateJudge :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getJudge: async (judgeId: string): Promise<IJudge> => {
        try {
            logger.info(`judgesRepository :: getJudge :: ${judgeId}`);
            const result = await mongoDBRead.findOne(MongoCollections.EVENTS, { judgeId, status: { $ne: JudgeStatus.DELETED } });
            logger.debug(`judgesRepository :: getJudge :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`judgesRepository :: getJudge :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getJudges: async (currentPage: number, pageSize: number, createdBy: number): Promise<IJudge[]> => {
        try {
            logger.info(`judgesRepository :: getJudges :: currentPage :: ${currentPage} :: pageSize :: ${pageSize}`);
            const result = await mongoDBRead.findWithLimit(MongoCollections.EVENTS, { createdBy, status: { $ne: JudgeStatus.DELETED } }, {
                _id: 0
            },
            pageSize,
            {
                dateCreated: -1,
            },
            currentPage);
            logger.debug(`judgesRepository :: getJudges :: currentPage :: ${currentPage} :: pageSize :: ${pageSize} :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`judgesRepository.getJudges: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getJudgesCount: async (createdBy: number): Promise<number> => {
        try {
            logger.info(`judgesRepository :: getJudgesCount`);
            const count = await mongoDBRead.count(MongoCollections.EVENTS, { createdBy, status: { $ne: JudgeStatus.DELETED } });
            return count;
        } catch (error) {
            logger.error(`judgesRepository :: getJudgesCount :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateJudgeStatus: async (judgeId: string, status: JudgeStatus) => {
        try {
            logger.info(`judgesRepository.updateJudgeStatus: ${judgeId} :: ${status}`);
            await mongoDB.updateOne(MongoCollections.EVENTS, { judgeId }, { status, dateUpdated: new Date().toISOString() });
        } catch (error) {
            logger.error(`judgesRepository.updateJudgeStatus: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    existsByJudgeId: async (judgeId: string): Promise<boolean> => {
        try {
            logger.info(`judgesRepository :: existsByJudgeId :: judgeId :: ${judgeId}`);
            const exists = await mongoDBRead.isExist(MongoCollections.EVENTS, { judgeId, status: { $ne: JudgeStatus.DELETED } });
            logger.debug(`judgesRepository :: existsByJudgeId :: judgeId :: ${judgeId} :: exists :: ${exists}`);
            return exists;
        } catch (error) {
            logger.error(`judgesRepository :: existsByJudgeId :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
}