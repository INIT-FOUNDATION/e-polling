import { pg, logger } from "ep-micro-common";
import { QUERY } from "../constants";
import { IUser } from "../types/custom";
import { UserStatus } from "../enums";

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
    createUser: async (user: IUser) => {
        try {
            const _query = {
                text: QUERY.USERS.createUser,
                values: [user.user_name,
                user.first_name,
                user.last_name,
                user.display_name,
                user.dob,
                user.gender,
                user.mobile_number,
                user.password,
                user.role_id,
                user.email_id,
                user.created_by,
                user.updated_by
                ]
            };
            logger.debug(`usersService :: createUser :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`usersService :: createUser :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`usersRepository :: createUser :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    updateUser: async (user: IUser) => {
        try {
            const _query = {
                text: QUERY.USERS.updateUser,
                values: [user.user_id, user.first_name, user.last_name,
                user.dob, user.gender,
                user.email_id, user.updated_by, user.role_id, user.status, `${user.first_name} ${user.last_name}`
                ]
            };
            logger.debug(`usersService :: updateUser :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`usersService :: updateUser :: db result :: ${JSON.stringify(result)}`)
        } catch (error) {
            logger.error(`usersRepository :: updateUser :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
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
    getUsersByRoleId: async (roleId: number): Promise<IUser[]> => {
        try {
            const _query = {
                text: QUERY.USERS.getUsersByRoleId,
                values: [roleId]
            };
            logger.debug(`usersRepository :: getUsersByRoleId :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`usersRepository :: getUsersByRoleId :: db result :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`usersRepository :: getUsersByRoleId :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    resetPasswordForUserId: async (newPassword: string, userId: number) => {
        try {
            const _query = {
                text: QUERY.USERS.resetPasswordForUserId,
                values: [userId, newPassword]
            };
            logger.debug(`usersRepository :: resetPasswordForUserId :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`usersRepository :: resetPasswordForUserId :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`usersRepository :: resetPasswordForUserId :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    },
    updateUserStatus: async (user: IUser, status: UserStatus, updatedBy: number) => {
        try {
            const _query = {
                text: QUERY.USERS.updateUserStatus,
                values: [user.user_id, status, updatedBy]
            };
            logger.debug(`usersRepository :: updateUserStatus :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`usersRepository :: updateUserStatus :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`usersRepository :: updateUserStatus :: ${error.message} :: ${error}`);
            throw new Error(error.message);
        }
    }
}