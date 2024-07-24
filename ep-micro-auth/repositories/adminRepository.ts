import { QUERY } from "../constants";
import { logger, pg } from "ep-micro-common";
import { adminService } from "../services";
import { IUser } from "../types/custom";
 
export const adminRepository = {
    getMaxInvalidLoginAttempts: async (): Promise<number> => {
        try {
            const _query = {
                text: QUERY.USERS.getMaxInvalidLoginAttempts
            };
            logger.debug(`adminRepository :: getMaxInvalidLoginAttempts :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminRepository :: getMaxInvalidLoginAttempts :: db result :: ${JSON.stringify(result)}`)

            if (result && result.length > 0) return result[0].maximum_invalid_attempts;
        } catch (error) {
            logger.error(`adminRepository :: getMaxInvalidLoginAttempts :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getInvalidLoginAttempts: async (user_name: string): Promise<number> => {
        try {
            const _query = {
                text: QUERY.USERS.getInvalidAttempts,
                values: [user_name]
            };
            logger.debug(`adminRepository :: getInvalidLoginAttempts :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminRepository :: getInvalidLoginAttempts :: db result :: ${JSON.stringify(result)}`)

            if (result && result.length > 0) return result[0].invalid_attempts;
        } catch (error) {
            logger.error(`adminRepository :: getInvalidLoginAttempts :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    incrementInvalidLoginAttempts: async (userName: string) => {
        try {
            const _query = {
                text: QUERY.USERS.incrementInvalidAttempts,
                values: [userName]
            };
            logger.debug(`adminRepository :: incrementInvalidLoginAttempts :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminRepository :: incrementInvalidLoginAttempts :: db result :: ${JSON.stringify(result)}`)
        } catch (error) {
            logger.error(`adminRepository :: incrementInvalidLoginAttempts :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    setUserInActive: async (userName: string) => {
        try {
            const _query = {
                text: QUERY.USERS.setUserInActive,
                values: [userName]
            };
            logger.debug(`adminRepository :: setUserInActive :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminRepository :: setUserInActive :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`adminRepository :: setUserInActive :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    getUserByUserName: async (userName: string): Promise<IUser> => {
        try {
            const _query = {
                text: QUERY.USERS.getUserByUsername,
                values: [userName]
            };
            logger.debug(`adminRepository :: getUserByUserName :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminRepository :: getUserByUserName :: db result :: ${JSON.stringify(result)}`);
            
            return result.length > 0 ? result[0] : null;
        } catch (error) {
            logger.error(`adminRepository :: getUserByUserName :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateUserLoginStatus: async (loginStatus: number, userName: string) => {
        try {
            const _query = {
                text: QUERY.USERS.updateUserLoggedInStatus,
                values: [userName, loginStatus]
            };
            logger.debug(`adminRepository :: updateUserLoginStatus :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminRepository :: updateUserLoginStatus :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`adminRepository :: updateUserLoginStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    resetPassword: async (newPassword: string, mobileNumber: number): Promise<boolean> => {
        try {
            const _query = {
                text: QUERY.USERS.resetPasswordQuery,
                values: [newPassword, mobileNumber]
            };
            logger.debug(`adminRepository :: resetPassword :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminRepository :: resetPassword :: db result :: ${JSON.stringify(result)}`);

            return true;
        } catch (error) {
            logger.error(`adminRepository :: resetPassword :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    existsByUsername: async (userName: string): Promise<boolean> => {
        try {
            const _query = {
                text: QUERY.USERS.existsByUserName,
                values: [userName]
            };
            logger.debug(`adminRepository :: existsByUsername :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminRepository :: existsByUsername :: db result :: ${JSON.stringify(result)}`)

            return (result && result.length > 0) ? result[0].exists : false;
        } catch (error) {
            logger.error(`adminRepository :: existsByUsername :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    existsByMobileNumber: async (mobileNumber: number): Promise<boolean> => {
        try {
            const _query = {
                text: QUERY.USERS.existsByMobileNumber,
                values: [mobileNumber]
            };
            logger.debug(`adminRepository :: existsByMobileNumber :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`adminRepository :: existsByMobileNumber :: db result :: ${JSON.stringify(result)}`)

            return (result && result.length > 0) ? result[0].exists : false;
        } catch (error) {
            logger.error(`adminRepository :: existsByMobileNumber :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
}