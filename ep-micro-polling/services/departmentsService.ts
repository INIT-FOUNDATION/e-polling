import { pg, logger, redis } from "owa-micro-common";
import { DEPARTMENTS } from "../constants/QUERY";
import { IDepartment } from "../types/custom";
import { CACHE_TTL } from "../constants/CONST";

export const departmentsService = {
  listDepartments: async (): Promise<IDepartment[]> => {
    try {
      const key = `DEPARTMENTS`;
      const cachedResult = await redis.GetKeyRedis(key);

      if (cachedResult) {
        logger.debug(`departmentsService :: listDepartments :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const _query = {
        text: DEPARTMENTS.listDepartments
      };
      logger.debug(`departmentsService :: listDepartments :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`departmentsService :: listDepartments :: db result :: ${JSON.stringify(result)}`)

      if (result && result.length > 0) redis.SetRedis(key, result, CACHE_TTL.LONG);
      return result;
    } catch (error) {
      logger.error(`departmentsService :: listDepartments :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  addDepartment: async (department: IDepartment) => {
    try {
      const _query = {
        text: DEPARTMENTS.addDepartment,
        values: [department.department_name]
      };
      logger.debug(`departmentsService :: addDepartment :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`departmentsService :: addDepartment :: db result :: ${JSON.stringify(result)}`)

      redis.deleteRedis(`DEPARTMENTS`);
    } catch (error) {
      logger.error(`departmentsService :: addDepartment :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  updateDepartment: async (department: IDepartment) => {
    try {
      const _query = {
        text: DEPARTMENTS.updateDepartment,
        values: [department.department_id, department.department_name]
      };
      logger.debug(`departmentsService :: updateDepartment :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`departmentsService :: updateDepartment :: db result :: ${JSON.stringify(result)}`)

      redis.deleteRedis(`DEPARTMENT:${department.department_id}`);
      redis.deleteRedis('DEPARTMENTS');
    } catch (error) {
      logger.error(`departmentsService :: updateDepartment :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  getDepartmentById: async (departmentId: number): Promise<IDepartment> => {
    try {
      const key = `DEPARTMENT:${departmentId}`
      const cachedResult = await redis.GetKeyRedis(key);
      if (cachedResult) {
        logger.debug(`departmentsService :: getDepartmentById :: departmentId :: ${departmentId} :: cached result :: ${cachedResult}`)
        return JSON.parse(cachedResult)
      }

      const _query = {
        text: DEPARTMENTS.getDepartment,
        values: [departmentId]
      };
      logger.debug(`departmentsService :: getDepartmentById :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`departmentsService :: getDepartmentById :: db result :: ${JSON.stringify(result)}`)

      if (result && result.length > 0) redis.SetRedis(key, result[0], CACHE_TTL.LONG);
      return result && result.length > 0 ? result[0] : [];
    } catch (error) {
      logger.error(`departmentsService :: getDepartmentById :: departmentId :: ${departmentId} :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  updateDepartmentStatus: async (departmentId: number, status: number) => {
    try {
      const _query = {
        text: DEPARTMENTS.updateDepartmentStatus,
        values: [departmentId, status]
      };
      logger.debug(`departmentsService :: updateDepartmentStatus :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`departmentsService :: updateDepartmentStatus :: db result :: ${JSON.stringify(result)}`)

      redis.deleteRedis(`DEPARTMENT:${departmentId}`);
      redis.deleteRedis(`DEPARTMENTS`);
    } catch (error) {
      logger.error(`departmentsService :: updateDepartmentStatus :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  existsByDepartmentId: async (departmentId: number): Promise<boolean> => {
    try {
      const _query = {
        text: DEPARTMENTS.existsByDepartmentId,
        values: [departmentId]
      };
      logger.debug(`departmentsService :: existsByDepartmentId :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`departmentsService :: existsByDepartmentId :: db result :: ${JSON.stringify(result)}`)

      return (result && result.length > 0) ? result[0].exists : false;
    } catch (error) {
      logger.error(`departmentsService :: existsByDepartmentId :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
  existsByDepartmentName: async (departmentName: string, departmentId: number | undefined): Promise<boolean> => {
    try {
      const _query = {
        text: DEPARTMENTS.existsByDepartmentName,
        values: [departmentName]
      };
      if (departmentId) _query.text = _query.text.replace('status = 1', `status = 1 AND department_id <> ${departmentId}`)
      logger.debug(`departmentsService :: existsByDepartmentName :: query :: ${JSON.stringify(_query)}`)

      const result = await pg.executeQueryPromise(_query);
      logger.debug(`departmentsService :: existsByDepartmentName :: db result :: ${JSON.stringify(result)}`)

      return (result && result.length > 0) ? result[0].exists : false;
    } catch (error) {
      logger.error(`departmentsService :: existsByDepartmentName :: ${error.message} :: ${error}`)
      throw new Error(error.message);
    }
  },
}