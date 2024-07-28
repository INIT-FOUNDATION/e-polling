import { pg, logger } from "ep-micro-common";
import { QUERY } from "../constants";
import { IUser } from "../types/custom";
import { UserStatus } from "../enums";

export const usersRepository = {
    getUserById: async (userId: number): Promise<IUser> => {
        try {
            const _query = {
                text: QUERY.USERS.getUser,
                values: [userId]
            };
            logger.debug(`usersRepository :: getUserById :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`usersRepository :: getUserById :: db result :: ${JSON.stringify(result)}`);
            return result.length ? result[0] : null;
        } catch (error) {
            logger.error(`usersRepository :: getUserById :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
}