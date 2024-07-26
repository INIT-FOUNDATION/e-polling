import { pg, logger } from "ep-micro-common";
import { QUERY } from "../constants";

export const usersRepository = {
    usersUpdatedWithinFiveMints: async (): Promise<boolean> => {
        try {
            logger.info("usersRepository :: Inside usersUpdatedWithinFiveMints");

            const _queryToCheckLatestUpdated = {
                text: QUERY.USERS.latestUpdatedCheck
            };

            logger.debug(`usersRepository :: latestUpdated :: query :: ${JSON.stringify(_queryToCheckLatestUpdated)}`)
            const latestUpdatedInForm = await pg.executeQueryPromise(_queryToCheckLatestUpdated);
            const isUserUpdatedWithin5mins = (latestUpdatedInForm[0].count > 0);
            logger.info(`usersRepository :: latestUpdated :: result :: ${JSON.stringify(latestUpdatedInForm)} :: isUserUpdatedWithin5mins :: ${isUserUpdatedWithin5mins}`);

            return isUserUpdatedWithin5mins;
        } catch (error) {
            logger.error(`usersRepository :: usersUpdatedWithinFiveMints :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    existsByMobileNumber: async (mobileNumber: number): Promise<boolean> => {
        try {
            const _query = {
                text: QUERY.USERS.existsByMobileNumber,
                values: [mobileNumber]
            };
            logger.debug(`usersRepository :: existsByMobileNumber :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`usersRepository :: existsByMobileNumber :: db result :: ${JSON.stringify(result)}`)

            return (result && result.length > 0) ? result[0].exists : false;
        } catch (error) {
            logger.error(`usersRepository :: existsByMobileNumber :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    existsByUserId: async (userId: number): Promise<boolean> => {
        try {
            const _query = {
                text: QUERY.USERS.existsByUserId,
                values: [userId]
            };
            logger.debug(`usersRepository :: existsByUserId :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`usersRepository :: existsByUserId :: db result :: ${JSON.stringify(result)}`)

            return (result && result.length > 0) ? result[0].exists : false;
        } catch (error) {
            logger.error(`usersRepository :: existsByUserId :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
}