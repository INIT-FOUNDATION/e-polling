import { logger, STATUS } from "ep-micro-common";
import { Response } from "express";
import { Request } from "../types/express";
import { IDepartment } from "../types/custom";
import { DEPARTMENTS } from "../constants/ERRORCODE";
import { departmentsService } from "../services/departmentsService";
import { Department, validateCreateDepartment, validateUpdateDepartment, validateUpdateDepartmentStatus } from "../models/departmentsModel";

export const departmentsController = {
  listDepartments: async (req: Request, res: Response): Promise<Response> => {
    try {
      /*  
          #swagger.tags = ['Departments']
          #swagger.summary = 'List Departments'
          #swagger.description = 'Endpoint to retrieve Department List'
      */
      const departments = await departmentsService.listDepartments();
      return res.status(STATUS.OK).send({
        data: departments,
        message: "Departments Fetched Successfully",
      });
    } catch (error) {
      logger.error(`departmentsController :: listDepartments :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(DEPARTMENTS.DEPARTMENT000);
    }
  },
  addDepartment: async (req: Request, res: Response): Promise<Response> => {
    try {
      /*  
          #swagger.tags = ['Departments']
          #swagger.summary = 'Add Department'
          #swagger.description = 'Endpoint to Add Department'
          #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                        department_name: 'Accounts'
                }
          }    
      */
      const department: IDepartment = new Department(req.body)
      const { error } = validateCreateDepartment(department);

      if (error) {
        if (error.details != null)
          return res.status(STATUS.BAD_REQUEST).send({ errorCode: DEPARTMENTS.DEPARTMENT000.errorCode, errorMessage: error.details[0].message });
        else return res.status(STATUS.BAD_REQUEST).send({ errorCode: DEPARTMENTS.DEPARTMENT000.errorCode, errorMessage: error.message });
      }

      const departmentExistsByName = await departmentsService.existsByDepartmentName(department.department_name, null);
      if (departmentExistsByName) return res.status(STATUS.BAD_REQUEST).send(DEPARTMENTS.DEPARTMENT005);

      await departmentsService.addDepartment(department);

      return res.status(STATUS.OK).send({
        data: null,
        message: "Department Added Successfully",
      });
    } catch (error) {
      logger.error(`departmentsController :: addDepartment :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(DEPARTMENTS.DEPARTMENT000);
    }
  },
  updateDepartment: async (req: Request, res: Response): Promise<Response> => {
    try {
      /*  
          #swagger.tags = ['Departments']
          #swagger.summary = 'Update Department'
          #swagger.description = 'Endpoint to Update Department'
          #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                        department_id: 1,
                        department_name: 'Accounts'
                }
          }    
      */
      const department: IDepartment = req.body
      const { error } = validateUpdateDepartment(department);

      if (error) {
        if (error.details != null)
          return res.status(STATUS.BAD_REQUEST).send({ errorCode: DEPARTMENTS.DEPARTMENT000.errorCode, errorMessage: error.details[0].message });
        else return res.status(STATUS.BAD_REQUEST).send({ errorCode: DEPARTMENTS.DEPARTMENT000.errorCode, errorMessage: error.message });
      }

      const departmentExistsById = await departmentsService.existsByDepartmentId(department.department_id);
      if (!departmentExistsById) return res.status(STATUS.BAD_REQUEST).send(DEPARTMENTS.DEPARTMENT003);

      const departmentExistsByName = await departmentsService.existsByDepartmentName(department.department_name, department.department_id);
      if (departmentExistsByName) return res.status(STATUS.BAD_REQUEST).send(DEPARTMENTS.DEPARTMENT005);

      await departmentsService.updateDepartment(department);

      return res.status(STATUS.OK).send({
        data: null,
        message: "Department Updated Successfully",
      });
    } catch (error) {
      logger.error(`departmentsController :: updateDepartment :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(DEPARTMENTS.DEPARTMENT000);
    }
  },
  getDepartmentById: async (req: Request, res: Response): Promise<Response> => {
    try {
      /*  
          #swagger.tags = ['Departments']
          #swagger.summary = 'Get Department'
          #swagger.description = 'Endpoint to retrieve Department Information'
      */
      const departmentId = req.params.departmentId;
      if (!departmentId) return res.status(STATUS.BAD_REQUEST).send(DEPARTMENTS.DEPARTMENT002)

      const departmentExists = await departmentsService.existsByDepartmentId(parseInt(departmentId));
      if (!departmentExists) return res.status(STATUS.BAD_REQUEST).send(DEPARTMENTS.DEPARTMENT003);

      const department = await departmentsService.getDepartmentById(parseInt(departmentId));

      return res.status(STATUS.OK).send({
        data: department,
        message: "Department Fetched Successfully",
      });
    } catch (error) {
      logger.error(`departmentsController :: getDepartmentById :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(DEPARTMENTS.DEPARTMENT000);
    }
  },
  updateDepartmentStatus: async (req: Request, res: Response): Promise<Response> => {
    try {
      /*  
          #swagger.tags = ['Departments']
          #swagger.summary = 'Update Department Status'
          #swagger.description = 'Endpoint to Update Department Status'
          #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                        department_id: 1,
                        status: 1
                }
          }    
      */
      const department: IDepartment = req.body
      const { error } = validateUpdateDepartmentStatus(department);

      if (error) {
        if (error.details != null)
          return res.status(STATUS.BAD_REQUEST).send({ errorCode: DEPARTMENTS.DEPARTMENT000.errorCode, errorMessage: error.details[0].message });
        else return res.status(STATUS.BAD_REQUEST).send({ errorCode: DEPARTMENTS.DEPARTMENT000.errorCode, errorMessage: error.message });
      }

      const departmentExists = await departmentsService.existsByDepartmentId(department.department_id);
      if (!departmentExists) return res.status(STATUS.BAD_REQUEST).send(DEPARTMENTS.DEPARTMENT003);

      await departmentsService.updateDepartmentStatus(department.department_id, department.status);

      return res.status(STATUS.OK).send({
        data: null,
        message: "Department Status Updated Successfully",
      });
    } catch (error) {
      logger.error(`departmentsController :: updateDepartmentStatus :: ${error.message} :: ${error}`);
      return res.status(STATUS.INTERNAL_SERVER_ERROR).send(DEPARTMENTS.DEPARTMENT000);
    }
  },
}