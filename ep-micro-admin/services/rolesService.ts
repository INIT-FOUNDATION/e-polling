import { pg, logger, redis } from "ep-micro-common";
import { ROLES } from "../constants/QUERY";
import { IRole } from "../types/custom";
import { CacheTTL } from "../enums";
import { rolesRepository } from "../repositories";

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
      const createdRole = await rolesRepository.addRole(role);
      const createRoleId = createdRole[0].role_id;

      if (role.permissions && role.permissions.length > 0) {
        for (const permission of role.permissions) {
          await rolesRepository.addPermissions(createRoleId, permission.menu_id, permission.permission_id, role.updated_by);
        }
      }

      await redis.deleteRedis(`roles`);
      await redis.deleteRedis(`roles|active`);
      await redis.deleteRedis(`roles|limit:50`);
      await redis.deleteRedis(`roles|count`);
    } catch (error) {
      logger.error(`rolesService :: addRole :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  updateRole: async (role: IRole) => {
    try {
      await rolesRepository.updateRole(role);

      if (role.permissions && role.permissions.length > 0) {
        await rolesRepository.deleteExistingPermissions(role.role_id);
        for (const permission of role.permissions) {
          await rolesRepository.addPermissions(role.role_id, permission.menu_id, permission.permission_id, role.updated_by);
        }
      }

      await redis.deleteRedis(`role:${role.role_id}`);
      await redis.deleteRedis(`roles`);
      await redis.deleteRedis(`roles|active`);
      await redis.deleteRedis(`roles|limit:50`);
      await redis.deleteRedis(`access_list|role:${role.role_id}`);
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

      const role = await rolesRepository.getRole(roleId);
      if (role) redis.SetRedis(key, role, CacheTTL.LONG);
      return role;
    } catch (error) {
      logger.error(`rolesService :: getRoleById :: roleId :: ${roleId} :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  updateRoleStatus: async (roleId: number, status: number, updatedBy: number) => {
    try {
      await rolesRepository.updateRoleStatus(roleId, status, updatedBy);

      await redis.deleteRedis(`role:${roleId}`);
      await redis.deleteRedis(`roles`);
      await redis.deleteRedis(`roles|active`);
      await redis.deleteRedis(`roles|limit:50`);
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

      const result = await rolesRepository.getAccessListByRoleId(roleId);
      if (result) redis.SetRedis(key, result, CacheTTL.LONG);
      return result;
    } catch (error) {
      logger.error(`rolesService :: getAccessListByRoleId :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
}