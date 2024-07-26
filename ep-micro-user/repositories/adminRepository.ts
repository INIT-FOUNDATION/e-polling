import { logger, pg } from "ep-micro-common";
import { IUser } from "../types/custom";
import { QUERY } from "../constants";

export const adminRepository = {
    getLoggedInUserInfo: async (userId: number): Promise<IUser> => {
        try {
            const _query = {
                text: QUERY.USERS.getLoggedInUserInfo,
                values: [userId]
            };
            logger.debug(`adminService :: getLoggedInUserInfo :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminService :: getLoggedInUserInfo :: db result :: ${JSON.stringify(result)}`)

            return result.length > 0 ? result[0] : null;
        } catch (error) {
            logger.error(`adminRepository :: getLoggedInUserInfo :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateProfilePic: async (profilePictureUrl: string, userId: number) => {
        try {
            const _query = {
                text: QUERY.USERS.updateProfilePic,
                values: [userId, profilePictureUrl]
            };
            logger.debug(`adminRepository :: updateProfilePic :: query :: ${JSON.stringify(_query)}`);
        } catch (error) {
            logger.error(`adminRepository :: updateProfilePic :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateUser: async (user: IUser, userId: number) => {
        try {
            const _query = {
                text: QUERY.USERS.updateProfile,
                values: [userId, user.first_name, user.last_name, user.email_id, user.dob, `${user.first_name} ${user.last_name}`]
            };
            logger.debug(`adminService :: updateProfile :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminService :: updateProfile :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`adminRepository :: updateUser :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}