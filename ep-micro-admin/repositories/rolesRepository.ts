import { logger, pg } from "ep-micro-common";
import { IRole } from "../types/custom";
import { QUERY } from "../constants";

export const rolesRepository = {
    addRole: async (role: IRole) => {
        try {
            const _query = {
                text: QUERY.ROLES.addRole,
                values: [role.role_name, role.role_description, role.level, role.created_by, role.updated_by]
            };
            logger.debug(`rolesRepository :: addRole :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`rolesRepository :: addRole :: db result :: ${JSON.stringify(result)}`)
        } catch (error) {
            logger.error(`rolesRepository :: addRole :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    updateRole: async (role: IRole) => {
        try {
            const _query = {
                text: QUERY.ROLES.updateRole,
                values: [role.role_id, role.role_name, role.role_description, role.level, role.updated_by, role.status]
            };
            logger.debug(`rolesRepository :: updateRole :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`rolesRepository :: updateRole :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`rolesRepository :: updateRole :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    }
}