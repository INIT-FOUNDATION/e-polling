import { logger, mongoDBRead } from "ep-micro-common";
import { JudgeStatus, MongoCollections } from "../enums";
import { IJudge } from "../types/custom";

export const judgesRepository = {
    getJudges: async (eventId: string): Promise<IJudge[]> => {
        try {
            logger.info(`judgesRepository :: getJudges :: eventId :: ${eventId}`);
            const query =  { status: { $ne: JudgeStatus.ACTIVE } }
            if (eventId) query["eventId"] = eventId

            const result = await mongoDBRead.filteredDocs(MongoCollections.EVENTS, query);
            logger.debug(`judgesRepository :: getJudges :: eventId :: ${eventId}  ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`judgesRepository :: getJudges :: eventId :: ${eventId} :: ${error.message} :: ${error}`);
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