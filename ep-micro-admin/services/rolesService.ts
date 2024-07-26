import { pg, logger, redis } from "ep-micro-common";
import { ROLES } from "../constants/QUERY";
import { IRole } from "../types/custom";
import { CacheTTL } from "../enums";

export const rolesService = {
  listRoles: async (isActive: boolean, pageSize: number, currentPage: number): Promise<IRole[]> => {
    try {
      let key = `roles`;
      let whereQuery = `WHERE`;

      if (isActive) {
        key += '|active';
        whereQuery += ' status = 1 AND role_id <> 1'
      } else {
        whereQuery += ' status IN (0,1) AND role_id <> 1'
      }

      if (pageSize) {
        key += `|limit:${pageSize}`
        whereQuery += ` LIMIT ${pageSize}`
      }

      if (currentPage) {
        key += `|offset:${currentPage}`
        whereQuery += ` OFFSET ${currentPage}`
      }

      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`rolesService :: listRoles :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const _query = {
        text: ROLES.listRoles + ` ${whereQuery}`
      };
      logger.debug(`rolesService :: listRoles :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: listRoles :: db result :: ${JSON.stringify(result)}`)

      if (result && result.length > 0) redis.SetRedis(key, result, CacheTTL.LONG);
      return result;
    } catch (error) {
      logger.error(`rolesService :: listRoles :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  listRolesCount: async (isActive: boolean): Promise<number> => {
    try {
      let key = `roles|count`;
      let whereQuery = `WHERE`;

      if (isActive) {
        key += '|ACTIVE';
        whereQuery += ' status = 1 AND role_id <> 1'
      } else {
        whereQuery += ' status IN (0,1) AND role_id <> 1'
      }

      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`rolesService :: listRolesCount :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const _query = {
        text: ROLES.listRolesCount + ` ${whereQuery}`
      };
      logger.debug(`rolesService :: listRolesCount :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: listRolesCount :: db result :: ${JSON.stringify(result)}`)

      if (result.length > 0) {
        const count = parseInt(result[0].count);
        if (count > 0) redis.SetRedis(key, count, CacheTTL.LONG);
        return count
      };
    } catch (error) {
      logger.error(`rolesService :: listRolesCount :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  addRole: async (role: IRole) => {
    try {
      const _query = {
        text: ROLES.addRole,
        values: [role.role_name, role.role_description, role.level, role.created_by, role.updated_by]
      };
      logger.debug(`rolesService :: addRole :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: addRole :: db result :: ${JSON.stringify(result)}`)

      const createRoleId = result[0].role_id;

      if (role.permissions && role.permissions.length > 0) {
        for (const permission of role.permissions) {
          await rolesService.addPermissions(createRoleId, permission.menu_id, permission.permission_id, role.updated_by);
        }
      }

      redis.deleteRedis(`roles`);
      redis.deleteRedis(`roles|active`);
      redis.deleteRedis(`roles|limit:50`);
      redis.deleteRedis(`roles|count`);
    } catch (error) {
      logger.error(`rolesService :: addRole :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  updateRole: async (role: IRole) => {
    try {
      const _query = {
        text: ROLES.updateRole,
        values: [role.role_id, role.role_name, role.role_description, role.level, role.updated_by, role.status]
      };
      logger.debug(`rolesService :: updateRole :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: updateRole :: db result :: ${JSON.stringify(result)}`)

      if (role.permissions && role.permissions.length > 0) {
        await rolesService.deleteExistingPermissions(role.role_id);
        for (const permission of role.permissions) {
          await rolesService.addPermissions(role.role_id, permission.menu_id, permission.permission_id, role.updated_by);
        }
      }

      redis.deleteRedis(`role:${role.role_id}`);
      redis.deleteRedis(`roles`);
      redis.deleteRedis(`roles|active`);
      redis.deleteRedis(`roles|limit:50`);
      redis.deleteRedis(`access_list|role:${role.role_id}`);
    } catch (error) {
      logger.error(`rolesService :: updateRole :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  getRoleById: async (roleId: number): Promise<IRole> => {
    try {
      const key = `role:${roleId}`
      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`rolesService :: getRoleById :: roleId :: ${roleId} :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const _query = {
        text: ROLES.getRole,
        values: [roleId]
      };
      logger.debug(`rolesService :: getRoleById :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: getRoleById :: db result :: ${JSON.stringify(result)}`)

      if (result && result.length > 0) redis.SetRedis(key, result[0], CacheTTL.LONG);
      return result && result.length > 0 ? result[0] : [];
    } catch (error) {
      logger.error(`rolesService :: getRoleById :: roleId :: ${roleId} :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  updateRoleStatus: async (roleId: number, status: number, updatedBy: number) => {
    try {
      const _query = {
        text: ROLES.updateRoleStatus,
        values: [roleId, status, updatedBy]
      };
      logger.debug(`rolesService :: updateRoleStatus :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: updateRoleStatus :: db result :: ${JSON.stringify(result)}`)

      redis.deleteRedis(`role:${roleId}`);
      redis.deleteRedis(`roles`);
      redis.deleteRedis(`roles|active`);
      redis.deleteRedis(`roles|limit:50`);
    } catch (error) {
      logger.error(`rolesService :: updateRoleStatus :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  getAccessListByRoleId: async (roleId: number): Promise<any> => {
    try {
      const key = `access_list|role:${roleId}`
      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`rolesService :: getAccessListByRoleId :: roleId :: ${roleId} :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const _query = {
        text: ROLES.getAccessListByRoleId,
        values: [roleId]
      };
      logger.debug(`rolesService :: getAccessListByRoleId :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: getAccessListByRoleId :: db result :: ${JSON.stringify(result)}`)

      redis.SetRedis(key, result, CacheTTL.LONG);
      return result;
    } catch (error) {
      logger.error(`rolesService :: getAccessListByRoleId :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  getMenusList: async (isActive: boolean): Promise<any> => {
    try {
      const _query = {
        text: ROLES.getMenusList + ` ${isActive ? 'WHERE status = 1 ORDER BY menu_order ASC' : 'ORDER BY menu_order ASC'}`
      };

      logger.debug(`rolesService :: getMenusList :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: getMenusList :: db result :: ${JSON.stringify(result)}`)

      return result;
    } catch (error) {
      logger.error(`rolesService :: getMenusList :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  getDefaultAccessList: async (): Promise<any> => {
    try {
      const _query = {
        text: ROLES.getDefaultAccessList
      };
      logger.debug(`rolesService :: getDefaultAccessList :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: getDefaultAccessList :: db result :: ${JSON.stringify(result)}`)

      return result;
    } catch (error) {
      logger.error(`rolesService :: getDefaultAccessList :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  existsByRoleId: async (roleId: number): Promise<boolean> => {
    try {
      const _query = {
        text: ROLES.existsByRoleId,
        values: [roleId]
      };
      logger.debug(`rolesService :: existsByRoleId :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: existsByRoleId :: db result :: ${JSON.stringify(result)}`)

      return (result && result.length > 0) ? result[0].exists : false;
    } catch (error) {
      logger.error(`rolesService :: existsByRoleId :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  existsByRoleName: async (roleName: string, roleId: number | undefined): Promise<boolean> => {
    try {
      const _query = {
        text: ROLES.existsByRoleName,
        values: [roleName]
      };
      if (roleId) _query.text = _query.text.replace(`status = 1`, `status = 1 AND role_id <> ${roleId}`);
      logger.debug(`rolesService :: existsByRoleName :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: existsByRoleName :: db result :: ${JSON.stringify(result)}`)

      return (result && result.length > 0) ? result[0].exists : false;
    } catch (error) {
      logger.error(`rolesService :: existsByRoleName :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  deleteExistingPermissions: async (roleId: number) => {
    try {
      const _query = {
        text: ROLES.deleteExistingPermissions,
        values: [roleId]
      };
      logger.debug(`rolesService :: deleteExistingPermissions :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: deleteExistingPermissions :: db result :: ${JSON.stringify(result)}`)

      return (result && result.length > 0) ? result[0].exists : false;
    } catch (error) {
      logger.error(`rolesService :: deleteExistingPermissions :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  addPermissions: async (roleId: number, menu_id: number, permission_id: number, updated_by: number) => {
    try {
      const _query = {
        text: ROLES.addPermissions,
        values: [roleId, menu_id, permission_id, updated_by]
      };
      logger.debug(`rolesService :: addPermissions :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: addPermissions :: db result :: ${JSON.stringify(result)}`)
    } catch (error) {
      logger.error(`rolesService :: addPermissions :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  getRolesByLevel: async (level: string): Promise<IRole[]> => {
    try {
      const _query = {
        text: ROLES.getRolesByLevel,
        values: [level]
      };
      logger.debug(`rolesService :: getRolesByLevel :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`rolesService :: getRolesByLevel :: db result :: ${JSON.stringify(result)}`)

      return result
    } catch (error) {
      logger.error(`rolesService :: getRolesByLevel :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
}