import { logger, pg } from "ep-micro-common";
import { IRole } from "../types/custom";
import { QUERY } from "../constants";
import { RoleStatus } from "../enums";

export const rolesRepository = {
    addRole: async (role: IRole): Promise<IRole[]> => {
        try {
            const _query = {
                text: QUERY.ROLES.addRole,
                values: [role.role_name, role.role_description, role.created_by, role.updated_by]
            };
            logger.debug(`rolesRepository :: addRole :: query :: ${JSON.stringify(_query)}`)

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`rolesRepository :: addRole :: db result :: ${JSON.stringify(result)}`)
            return result;
        } catch (error) {
            logger.error(`rolesRepository :: addRole :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    updateRole: async (role: IRole) => {
        try {
            const _query = {
                text: QUERY.ROLES.updateRole,
                values: [role.role_id, role.role_name, role.role_description, role.updated_by, role.status]
            };
            logger.debug(`rolesRepository :: updateRole :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`rolesRepository :: updateRole :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`rolesRepository :: updateRole :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    updateRoleStatus: async (roleId: number, status: RoleStatus, updatedBy: number) => {
        try {
            const _query = {
                text: QUERY.ROLES.updateRoleStatus,
                values: [roleId, status, updatedBy]
            };
            logger.debug(`rolesRepository :: updateRoleStatus :: query :: ${JSON.stringify(_query)}`);

            const result = await pg.executeQueryPromise(_query);
            logger.debug(`rolesRepository :: updateRoleStatus :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`rolesRepository :: updateRoleStatus :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    getAccessListByRoleId: async (roleId: number): Promise<any> => {
        try {
            const _query = {
                text: QUERY.ROLES.getAccessListByRoleId,
                values: [roleId]
            };
            logger.debug(`rolesRepository :: getAccessListByRoleId :: query :: ${JSON.stringify(_query)}`);
            const result = await pg.executeQueryPromise(_query);
            logger.debug(`rolesRepository :: getAccessListByRoleId :: db result :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`rolesRepository :: getAccessListByRoleId :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    getMenusList: async (isActive: boolean): Promise<any> => {
        try {
          const _query = {
            text: QUERY.ROLES.getMenusList + ` ${isActive ? 'WHERE status = 1 ORDER BY menu_order ASC' : 'ORDER BY menu_order ASC'}`
          };
    
          logger.debug(`rolesRepository :: getMenusList :: query :: ${JSON.stringify(_query)}`)
    
          const result = await pg.executeQueryPromise(_query);
          logger.debug(`rolesRepository :: getMenusList :: db result :: ${JSON.stringify(result)}`)
    
          return result;
        } catch (error) {
          logger.error(`rolesRepository :: getMenusList :: ${error.message} :: ${error}`)
          throw new Error(error.message);
        }
      },
    getDefaultAccessList: async (): Promise<any> => {
        try {
            const _query = {
                text: QUERY.ROLES.getDefaultAccessList
            };
            logger.debug(`rolesRepository :: getDefaultAccessList :: query :: ${JSON.stringify(_query)}`);
            const result = await pg.executeQueryPromise(_query);
            logger.debug(`rolesRepository :: getDefaultAccessList :: db result :: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`rolesRepository :: getDefaultAccessList :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    existsByRoleId: async (roleId: number): Promise<boolean> => {
        try {
          const _query = {
            text: QUERY.ROLES.existsByRoleId,
            values: [roleId]
          };
          logger.debug(`rolesRepository :: existsByRoleId :: query :: ${JSON.stringify(_query)}`)
    
          const result = await pg.executeQueryPromise(_query);
          logger.debug(`rolesRepository :: existsByRoleId :: db result :: ${JSON.stringify(result)}`)
    
          return (result && result.length > 0) ? result[0].exists : false;
        } catch (error) {
          logger.error(`rolesRepository :: existsByRoleId :: ${error.message} :: ${error}`)
          throw new Error(error.message);
        }
      },
      existsByRoleName: async (roleName: string, roleId: number | undefined): Promise<boolean> => {
        try {
          const _query = {
            text: QUERY.ROLES.existsByRoleName,
            values: [roleName]
          };
          if (roleId) _query.text = _query.text.replace(`status = 1`, `status = 1 AND role_id <> ${roleId}`);
          logger.debug(`rolesRepository :: existsByRoleName :: query :: ${JSON.stringify(_query)}`)
    
          const result = await pg.executeQueryPromise(_query);
          logger.debug(`rolesRepository :: existsByRoleName :: db result :: ${JSON.stringify(result)}`)
    
          return (result && result.length > 0) ? result[0].exists : false;
        } catch (error) {
          logger.error(`rolesRepository :: existsByRoleName :: ${error.message} :: ${error}`)
          throw new Error(error.message);
        }
      },
    deleteExistingPermissions: async (roleId: number) => {
        try {
            const _query = {
                text: QUERY.ROLES.deleteExistingPermissions,
                values: [roleId]
            };
            logger.debug(`rolesRepository :: deleteExistingPermissions :: query :: ${JSON.stringify(_query)}`);
            const result = await pg.executeQueryPromise(_query);
            logger.debug(`rolesRepository :: deleteExistingPermissions :: db result :: ${JSON.stringify(result)}`);
        } catch (error) {
            logger.error(`rolesRepository :: deleteExistingPermissions :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    },
    addPermissions: async (roleId: number, menu_id: number, permission_id: number, updated_by: number) => {
        try {
          const _query = {
            text: QUERY.ROLES.addPermissions,
            values: [roleId, menu_id, permission_id, updated_by]
          };
          logger.debug(`rolesRepository :: addPermissions :: query :: ${JSON.stringify(_query)}`)
    
          const result = await pg.executeQueryPromise(_query);
          logger.debug(`rolesRepository :: addPermissions :: db result :: ${JSON.stringify(result)}`)
        } catch (error) {
          logger.error(`rolesRepository :: addPermissions :: ${error.message} :: ${error}`)
          throw new Error(error.message);
        }
    },
    getRole: async (roleId: number): Promise<IRole> => {
        try {
            const _query = {
                text: QUERY.ROLES.getRole,
                values: [roleId]
            };
            logger.debug(`rolesRepository :: getRole :: query :: ${JSON.stringify(_query)}`);
            const result = await pg.executeQueryPromise(_query);
            logger.debug(`rolesRepository :: getRole :: db result :: ${JSON.stringify(result)}`);
            return result.length ? result[0] : null;
        } catch (error) {
            logger.error(`rolesRepository :: getRole :: ${error.message} :: ${error}`)
            throw new Error(error.message);
        }
    }
}